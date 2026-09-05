import { unified } from "unified";
import remarkParse from "remark-parse";
import { parseDocument } from "yaml";
import type { RootContent, Heading, Link } from "mdast";
import { guideSchema, type GuideSection } from "./schema";

const parser = unified().use(remarkParse);
const identityPattern = /^producer:es:([1-9]\d*)$/;

function headingText(node: Heading): string {
  return node.children.map((child) => {
    if (child.type !== "text") throw new Error("Section headings must contain plain text");
    return child.value;
  }).join("");
}

/** Markdown is the authored source; this validated model is only a read model. */
export function parseGuideMarkdown(document: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(document);
  if (!match) throw new Error("Guide requires YAML front matter");
  const yaml = parseDocument(match[1], { uniqueKeys: true });
  if (yaml.errors.length) throw new Error(yaml.errors.map((error) => error.message).join("; "));
  const metadata: unknown = yaml.toJS({ maxAliasCount: 0 });
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata))
    throw new Error("Guide front matter must be a mapping");
  for (const derived of ["introduction", "sections", "selectionCriteria"])
    if (derived in metadata) throw new Error(`${derived} belongs in the Markdown body`);
  const body = match[2];
  const nodes = parser.parse(body).children;
  const raw = (items: RootContent[]) => items.length
    ? body.slice(items[0].position!.start.offset, items.at(-1)!.position!.end.offset).trim()
    : "";
  const groups: { id: string; title: string; nodes: RootContent[] }[] = [];
  const introduction: RootContent[] = [];
  for (const node of nodes) {
    if (node.type === "heading" && node.depth === 1)
      throw new Error("The guide title belongs in front matter; use ## for sections");
    if (node.type === "heading" && node.depth === 2) {
      const title = headingText(node);
      const anchor = /^(.*?)\s+\{#([a-z0-9]+(?:-[a-z0-9]+)*)\}$/.exec(title);
      const id = anchor?.[2] ?? title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      groups.push({ id, title: anchor?.[1] ?? title, nodes: [] });
    } else (groups.at(-1)?.nodes ?? introduction).push(node);
  }
  let selectionCriteria = "";
  const sections: GuideSection[] = [];
  for (const group of groups) {
    if (group.id === "criterio-editorial") {
      if (selectionCriteria) throw new Error("Repeated editorial criteria section");
      selectionCriteria = raw(group.nodes);
      continue;
    }
    const producerHeading = (node: RootContent): Link | undefined => {
      if (node.type !== "heading" || node.depth !== 3 || node.children.length !== 1) return;
      const link = node.children[0];
      if (link.type === "link" && identityPattern.test(link.url)) return link;
    };
    if (!group.nodes.some(producerHeading)) {
      sections.push({ type: "prose", id: group.id, title: group.title, markdown: raw(group.nodes) });
      continue;
    }
    const items: { country: "es"; producerId: number; focus: string }[] = [];
    const lead: RootContent[] = [];
    let focus: RootContent[] = [];
    let showMap = false;
    const flush = () => { if (items.length) items.at(-1)!.focus = raw(focus); focus = []; };
    for (const node of group.nodes) {
      if (node.type === "html" && node.value.trim() === "<!-- mapa -->") {
        if (showMap) throw new Error("Repeated map in producer section");
        showMap = true;
        continue;
      }
      const link = producerHeading(node);
      if (link) {
        flush();
        items.push({ country: "es", producerId: Number(identityPattern.exec(link.url)![1]), focus: "" });
      } else (items.length ? focus : lead).push(node);
    }
    flush();
    sections.push({ type: "producers", id: group.id, title: group.title, introduction: raw(lead), showMap, items });
  }
  // Never silently discard executable HTML, unknown widgets or misplaced identities.
  const check = (node: { type: string; value?: string; url?: string; children?: unknown[] }, parent?: string) => {
    if (node.type === "html" && node.value?.trim() !== "<!-- mapa -->")
      throw new Error("Raw HTML is not supported in guides");
    if (node.type === "link" && node.url?.startsWith("producer:") && (!identityPattern.test(node.url) || parent !== "heading"))
      throw new Error("Producer references use ### [Name](producer:es:ID)");
    for (const child of node.children ?? []) check(child as Parameters<typeof check>[0], node.type);
  };
  for (const node of nodes) check(node);
  const mapCount = nodes.filter((node) => node.type === "html" && node.value.trim() === "<!-- mapa -->").length;
  if (mapCount !== sections.filter((section) => section.type === "producers" && section.showMap).length)
    throw new Error("A map must belong to a producer section");
  const producerLinks = (body.match(/\]\(producer:/g) ?? []).length;
  if (producerLinks !== sections.reduce((sum, section) => sum + (section.type === "producers" ? section.items.length : 0), 0))
    throw new Error("Every producer reference must be a dedicated ### heading");
  return guideSchema.parse({ ...metadata, introduction: raw(introduction), selectionCriteria, sections });
}
