import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const guestbookRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestbook.findMany({
        select: {
          name: true,
          message: true,
          provider: true
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),
  postMessage: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        message: z.string(),
        provider: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.guestbook.create({
          data: {
            name: input.name,
            message: input.message,
            provider: input.provider,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
