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
            },
            rsvps: {
              create: input.events.map(eventId => ({ eventId}))
            }
        },
        include: {
          guests: true,
          events: true,
          rsvps: true
        }
    });

    for (const rsvp of invitation.rsvps) {
      await ctx.prisma.eventRsvp.update({
        where: {
          id: rsvp.id,
        },
        data: {
          guests: {
            create: invitation.guests.map(guest => ({
              guestId: guest.id
            }))
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
        },
        rsvps: {
          deleteMany: {},
          create: input.events.map(eventId => ({
            eventId: eventId
          })) 
        },
        responseStage: "NORESPONSE"
      },
      include: {
        guests: true,
        events: true,
        rsvps: true
      }
    });

    for (const rsvp of invitation.rsvps) {
      await ctx.prisma.eventRsvp.update({
        where: {
          id: rsvp.id,
        },
        data: {
          guests: {
            create: invitation.guests.map(guest => ({
              guestId: guest.id
            }))
          }
        }
      })
    }
  }),
  getForAdmin: protectedProcedure
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
  get: protectedProcedure
    .query(async ({ctx}) => {
      const invitation = await ctx.prisma.invitation.findUnique({
        where: {
          id: ctx.invitationId
        },
        select: {
          events: {
            select: {
              id: true,
              name: true,
              date: true,
              eventType: true,
              dressCode: true,
              venue: {
                select: {
                  name: true,
                  address: true
                }
              }
            },
          },
          responseStage: true
        }
      });

      if (!invitation) throw new TRPCError({code: "NOT_FOUND"});
      return {
        ...invitation,
        events: invitation.events.sort((a, b) => a.date.getTime() - b.date.getTime())
      };
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

