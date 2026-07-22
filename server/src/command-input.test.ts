import assert from "node:assert/strict";
import test from "node:test";
import { CommandActionInputSchema } from "@tutorial/shared";

test("normalizes nullable command fields sent by AppStore", () => {
  const parsed = CommandActionInputSchema.parse({
    chat: { type: "group", id: "group" },
    trigger: { type: "command", attributes: null },
    input: null,
  });

  assert.deepEqual(parsed.trigger?.attributes, {});
  assert.deepEqual(parsed.input, {});
});
