import { Status } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";

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
  getRsvp: protectedProcedure
    .query(async ({ctx}) => {
      const guestsWithStatuses = await ctx.prisma.guest.findMany({
        where: {
          invitationId: ctx.invitationId,
        },
        select: {
          id: true,
          name: true,
          eventStatus: {
            select: {
              status: true,
              eventId: true,
              requiresTransport: true,
            }
          }
        }
      });

      const guestStatuses = guestsWithStatuses.flatMap(guest => {
        return guest.eventStatus.map(status => ({
          ...status,
          id: guest.id,
          name: guest.name
        }))
      });

      const invitationWithEvents = await ctx.prisma.invitation.findUnique({
        where: {
          id: ctx.invitationId
        },
        select: {
          events: {
            include: {
              venue: true,
            }
          }
        }
      })

      const events = invitationWithEvents?.events?.map(event => {
        const guests = guestStatuses.filter(status => status.eventId === event.id);
        return {
          ...event,
          guests
        }
      })?.sort((a, b) => a.date.getTime() - b.date.getTime())

      return events ?? []
    }),
  rsvp: protectedProcedure
    .input(z.object({
      events: z.array(z.object({
        id: z.string(),
        guests: z.array(z.object({ 
          id: z.string(), 
          status: z.nativeEnum(Status), 
          requiresTransport: z.boolean()
        })),
      }))
    }))
    .mutation(async ({input, ctx}) => {
      for (const event of input.events) {
        for (const guest of event.guests) {
          console.log(guest);

          await prisma.guestEventStatus.update({
            where: {
              guestId_eventId: {eventId: event.id, guestId: guest.id}
            },
            data: {
              status: guest.status,
              requiresTransport: guest.requiresTransport
            }
          })
        }
      }
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
