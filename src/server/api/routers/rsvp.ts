import { Status, EventType, ResponseStage } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const rsvpRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.nativeEnum(EventType))
    .query(async ({ input, ctx }) => {
      const invitation = await ctx.prisma.invitation.findUnique({
        where: {
          id: ctx.invitationId,
        },
        select: {
          rsvps: {
            include: {
              event: {
                include: {
                  venue: true,
                },
              },
              guests: {
                include: {
                  guest: true,
                },
              },
            },
          },
          events: {
            include: {
              venue: true,
            },
          },
          guests: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      const eventRsvp = invitation?.rsvps.find(
        (rsvp) => rsvp.event.eventType === input
      );

      if (!eventRsvp) throw new TRPCError({ code: "NOT_FOUND" });

      const guests = eventRsvp.guests.map((guestRsvp) => ({
        id: guestRsvp.guestId,
        name: guestRsvp.guest.name,
        status: guestRsvp.status,
      }));

      return {
        event: {
          name: eventRsvp.event.name,
          date: eventRsvp.event.date,
          venue: eventRsvp.event.venue.name,
          address: eventRsvp.event.venue.address,
        },
        guests: guests ?? [],
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        guests: z.array(
          z.object({
            id: z.string(),
            status: z.nativeEnum(Status),
          })
        ),
        eventType: z.nativeEnum(EventType),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const invitation = await ctx.prisma.invitation.findFirst({
        where: {
          id: ctx.invitationId,
        },
        include: {
          rsvps: {
            include: {
              guests: true,
              event: true,
            },
          },
          events: true,
        },
      });

      const eventRsvp = invitation?.rsvps?.find(
        (rsvp) => rsvp.event.eventType === input.eventType
      );

      if (!eventRsvp) throw new TRPCError({ code: "NOT_FOUND" });

      for (const guest of input.guests) {
        await ctx.prisma.guestRsvp.update({
          where: {
            guestId_eventRsvpId: {
              guestId: guest.id,
              eventRsvpId: eventRsvp.id,
            },
          },
          data: {
            status: guest.status,
          },
        });
      }

      const responseStage =
        input.eventType === "HINDU_CEREMONY" ? "HINDU_CEREMONY" : "RECEPTION";

      await ctx.prisma.invitation.update({
        where: {
          id: ctx.invitationId,
        },
        data: {
          responseStage,
        },
      });
    }),
  transport: protectedProcedure.query(async ({ ctx }) => {
    const invitation = await ctx.prisma.invitation.findUnique({
      where: {
        id: ctx.invitationId,
      },
      include: {
        rsvps: {
          where: {
            event: {
              eventType: EventType.PORUWA_AND_RECEPTION,
            },
          },
          include: {
            guests: true,
            event: {
              include: {
                venue: true,
              },
            },
          },
        },
      },
    });

    const poruwaEvent = invitation?.rsvps[0];

    if (!poruwaEvent) throw new TRPCError({ code: "NOT_FOUND" });

    return {
      venue: poruwaEvent.event.venue.name,
      dateTime: poruwaEvent.event.date,
      numberOfSeats: poruwaEvent.transportSeats ?? 0,
      pickupLocation: poruwaEvent.transportPickupLocation,
      dropOffLocation: poruwaEvent.transportDropOffLocation,
      numberOfGuests: poruwaEvent.guests.length,
    };
  }),
  updateTransport: protectedProcedure
    .input(
      z.object({
        numberOfSeats: z.number(),
        pickupLocation: z.string().nullable(),
        dropOffLocation: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const invitation = await ctx.prisma.invitation.findUnique({
        where: {
          id: ctx.invitationId,
        },
        include: {
          rsvps: {
            where: {
              event: {
                eventType: EventType.PORUWA_AND_RECEPTION,
              },
            },
          },
        },
      });

      const poruwaEvent = invitation?.rsvps[0];

      if (!poruwaEvent) return;

      await ctx.prisma.eventRsvp.update({
        where: {
          id: poruwaEvent.id,
        },
        data: {
          transportSeats: input.numberOfSeats,
          transportPickupLocation:
            input.numberOfSeats > 0 ? input.pickupLocation : null,
          transportDropOffLocation:
            input.numberOfSeats > 0 ? input.dropOffLocation : null,
        },
      });
    }),
});
