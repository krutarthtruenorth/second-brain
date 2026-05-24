import { z } from "zod";
import { MAX_ASK_LENGTH, MAX_SAVE_LENGTH } from "@/lib/constants";
import { parseMemoryContent } from "@/lib/memory-content";

export const saveMemorySchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Memory content cannot be empty")
    .max(MAX_SAVE_LENGTH, "Memory content is too long")
    .refine((raw) => parseMemoryContent(raw).content.length > 0, {
      message: "Memory content cannot be empty after removing hashtags.",
    }),
});

export const askQuestionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, "Question cannot be empty")
    .max(MAX_ASK_LENGTH, "Question is too long")
    .refine((raw) => {
      const { content, tags } = parseMemoryContent(raw);
      return content.length > 0 || tags.length > 0;
    }, {
      message: "Question cannot be empty",
    }),
});

export type SaveMemoryInput = z.infer<typeof saveMemorySchema>;
export type AskQuestionInput = z.infer<typeof askQuestionSchema>;
