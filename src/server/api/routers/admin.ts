import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  rsvps: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.invitation.findMany({
      select: {
        id: true,
        addressedTo: true,
        rsvps: {
          select: {
            id: true,
            guests: {
              select: {
                guest: {
                  select: {
                    name: true,
                  },
                },
                status: true,
              },
            },
            event: {
              select: {
                name: true,
                eventType: true,
              },
            },
            transportSeats: true,
            transportDropOffLocation: true,
            transportPickupLocation: true,
          },
        },
      },
    });
  }),
});
