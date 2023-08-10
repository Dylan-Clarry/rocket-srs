import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const cardRouter = createTRPCRouter({
    getSchema: publicProcedure.query(async ({ ctx }) => {
        return await ctx.prisma.card.findFirst({
            select: {
                id: true,
                createdAt: true,
                reviewDate: true,
                content: true,
                userId: true,
                deckId: true,
            },
        });
    }),
    getCardById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
        return ctx.prisma.card.findFirst({
            where: {
                id: input,
            },
        });
    }),
    getCardsByDeckId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
        return ctx.prisma.card.findMany({
            where: {
                deckId: input,
            },
        });
    }),
    getAll: publicProcedure.query(async ({ ctx }) => {
        try {
            return await ctx.prisma.card.findMany({
                select: {
                    id: true,
                    createdAt: true,
                    reviewDate: true,
                    content: true,
                    userId: true,
                    deckId: true,
                },
                orderBy: {
                    reviewDate: "desc",
                },
            });
        } catch (err) {
            console.log("error", err);
        }
    }),
    createCards: protectedProcedure
        .input(
            z.object({
                deckId: z.string(),
                content: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const cards = await ctx.prisma.card.create({
                    data: {
                        userId: ctx.session.user.id,
                        deckId: input.deckId,
                        content: input.content,
                        reviewDate: new Date(Date.now()),
                    },
                });
                return cards;
            } catch (err) {
                console.log(err);
            }
        }),
});
