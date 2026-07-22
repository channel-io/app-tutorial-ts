import { z } from "zod";

export const TUTORIAL_WAM_NAME = "tutorial";

export const TUTORIAL_FUNCTIONS = {
  open: "tutorial.open",
  sendAsBot: "tutorial.sendAsBot",
  writeAsManager: "writeGroupMessageAsManager",
} as const;

export const CommandActionInputSchema = z.object({
  chat: z.object({ type: z.string(), id: z.string() }).optional(),
  trigger: z
    .object({
      type: z.string(),
      attributes: z
        .record(z.string())
        .nullish()
        .transform((attributes) => attributes ?? {}),
    })
    .optional(),
  input: z
    .record(z.unknown())
    .nullish()
    .transform((input) => input ?? {}),
  language: z.string().optional(),
});

export type CommandActionInput = z.infer<typeof CommandActionInputSchema>;

export const SendAsBotInputSchema = z.object({
  targetToken: z.string().min(1),
  rootMessageId: z.string().optional(),
  broadcast: z.boolean().default(false),
});

export type SendAsBotInput = z.infer<typeof SendAsBotInputSchema>;

export const TutorialWamArgsSchema = z.object({
  chatId: z.string(),
  chatType: z.string(),
  chatTitle: z.string(),
  rootMessageId: z.string().optional(),
  broadcast: z.boolean(),
  managerId: z.string(),
  message: z.string(),
  targetToken: z.string().optional(),
});

export type TutorialWamArgs = z.infer<typeof TutorialWamArgsSchema>;

export const TutorialWamDataSchema = TutorialWamArgsSchema.extend({
  appId: z.string(),
  channelId: z.string(),
});

export type TutorialWamData = z.infer<typeof TutorialWamDataSchema>;

export type WriteGroupMessageAsManagerInput = {
  channelId: string;
  groupId: string;
  rootMessageId?: string;
  broadcast: boolean;
  dto: {
    plainText: string;
    managerId: string;
  };
};
