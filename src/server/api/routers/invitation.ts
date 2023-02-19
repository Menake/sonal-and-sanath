import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const invitationRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      addressedTo: z.string(),
      events: z.array(z.string()),
      guests: z.array(z.object({name: z.string()}))
    }))  
  .mutation(({ ctx, input}) => {
    return ctx.prisma.invitation.create({
        data: {
            addressedTo: input.addressedTo,
            events: {
                connect: input.events.map(eventId => ({id: eventId}))
            },
            guests: {
                create: input.guests.map(guest => ({ name: guest.name}))
            }
        }
    })
  }),
  update: publicProcedure
    .input(z.object({
        id: z.string(),
        addressedTo: z.string(),
        events: z.array(z.string()),
        guests: z.array(z.object({name: z.string()}))
    }))  
  .mutation(({ ctx, input}) => {    
    return ctx.prisma.invitation.update({
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
      }
    });
  }),
  get: publicProcedure
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
              name: true
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
