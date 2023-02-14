import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const invitationRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
        addressedTo: z.string(),
        events: z.array(z.string()),
        guests: z.array(z.string())
    }))  
  .mutation(({ ctx, input}) => {
    return ctx.prisma.invitation.create({
        data: {
            addressedTo: input.addressedTo,
            events: {
                connect: input.events.map(eventId => ({id: eventId}))
            },
            guests: {
                create: input.guests.map(guest => ({ name: guest}))
            }
        }
    })
  }),
  get: publicProcedure
    .input(z.string())
    .query(async ({ctx, input}) => {
      const invite = await ctx.prisma.invitation.findUnique({
        where: {
          id: input
        },
        select: {
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

      if (!invite) throw new TRPCError({code: "NOT_FOUND"})

      console.log(invite);

      return {
        addressedTo: invite.addressedTo,
        guests: invite.guests.map(guest => guest.name),
        events: invite.events.map(event => event.id)
      };
    })
});
