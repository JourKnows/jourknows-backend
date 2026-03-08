import { z } from "zod";

export const submitCommentSchema = z.object({
  guestName: z.string().min(1, "Name is required").max(100),
  content: z.string().min(1, "Comment content is required"),
  parentId: z.string().uuid().optional().nullable(),
});

export type SubmitCommentInput = z.infer<typeof submitCommentSchema>;
