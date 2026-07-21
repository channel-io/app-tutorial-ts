import assert from "node:assert/strict";
import test from "node:test";
import { CommandActionInputSchema } from "./command-input.js";

test("normalizes nullable command fields sent by AppStore", () => {
  const parsed = CommandActionInputSchema.parse({
    chat: { type: "group", id: "group" },
    trigger: { type: "command", attributes: null },
    input: null,
  });

  assert.deepEqual(parsed.trigger?.attributes, {});
  assert.deepEqual(parsed.input, {});
});
