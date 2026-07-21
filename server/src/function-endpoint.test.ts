import assert from "node:assert/strict";
import test from "node:test";
import { rewriteAppStoreFunctionUrl } from "./function-endpoint.js";

test("maps an unversioned AppStore call to the default SDK version", () => {
  assert.equal(rewriteAppStoreFunctionUrl("PUT", "/functions"), "/functions/v1");
  assert.equal(
    rewriteAppStoreFunctionUrl("PUT", "/functions?source=command"),
    "/functions/v1?source=command",
  );
});

test("leaves versioned and non-PUT requests unchanged", () => {
  assert.equal(rewriteAppStoreFunctionUrl("PUT", "/functions/v2"), "/functions/v2");
  assert.equal(rewriteAppStoreFunctionUrl("GET", "/functions"), "/functions");
});
