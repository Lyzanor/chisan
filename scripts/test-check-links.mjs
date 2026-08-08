#!/usr/bin/env node

// Protege la única parte de check:links con reglas editoriales: qué respuesta
// cuenta como señal y qué como incertidumbre. La distinción es la que impide
// que un tropiezo de red se convierta en una baja del catálogo.
//
// Fixtures sintéticos, nunca red: el clasificador es una función pura sobre el
// resultado de un sondeo, precisamente para poder probarlo aquí.

import assert from "node:assert/strict";

import {
  classifyProbe,
  mergeSnapshotUrls,
  registrableDomain,
} from "./check-links.mjs";

let passed = 0;
const test = (name, fn) => {
  try {
    fn();
    passed += 1;
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(`  ${error.message}`);
    process.exitCode = 1;
  }
};

const html = (body) => `<html><head><title>t</title></head><body>${body}</body></html>`;
const probe = (extra) => ({ url: "https://ejemplo.es/", ...extra });

// --- lo que NO puede ser una baja -------------------------------------------

test("un 403 es incertidumbre, no un sitio muerto", () => {
  // El caso que más se repite en las pasadas: SumUp, Cloudflare y medio
  // internet devuelven 403 a un cliente sin navegador.
  const out = classifyProbe(probe({ status: 403, finalUrl: "https://ejemplo.es/" }));
  assert.equal(out.tag, "http-403");
  assert.equal(out.level, "incertidumbre");
});

test("un timeout se clasifica como timeout, no como caída", () => {
  const out = classifyProbe(probe({ aborted: true }));
  assert.equal(out.tag, "timeout");
  assert.equal(out.level, "incertidumbre");
});

test("un certificado inválido es incertidumbre: el sitio existe", () => {
  for (const p of [
    probe({ errorCode: "ERR_TLS_CERT_ALTNAME_INVALID" }),
    probe({ errorCode: "", errorMessage: "unable to verify the first certificate" }),
    probe({ errorCode: "", errorMessage: "Host: x is not in the cert's altnames" }),
  ]) {
    const out = classifyProbe(p);
    assert.equal(out.tag, "tls", JSON.stringify(p));
    assert.equal(out.level, "incertidumbre");
  }
});

test("un 500 es incertidumbre: puede ser mantenimiento", () => {
  const out = classifyProbe(probe({ status: 503, finalUrl: "https://ejemplo.es/" }));
  assert.equal(out.level, "incertidumbre");
});

// --- las tres formas de no resolver -----------------------------------------

test("NXDOMAIN, sin NS y sin registro A son señales distintas", () => {
  const base = { errorCode: "ENOTFOUND" };
  assert.equal(classifyProbe(probe({ ...base, dns: "nxdomain" })).tag, "nxdomain");
  assert.equal(classifyProbe(probe({ ...base, dns: "sin-ns" })).tag, "sin-ns");
  assert.equal(classifyProbe(probe({ ...base, dns: "ok" })).tag, "sin-registro-a");
  for (const dns of ["nxdomain", "sin-ns", "ok"]) {
    assert.equal(classifyProbe(probe({ ...base, dns })).level, "señal");
  }
});

test("un fallo del resolver sin veredicto no acusa al dominio", () => {
  // EAI_AGAIN es "pregúntame luego", no "no existe".
  const out = classifyProbe(probe({ errorCode: "EAI_AGAIN", dns: "desconocido" }));
  assert.equal(out.tag, "dns");
  assert.equal(out.level, "incertidumbre");
});

test("conexión rechazada sí es señal", () => {
  const out = classifyProbe(probe({ errorCode: "ECONNREFUSED" }));
  assert.equal(out.tag, "conexion-rechazada");
  assert.equal(out.level, "señal");
});

// --- 200 que no son un sitio del productor ----------------------------------

test("parking se detecta aunque devuelva 200", () => {
  const out = classifyProbe(
    probe({ status: 200, finalUrl: "https://ejemplo.es/", body: html("This domain is for sale") }),
  );
  assert.equal(out.tag, "parking");
  assert.equal(out.level, "señal");
});

test("la portada por defecto de un proveedor no es un sitio", () => {
  const out = classifyProbe(
    probe({ status: 200, finalUrl: "https://ejemplo.es/", body: html("Welcome to nginx!") }),
  );
  assert.equal(out.tag, "portada-proveedor");
  assert.equal(out.level, "señal");
});

test("un dominio secuestrado por spam se detecta por el título", () => {
  const out = classifyProbe(
    probe({
      status: 200,
      finalUrl: "https://ejemplo.es/",
      body: "<html><head><title>Mejor casino online 2026</title></head><body>x</body></html>",
    }),
  );
  assert.equal(out.tag, "contenido-ajeno");
  assert.equal(out.level, "señal");
});

test("el spam solo se busca en el título, no en el cuerpo", () => {
  // Un productor de Casinos (Valencia) o un texto que mencione apuestas no
  // convierte su web en un dominio secuestrado.
  const out = classifyProbe(
    probe({
      status: 200,
      finalUrl: "https://ejemplo.es/",
      body: html("Nuestra bodega está en Casinos y no hacemos apuestas de nada"),
    }),
  );
  assert.equal(out.tag, "ok");
});

test("«cialis» dentro de «especialistas» no es spam", () => {
  const out = classifyProbe(
    probe({
      status: 200,
      finalUrl: "https://ejemplo.es/",
      body: "<html><head><title>Especialistas en jamón</title></head><body>x</body></html>",
    }),
  );
  assert.equal(out.tag, "ok");
});

// --- redirecciones ----------------------------------------------------------

test("redirigir a otro dominio es señal", () => {
  const out = classifyProbe(
    probe({ status: 200, finalUrl: "https://otracosa.com/", body: html("hola") }),
  );
  assert.equal(out.tag, "redirige");
  assert.equal(out.level, "señal");
});

test("redirigir dentro del mismo dominio no es señal", () => {
  // http→https, www→apex y /es/ son lo normal, no un dominio revendido.
  for (const finalUrl of [
    "https://www.ejemplo.es/",
    "https://ejemplo.es/es/inicio",
    "https://tienda.ejemplo.es/",
  ]) {
    const out = classifyProbe(probe({ status: 200, finalUrl, body: html("hola") }));
    assert.equal(out.tag, "ok", finalUrl);
  }
});

test("los dominios de segundo nivel no se confunden con una redirección", () => {
  const out = classifyProbe(
    probe({
      url: "https://www.ejemplo.com.es/",
      status: 200,
      finalUrl: "https://ejemplo.com.es/inicio",
      body: html("hola"),
    }),
  );
  assert.equal(out.tag, "ok");
});

// --- 404 --------------------------------------------------------------------

test("404 y 410 son señal", () => {
  assert.equal(classifyProbe(probe({ status: 404 })).level, "señal");
  assert.equal(classifyProbe(probe({ status: 410 })).level, "señal");
});

// --- registrableDomain ------------------------------------------------------

test("registrableDomain pliega www y respeta los TLD de dos niveles", () => {
  assert.equal(registrableDomain("www.ejemplo.es"), "ejemplo.es");
  assert.equal(registrableDomain("tienda.ejemplo.es"), "ejemplo.es");
  assert.equal(registrableDomain("www.ejemplo.com.es"), "ejemplo.com.es");
  assert.equal(registrableDomain("algo.ejemplo.co.uk"), "ejemplo.co.uk");
  assert.equal(registrableDomain("ejemplo.cat"), "ejemplo.cat");
});

test("el snapshot conserva URLs activas y poda las retiradas", () => {
  const previous = {
    "https://actual.example": { tag: "ok" },
    "https://retirada.example": { tag: "ok" },
  };
  const fresh = { "https://nueva.example": { tag: "ok" } };
  assert.deepEqual(
    mergeSnapshotUrls(previous, fresh, [
      "https://actual.example",
      "https://nueva.example",
    ]),
    {
      "https://actual.example": { tag: "ok" },
      "https://nueva.example": { tag: "ok" },
    },
  );
});

// --- 200 limpio -------------------------------------------------------------

test("un 200 normal es ok, que no significa «es del productor»", () => {
  const out = classifyProbe(
    probe({ status: 200, finalUrl: "https://ejemplo.es/", body: html("Bodega familiar") }),
  );
  assert.equal(out.tag, "ok");
  assert.equal(out.level, "ok");
});

if (process.exitCode) {
  console.error(`\ncheck-links: ${passed} passed, some failed.`);
} else {
  console.log(`check-links: ${passed} checks passed.`);
}
