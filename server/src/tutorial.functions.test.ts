import assert from "node:assert/strict";
import test from "node:test";
import {
  createTutorialTargetToken,
  readTutorialTargetToken,
} from "./target-token.js";

const secret = "test-app-secret";

test("tutorial target tokens bind the channel, group, manager, and expiry", () => {
  const target = {
    channelId: "channel",
    groupId: "group",
    managerId: "manager",
    expiresAt: Date.now() + 60_000,
  };

  const token = createTutorialTargetToken(target, secret);

  assert.deepEqual(readTutorialTargetToken(token, secret), target);
  assert.equal(readTutorialTargetToken(`${token}tampered`, secret), undefined);
  assert.equal(readTutorialTargetToken(token, "different-secret"), undefined);
});
