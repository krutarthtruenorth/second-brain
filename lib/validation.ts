import { z } from "zod";
import { MAX_ASK_LENGTH, MAX_SAVE_LENGTH } from "@/lib/constants";

export const saveMemorySchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Memory content cannot be empty")
    .max(MAX_SAVE_LENGTH, "Memory content is too long"),
});

export const askQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question cannot be empty")
    .max(MAX_ASK_LENGTH, "Question is too long"),
});

export type SaveMemoryInput = z.infer<typeof saveMemorySchema>;
export type AskQuestionInput = z.infer<typeof askQuestionSchema>;
