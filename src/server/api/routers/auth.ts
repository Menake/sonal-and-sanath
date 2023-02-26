import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const authRouter = createTRPCRouter({
  token: publicProcedure
    .input(z.object({token: z.string()}))
    .mutation(async ({ ctx, input }) => {
        const invitation = await ctx.prisma.invitation.findUnique({
          where: {
            id: input.token
          },
          select: {
            id: true,
            addressedTo: true
          }
        });

        if (!invitation) throw new TRPCError({code: "NOT_FOUND"});

        return {
          invitationId: invitation.id,
          addressedTo: invitation.addressedTo
        }
    }),
  login: publicProcedure
    .input(z.object({name: z.string()}))
    .mutation(async ({ ctx, input }) => {
      const guest = await ctx.prisma.guest.findFirst({
        where: {
          name: input.name
        },
        select: {
          invitation: {
            select: {
              id: true,
              addressedTo: true
            }
          }
        }
      });

      if (!guest) throw new TRPCError({code: "NOT_FOUND"});

      return {
        invitationId: guest.invitation.id,
        addressedTo: guest.invitation.addressedTo
      }
  }),
});
