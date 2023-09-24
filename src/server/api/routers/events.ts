import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const eventsRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findMany();
  }),
  invited: protectedProcedure.query(async ({ ctx }) => {
    const invitationWithEvents = await ctx.prisma.invitation.findUnique({
      where: {
        id: ctx.invitationId,
      },
      select: {
        events: {
          select: {
            id: true,
            name: true,
            date: true,
            time: true,
            venue: {
              select: {
                name: true,
                address: true,
              },
            },
          },
        },
      },
    });

    if (!invitationWithEvents)
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    return invitationWithEvents.events.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }),
});
