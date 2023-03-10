import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const guestbookRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        page: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.guestbook.findMany({
          select: {
            name: true,
            message: true,
            provider: true,
            image: true,
            createdAt: true,
            id: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 14,
          skip: (input.page - 1) * 14,
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getCount: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestbook.count();
    } catch (err) {
      console.log(err);
    }
  }),
  postMessage: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        message: z.string(),
        provider: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const res = await ctx.prisma.guestbook.create({
          data: {
            name: input.name,
            message: input.message,
            provider: input.provider,
            image: input.image,
          },
        });
        return res;
      } catch (error) {
        console.log(error);
      }
    }),
});
