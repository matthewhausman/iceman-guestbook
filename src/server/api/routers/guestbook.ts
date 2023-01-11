import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const guestbookRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
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
        cursor: {
          id: undefined
        }
      });
    } catch (error) {
      console.log(error);
    }
  }),
  getCount: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.guestbook.count()
    } catch (err) {
      console.log(err)
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
        await ctx.prisma.guestbook.create({
          data: {
            name: input.name,
            message: input.message,
            provider: input.provider,
            image: input.image,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
