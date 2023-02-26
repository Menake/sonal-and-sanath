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
          }
        });

        if (!invitation) throw new TRPCError({code: "NOT_FOUND"});

        return {
          invitation: invitation.id 
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
          name: true,
          invitationId: true
        }
      });

      if (!guest) throw new TRPCError({code: "NOT_FOUND"});

      return {
        invitationId: guest.invitationId
      };
  }),
});
