import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const TutorialTargetSchema = z.object({
  channelId: z.string().min(1),
  groupId: z.string().min(1),
  managerId: z.string().min(1),
  expiresAt: z.number().int().positive(),
});

const signatureDomain = "channel-app-tutorial-target\0";

export type TutorialTarget = z.infer<typeof TutorialTargetSchema>;

export function createTutorialTargetToken(
  target: TutorialTarget,
  secret: string,
): string {
  const body = Buffer.from(JSON.stringify(target)).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(signatureDomain)
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

export function readTutorialTargetToken(
  token: string,
  secret: string,
): TutorialTarget | undefined {
  const parts = token.split(".");
  if (parts.length !== 2) return undefined;

  const [body, signature] = parts;
  if (!body || !signature) return undefined;

  try {
    const expected = createHmac("sha256", secret)
      .update(signatureDomain)
      .update(body)
      .digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
      return undefined;

    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    const result = TutorialTargetSchema.safeParse(parsed);
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}
