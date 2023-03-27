import { Status } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const invitationRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      addressedTo: z.string(),
      events: z.array(z.string()),
      guests: z.array(z.object({name: z.string()}))
    }))  
  .mutation(async ({ ctx, input}) => {
    const invitation = await ctx.prisma.invitation.create({
        data: {
            addressedTo: input.addressedTo,
            events: {
                connect: input.events.map(eventId => ({id: eventId}))
            },
            guests: {
              create: input.guests.map(guest => ({ name: guest.name }))
            }
        },
        include: {
          guests: true,
          events: true
        }
    });

    for (const guest of invitation.guests) {
      const guestEvents = invitation.events.map(event => ({ eventId: event.id, status: Status.NORESPONSE}))
      await ctx.prisma.guest.update({
        where: {
          id: guest.id,
        },
        data: {
          eventStatus: {
            create: guestEvents
          }
        }
      })
    }
  }),
  update: publicProcedure
    .input(z.object({
        id: z.string(),
        addressedTo: z.string(),
        events: z.array(z.string()),
        guests: z.array(z.object({name: z.string()}))
    }))  
  .mutation(async ({ ctx, input}) => {    
    const invitation = await ctx.prisma.invitation.update({
      where: {
        id: input.id
      },
      data: {
        addressedTo: input.addressedTo,
        events: {
          set: [],
          connect: input.events.map(eventId => ({id: eventId}))
        },
        guests: {
          deleteMany: {},
          create: input.guests.map(guest => ({name: guest.name}))
        }
      },
      include: {
        guests: true,
        events: true
      }
    });

    for (const guest of invitation.guests) {
      const guestEvents = invitation.events.map(event => ({ eventId: event.id, status: Status.NORESPONSE}))
      await ctx.prisma.guest.update({
        where: {
          id: guest.id,
        },
        data: {
          eventStatus: {
            create: guestEvents
          }
        }
      })
    }
  }),
  get: protectedProcedure
    .input(z.string())
    .query(async ({ctx, input}) => {
      const invitation = await ctx.prisma.invitation.findUnique({
        where: {
          id: input
        },
        select: {
          id: true,
          addressedTo: true,
          guests: {
            select: {
              name: true,
              status: true
            }
          },
          events: {
            select: {
              id: true
            }
          }
        }
      });

      if (!invitation) throw new TRPCError({code: "NOT_FOUND"});
      return {
        ...invitation,
        events: invitation.events.map(event => event.id)
      };
    }),
  getForEvent: protectedProcedure
    .input(z.string())
    .query(async ({ctx, input}) => {

      const guestStatuses = await ctx.prisma.guest.findMany({
        where: {
          invitationId: ctx.invitationId,
          eventStatus: {
            some: {
              eventId: input
            }
          }
        }
      });

      const event = await ctx.prisma.event.findUnique({
        where: {
          id: input
        },
        include: {
          venue: true
        }
      });

      return {
        ...event,
        guests: guestStatuses
      }
    }),
  rsvp: protectedProcedure
    .input(z.object({
      eventId: z.string(),
      guests: z.array(z.object({ guestId: z.string(), status: z.string()})),
      transport: z.array(z.object({ guestId: z.string(), requiresTransport: z.boolean()}))
    }))
    .mutation(({input, ctx}) => {
      return {}
    }),
  all: publicProcedure
    .query(async ({ctx}) => {
      const invitations = await  ctx.prisma.invitation.findMany(
        {
          select: {
            id: true,
            addressedTo: true,
            guests: {
              select: {
                name: true
              }
            },
            events: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      );

      const events = await ctx.prisma.event.findMany({
        select: {
          id: true,
          name: true
        }
      })

      return {
        invitations,
        events
      }
    })
});
