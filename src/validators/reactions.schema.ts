import { z } from "zod";

export const submitReactionSchema = z.object({
  type: z.enum(["like", "love", "haha", "wow", "sad", "angry"]),
});

export type SubmitReactionInput = z.infer<typeof submitReactionSchema>;
