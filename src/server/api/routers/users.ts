import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.findUnique({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            accounts: true,
            email: true,
            name: true,
            sessions: true,
          },
        });
      } catch (error) {}
    }),
});
