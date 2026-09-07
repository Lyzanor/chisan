import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";

import {
  PRODUCER_PREMIUM_EDITABLE_FIELDS,
  PRODUCER_STANDARD_EDITABLE_FIELDS,
  hashProducerFields,
} from "../lib/accounts/producer-fields";
import {
  PRODUCER_SUGGESTION_SECTIONS,
  PRODUCER_SUGGESTION_SECTION_KEYS,
  isProducerSuggestionPatchInSection,
  isProducerSuggestionSection,
  producerSuggestionSectionFields,
  type ProducerSuggestionSection,
} from "../lib/accounts/producer-suggestion-sections";
import {
  SUGGESTION_MAX_OPEN_PER_ACCOUNT,
  createProducerSuggestionSubmissionService,
  createProducerSuggestionWithdrawalService,
  type ProducerSuggestionFormState,
} from "../lib/accounts/producer-suggestion-submission";
import {
  OPEN_PRODUCER_SUGGESTION_STATUSES,
  PRODUCER_SUGGESTION_STATUSES,
  getProducerSuggestionStatusDefinition,
  newProducerSuggestionPath,
  resolveProducerSuggestionStatusSelection,
} from "../lib/accounts/producer-suggestion-workflow";
import {
  queryAdminProducerSuggestions,
  queryProducerSuggestionCounts,
} from "../lib/admin/producer-suggestions";
import { createProducerSuggestionReviewService } from "../lib/admin/review-producer-suggestion";
import { findProducerById } from "../lib/csv-catalog";
import * as schema from "../lib/db/schema";

const FIXTURE_COUNTRY = "es";
const FIXTURE_PRODUCER_ID = 12439;
const EMPTY_STATE: ProducerSuggestionFormState = {
  fieldErrors: {},
  formError: null,
  reloadRequired: false,
  revision: 0,
  values: {},
};

type Fixture = Awaited<ReturnType<typeof createFixture>>;

function throwingRedirect(
  path: string,
  kind: string,
  message: string,
): never {
  const url = new URL(path, "https://chisan.invalid");
  url.searchParams.set(kind, message);
  throw new Error(`REDIRECT:${url.pathname}${url.search}`);
}

async function captureRedirect(run: () => Promise<unknown>): Promise<string> {
  try {
    await run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.startsWith("REDIRECT:")) return message.slice("REDIRECT:".length);
    throw error;
  }
  throw new Error("Expected a redirect.");
}

async function applyAccountMigrations(database: PGlite): Promise<void> {
  const files = (await readdir("drizzle"))
    .filter((name) => /^\d{4}_.+\.sql$/.test(name))
    .sort();
  for (const file of files) {
    await database.exec(await readFile(`drizzle/${file}`, "utf8"));
  }
}

async function createFixture() {
  const pg = new PGlite();
  const db = drizzle(pg, { schema });
  await applyAccountMigrations(pg);
  const database = db as unknown as import("../lib/db").Database;
  const producer = await findProducerById(FIXTURE_COUNTRY, FIXTURE_PRODUCER_ID);
  assert.ok(producer, "the catalog fixture producer must be published");
  const [reader, otherReader, owner, reviewer] = await db
    .insert(schema.users)
    .values([
      { displayName: "Suggestion reader" },
      { displayName: "Other suggestion reader" },
      { displayName: "Suggestion producer owner" },
      { displayName: "Suggestion reviewer" },
    ])
    .returning();

  return { pg, db, database, producer, reader, otherReader, owner, reviewer };
}

function submissionService(
  fixture: Fixture,
  accountId: string,
  overrides: { emailVerified?: boolean; termsAcceptedAt?: Date | null } = {},
) {
  return createProducerSuggestionSubmissionService({
    getDatabase: () => fixture.database,
    requireCurrentAccount: async () => ({
      id: accountId,
      emailVerified: overrides.emailVerified ?? true,
      termsAcceptedAt:
        overrides.termsAcceptedAt === undefined
          ? new Date("2026-01-01T00:00:00Z")
          : overrides.termsAcceptedAt,
    }),
    redirectWithMessage: throwingRedirect,
    redirect: (path: string): never => {
      throw new Error(`REDIRECT:${path}`);
    },
  });
}

function reviewService(fixture: Fixture, reviewerId: string) {
  return createProducerSuggestionReviewService({
    getDatabase: () => fixture.database,
    requireStaffAccount: async () => ({ id: reviewerId }),
    adminRedirect: throwingRedirect,
  });
}

function sectionFormData(
  fixture: Fixture,
  section: ProducerSuggestionSection,
  overrides: Record<string, string>,
  note = "Lo vi en el cartel del obrador la semana pasada.",
  baseRowHash = hashProducerFields(fixture.producer!.fields),
): FormData {
  const formData = new FormData();
  formData.set("country", FIXTURE_COUNTRY);
  formData.set("producerId", String(FIXTURE_PRODUCER_ID));
  formData.set("section", section);
  formData.set("baseRowHash", baseRowHash);
  for (const field of producerSuggestionSectionFields(section)) {
    formData.set(
      field.key,
      overrides[field.key] ?? fixture.producer!.fields[field.key] ?? "",
    );
  }
  formData.set("authorNote", note);
  return formData;
}

test("suggestion sections partition every standard field and exclude expanded ones", () => {
  const sectionKeys = PRODUCER_SUGGESTION_SECTION_KEYS.flatMap(
    (key) => PRODUCER_SUGGESTION_SECTIONS[key].fields as readonly string[],
  );
  const standardKeys = PRODUCER_STANDARD_EDITABLE_FIELDS.map(({ key }) => key);

  assert.deepEqual(
    [...sectionKeys].sort(),
    [...standardKeys].sort(),
    "every standard editable field belongs to exactly one suggestion section",
  );
  assert.equal(
    new Set(sectionKeys).size,
    sectionKeys.length,
    "a field cannot appear in two sections",
  );
  const premiumKeys = new Set(
    PRODUCER_PREMIUM_EDITABLE_FIELDS.map(({ key }) => key as string),
  );
  assert.ok(
    sectionKeys.every((key) => !premiumKeys.has(key)),
    "expanded profile fields need an entitlement an unclaimed producer cannot hold",
  );
  assert.ok(
    PRODUCER_SUGGESTION_SECTIONS.descripcion.fields.includes(
      "descripcion_locale",
    ),
    "a description change always carries its paired source language",
  );
  assert.equal(isProducerSuggestionSection("identidad"), true);
  assert.equal(isProducerSuggestionSection("premium"), false);
  assert.equal(
    isProducerSuggestionPatchInSection("contacto", { web: "https://x.test" }),
    true,
  );
  assert.equal(
    isProducerSuggestionPatchInSection("contacto", { historia: "no" }),
    false,
  );
});

test("suggestion status vocabulary and routes stay in one place", () => {
  const covered = PRODUCER_SUGGESTION_STATUSES.map((status) =>
    getProducerSuggestionStatusDefinition(status),
  );
  assert.equal(covered.length, 5);
  assert.ok(covered.every((definition) => definition.label.length > 0));
  assert.ok(covered.every((definition) => definition.accountLabel.length > 0));
  assert.deepEqual(resolveProducerSuggestionStatusSelection("review").statuses, [
    "pending",
  ]);
  assert.equal(
    resolveProducerSuggestionStatusSelection("nonsense").key,
    "all",
    "an unknown filter falls back to the whole registry",
  );
  assert.equal(
    newProducerSuggestionPath("es", 12439, "contacto"),
    "/cuenta/sugerencias/nueva?country=es&producerId=12439&seccion=contacto",
  );
  assert.equal(
    newProducerSuggestionPath("es", 12439),
    "/cuenta/sugerencias/nueva?country=es&producerId=12439",
  );
});

test("a reader corrects one section of an unclaimed producer", async () => {
  const fixture = await createFixture();
  try {
    const submit = submissionService(fixture, fixture.reader.id);
    const destination = await captureRedirect(() =>
      submit(
        EMPTY_STATE,
        sectionFormData(fixture, "horario", {
          horario: "Lunes a viernes de 9:00 a 14:00",
        }),
      ),
    );
    assert.match(destination, /^\/cuenta\/sugerencias\?notice=/);

    const [stored] = await fixture.db
      .select()
      .from(schema.producerSuggestions)
      .where(eq(schema.producerSuggestions.authorUserId, fixture.reader.id));
    assert.equal(stored.status, "pending");
    assert.equal(stored.section, "horario");
    assert.equal(stored.country, FIXTURE_COUNTRY);
    assert.equal(stored.producerId, FIXTURE_PRODUCER_ID);
    assert.deepEqual(Object.keys(stored.patch), ["horario"]);
    assert.equal(stored.patch.horario, "Lunes a viernes de 9:00 a 14:00");
    assert.equal(
      stored.baseRowHash,
      hashProducerFields(fixture.producer!.fields),
    );
    assert.equal(
      stored.baseSnapshot.nombre,
      fixture.producer!.fields.nombre,
      "the reviewer sees what the reader was actually looking at",
    );
    assert.equal(stored.reviewerUserId, null);
    assert.equal(stored.appliedAt, null);

    const memberships = await fixture.db
      .select()
      .from(schema.producerMemberships)
      .where(eq(schema.producerMemberships.userId, fixture.reader.id));
    assert.deepEqual(
      memberships,
      [],
      "a suggestion never grants its author producer access",
    );
    const [audit] = await fixture.db
      .select()
      .from(schema.auditEvents)
      .where(eq(schema.auditEvents.action, "producer_suggestion.submitted"));
    assert.equal(audit.targetType, "producer_suggestion");
    assert.equal(audit.targetId, stored.id);
    assert.deepEqual(audit.metadata.fields, ["horario"]);

    const [profile] = await fixture.db
      .select({ profileKind: schema.users.profileKind })
      .from(schema.users)
      .where(eq(schema.users.id, fixture.reader.id));
    assert.equal(
      profile.profileKind,
      "user",
      "only a producer claim may promote the profile kind",
    );
  } finally {
    await fixture.pg.close();
  }
});

test("suggestions are refused for a producer with an active verified owner", async () => {
  const fixture = await createFixture();
  try {
    await fixture.db.insert(schema.producerMemberships).values({
      userId: fixture.owner.id,
      country: FIXTURE_COUNTRY,
      producerId: FIXTURE_PRODUCER_ID,
      role: "owner",
    });

    const destination = await captureRedirect(() =>
      submissionService(fixture, fixture.reader.id)(
        EMPTY_STATE,
        sectionFormData(fixture, "horario", { horario: "Solo sábados" }),
      ),
    );
    assert.match(destination, /titular\+verificado/);
    const stored = await fixture.db.select().from(schema.producerSuggestions);
    assert.deepEqual(stored, []);

    const memberDestination = await captureRedirect(() =>
      submissionService(fixture, fixture.owner.id)(
        EMPTY_STATE,
        sectionFormData(fixture, "horario", { horario: "Solo sábados" }),
      ),
    );
    assert.match(
      memberDestination,
      /^\/cuenta\/productores\/es\/12439\/editar\?notice=/,
      "a member is sent to the editor that actually owns their changes",
    );
  } finally {
    await fixture.pg.close();
  }
});

test("a suggestion must change something and must match the catalog it was written against", async () => {
  const fixture = await createFixture();
  try {
    const submit = submissionService(fixture, fixture.reader.id);

    const unchanged = await submit(
      EMPTY_STATE,
      sectionFormData(fixture, "horario", {}),
    );
    assert.match(unchanged.formError ?? "", /Cambia al menos un dato/);

    const stale = await submit(
      EMPTY_STATE,
      sectionFormData(
        fixture,
        "horario",
        { horario: "Nuevo horario" },
        "Lo vi en el cartel del obrador la semana pasada.",
        "0".repeat(64),
      ),
    );
    assert.equal(stale.reloadRequired, true);

    const shortNote = await submit(
      EMPTY_STATE,
      sectionFormData(fixture, "horario", { horario: "Nuevo horario" }, "corto"),
    );
    assert.match(shortNote.fieldErrors.authorNote ?? "", /al menos 20/);

    const invalidField = await submit(
      EMPTY_STATE,
      sectionFormData(fixture, "contacto", { web: "not-a-url" }),
    );
    assert.ok(invalidField.fieldErrors.web, "field validation still applies");

    assert.deepEqual(
      await fixture.db.select().from(schema.producerSuggestions),
      [],
      "no rejected attempt reaches the database",
    );
  } finally {
    await fixture.pg.close();
  }
});

test("one open suggestion per reader, producer and section", async () => {
  const fixture = await createFixture();
  try {
    const submit = submissionService(fixture, fixture.reader.id);
    await captureRedirect(() =>
      submit(
        EMPTY_STATE,
        sectionFormData(fixture, "horario", { horario: "Martes a domingo" }),
      ),
    );

    const duplicate = await captureRedirect(() =>
      submit(
        EMPTY_STATE,
        sectionFormData(fixture, "horario", { horario: "Solo festivos" }),
      ),
    );
    assert.match(duplicate, /sugerencia\+abierta/);

    await captureRedirect(() =>
      submit(
        EMPTY_STATE,
        sectionFormData(fixture, "contacto", {
          web: "https://ejemplo.test/productor",
        }),
      ),
    );
    const stored = await fixture.db
      .select({ section: schema.producerSuggestions.section })
      .from(schema.producerSuggestions);
    assert.deepEqual(
      stored.map(({ section }) => section).sort(),
      ["contacto", "horario"],
      "a different section is a different correction",
    );
  } finally {
    await fixture.pg.close();
  }
});

test("an accepted suggestion stays open until it is published or closed", async () => {
  const fixture = await createFixture();
  try {
    const submit = submissionService(fixture, fixture.reader.id);
    await captureRedirect(() =>
      submit(
        EMPTY_STATE,
        sectionFormData(fixture, "horario", { horario: "Martes a domingo" }),
      ),
    );
    const [pending] = await fixture.db
      .select()
      .from(schema.producerSuggestions);

    const review = reviewService(fixture, fixture.reviewer.id);
    const decision = (value: string, note: string, commitSha = "") => {
      const formData = new FormData();
      formData.set("suggestionId", pending.id);
      formData.set("decision", value);
      formData.set("note", note);
      formData.set("commitSha", commitSha);
      return formData;
    };
    await captureRedirect(() =>
      review(decision("approved", "Confirmed against the market stall sign.")),
    );

    const superseding = await captureRedirect(() =>
      submit(
        EMPTY_STATE,
        sectionFormData(fixture, "horario", { horario: "Solo festivos" }),
      ),
    );
    assert.match(
      superseding,
      /sugerencia\+abierta/,
      "an accepted correction still awaiting its Git edit must not be superseded",
    );
    assert.equal(
      (await fixture.db.select().from(schema.producerSuggestions)).length,
      1,
    );

    await captureRedirect(() =>
      review(decision("applied", "Committed to the Catalunya CSV.")),
    );
    await captureRedirect(() =>
      submit(
        EMPTY_STATE,
        sectionFormData(fixture, "horario", { horario: "Solo festivos" }),
      ),
    );
    const sections = await fixture.db
      .select({ status: schema.producerSuggestions.status })
      .from(schema.producerSuggestions);
    assert.deepEqual(
      sections.map(({ status }) => status).sort(),
      ["applied", "pending"],
      "publication releases the slot for the same section",
    );
  } finally {
    await fixture.pg.close();
  }
});

test("the per-account cap counts accepted work that is still unpublished", async () => {
  const fixture = await createFixture();
  try {
    const openStatuses = [...OPEN_PRODUCER_SUGGESTION_STATUSES];
    assert.deepEqual(
      openStatuses,
      ["pending", "approved"],
      "the quota, the button and the unique index share one definition of open",
    );

    // Fill the cap directly: the service enforces one submission per section,
    // and the cap is about total outstanding editorial work, not one producer.
    await fixture.db.insert(schema.producerSuggestions).values(
      Array.from({ length: SUGGESTION_MAX_OPEN_PER_ACCOUNT }, (_, index) => ({
        authorUserId: fixture.reader.id,
        country: FIXTURE_COUNTRY,
        producerId: 900 + index,
        status: "approved" as const,
        section: "horario",
        baseRowHash: "0".repeat(64),
        baseSnapshot: {},
        patch: { horario: `Horario ${index}` },
        authorNote: "Accepted and awaiting its editorial publication.",
        reviewerUserId: fixture.reviewer.id,
        reviewedAt: new Date("2026-02-01T00:00:00Z"),
      })),
    );

    const refused = await captureRedirect(() =>
      submissionService(fixture, fixture.reader.id)(
        EMPTY_STATE,
        sectionFormData(fixture, "contacto", { telefono: "+34600112233" }),
      ),
    );
    assert.match(refused, /demasiadas\+sugerencias\+abiertas/);
    assert.equal(
      (await fixture.db.select().from(schema.producerSuggestions)).length,
      SUGGESTION_MAX_OPEN_PER_ACCOUNT,
    );
  } finally {
    await fixture.pg.close();
  }
});

test("only the author withdraws a pending suggestion", async () => {
  const fixture = await createFixture();
  try {
    await captureRedirect(() =>
      submissionService(fixture, fixture.reader.id)(
        EMPTY_STATE,
        sectionFormData(fixture, "horario", { horario: "Cerrado en agosto" }),
      ),
    );
    const [stored] = await fixture.db
      .select()
      .from(schema.producerSuggestions);

    const withdraw = (accountId: string) =>
      createProducerSuggestionWithdrawalService({
        getDatabase: () => fixture.database,
        requireCurrentAccount: async () => ({ id: accountId }),
        redirectWithMessage: throwingRedirect,
      });
    const formData = new FormData();
    formData.set("suggestionId", stored.id);

    const foreign = await captureRedirect(() =>
      withdraw(fixture.otherReader.id)(formData),
    );
    assert.match(foreign, /error=/);
    const [untouched] = await fixture.db
      .select()
      .from(schema.producerSuggestions);
    assert.equal(untouched.status, "pending");

    const own = await captureRedirect(() => withdraw(fixture.reader.id)(formData));
    assert.match(own, /notice=/);
    const [closed] = await fixture.db.select().from(schema.producerSuggestions);
    assert.equal(closed.status, "withdrawn");

    const again = await captureRedirect(() =>
      withdraw(fixture.reader.id)(formData),
    );
    assert.match(again, /error=/);
  } finally {
    await fixture.pg.close();
  }
});

test("staff accept, publish and never revive a closed suggestion", async () => {
  const fixture = await createFixture();
  try {
    await captureRedirect(() =>
      submissionService(fixture, fixture.reader.id)(
        EMPTY_STATE,
        sectionFormData(fixture, "contacto", {
          telefono: "+34600112233",
        }),
      ),
    );
    const [submitted] = await fixture.db
      .select()
      .from(schema.producerSuggestions);
    const review = reviewService(fixture, fixture.reviewer.id);

    const decision = (
      suggestionId: string,
      value: string,
      note: string,
      commitSha = "",
    ) => {
      const formData = new FormData();
      formData.set("suggestionId", suggestionId);
      formData.set("decision", value);
      formData.set("note", note);
      formData.set("commitSha", commitSha);
      return formData;
    };

    const shortNote = await captureRedirect(() =>
      review(decision(submitted.id, "approved", "ok")),
    );
    assert.match(shortNote, /error=/);

    const tooEarly = await captureRedirect(() =>
      review(
        decision(
          submitted.id,
          "applied",
          "Published before it was ever accepted.",
        ),
      ),
    );
    assert.match(tooEarly, /error=/);

    await captureRedirect(() =>
      review(
        decision(
          submitted.id,
          "approved",
          "Phone confirmed against the producer's own website.",
        ),
      ),
    );
    const [accepted] = await fixture.db
      .select()
      .from(schema.producerSuggestions);
    assert.equal(accepted.status, "approved");
    assert.equal(accepted.reviewerUserId, fixture.reviewer.id);
    assert.ok(accepted.reviewedAt);
    assert.equal(
      accepted.appliedAt,
      null,
      "acceptance authorizes editorial work, it does not publish",
    );

    const badSha = await captureRedirect(() =>
      review(
        decision(
          submitted.id,
          "applied",
          "Committed to the Catalunya CSV.",
          "not-a-sha",
        ),
      ),
    );
    assert.match(badSha, /error=/);

    const sha = "a".repeat(40);
    await captureRedirect(() =>
      review(
        decision(
          submitted.id,
          "applied",
          "Committed to the Catalunya CSV.",
          sha,
        ),
      ),
    );
    const [published] = await fixture.db
      .select()
      .from(schema.producerSuggestions);
    assert.equal(published.status, "applied");
    assert.equal(published.appliedCommitSha, sha);
    assert.ok(published.appliedAt);
    assert.equal(
      published.reviewedAt?.getTime(),
      accepted.reviewedAt?.getTime(),
      "publication keeps the original review timestamp",
    );

    const reopened = await captureRedirect(() =>
      review(
        decision(submitted.id, "rejected", "Trying to reopen a closed record."),
      ),
    );
    assert.match(reopened, /error=/);
    const [final] = await fixture.db.select().from(schema.producerSuggestions);
    assert.equal(final.status, "applied");

    const decisions = await fixture.db
      .select({ action: schema.auditEvents.action })
      .from(schema.auditEvents)
      .where(eq(schema.auditEvents.actorUserId, fixture.reviewer.id));
    assert.deepEqual(
      decisions.map(({ action }) => action).sort(),
      ["producer_suggestion.applied", "producer_suggestion.approved"],
    );
  } finally {
    await fixture.pg.close();
  }
});

test("a submitted suggestion payload is immutable in PostgreSQL", async () => {
  const fixture = await createFixture();
  try {
    await captureRedirect(() =>
      submissionService(fixture, fixture.reader.id)(
        EMPTY_STATE,
        sectionFormData(fixture, "horario", { horario: "Solo con cita" }),
      ),
    );
    const [stored] = await fixture.db
      .select()
      .from(schema.producerSuggestions);

    await assert.rejects(
      fixture.pg.query(
        "update producer_suggestions set patch = '{\"horario\": \"Otra cosa\"}'::jsonb where id = $1",
        [stored.id],
      ),
      /immutable/i,
    );
    await assert.rejects(
      fixture.pg.query(
        "update producer_suggestions set producer_id = 1 where id = $1",
        [stored.id],
      ),
      /immutable/i,
    );
    await assert.rejects(
      fixture.pg.query(
        `insert into producer_suggestions
           (author_user_id, country, producer_id, section, base_row_hash, base_snapshot, patch, author_note)
         values ($1, 'es', 12439, 'horario', $2, '{}'::jsonb, '{}'::jsonb, 'A note that is long enough.')`,
        [fixture.reader.id, "0".repeat(64)],
      ),
      /producer_suggestions_patch_check/i,
      "a suggestion exists only to request a concrete change",
    );
  } finally {
    await fixture.pg.close();
  }
});

test("the operations queue reports counts and a reviewable diff", async () => {
  const fixture = await createFixture();
  try {
    await captureRedirect(() =>
      submissionService(fixture, fixture.reader.id)(
        EMPTY_STATE,
        sectionFormData(fixture, "contacto", {
          web: "https://ejemplo.test/productor",
        }),
      ),
    );
    await captureRedirect(() =>
      submissionService(fixture, fixture.otherReader.id)(
        EMPTY_STATE,
        sectionFormData(fixture, "horario", { horario: "Solo por la mañana" }),
      ),
    );

    const counts = await queryProducerSuggestionCounts(fixture.database);
    assert.equal(counts.pending, 2);
    assert.equal(counts.approved, 0);
    assert.equal(counts.applied, 0);

    const registry = await queryAdminProducerSuggestions(fixture.database, {
      status: "review",
    });
    assert.equal(registry.total, 2);
    assert.equal(registry.options.selection.key, "review");

    const contacto = registry.items.find(
      ({ suggestion }) => suggestion.section === "contacto",
    );
    assert.ok(contacto);
    assert.equal(contacto.sectionLabel, "Contact");
    assert.equal(contacto.producerName, fixture.producer!.name);
    assert.equal(contacto.author.displayName, "Suggestion reader");
    assert.equal(contacto.baseMatchesCatalog, true);
    assert.deepEqual(
      contacto.diff.map(({ key, requested, current }) => ({
        key,
        requested,
        current,
      })),
      [
        {
          key: "web",
          requested: "https://ejemplo.test/productor",
          current: fixture.producer!.fields.web ?? "",
        },
      ],
    );
    assert.ok(contacto.publicPath?.startsWith("/"));

    const filtered = await queryAdminProducerSuggestions(fixture.database, {
      query: "horario",
    });
    assert.equal(filtered.total, 1);
    assert.equal(filtered.items[0].suggestion.section, "horario");

    const closed = await queryAdminProducerSuggestions(fixture.database, {
      status: "closed",
    });
    assert.equal(closed.total, 0);
  } finally {
    await fixture.pg.close();
  }
});
