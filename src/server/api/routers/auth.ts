import { z } from "zod";
import { setCookie } from 'cookies-next';

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

        const session = {
          invitation: invitation.id 
        }

        console.log("Setting cookie", JSON.stringify(session));

        setCookie("session", JSON.stringify(session), { req: ctx.req, res: ctx.res, sameSite: true, maxAge: 60*6*24});
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

      const session = {
        invitationId: guest.invitationId
      };

      setCookie("session", JSON.stringify(session), { req: ctx.req, res: ctx.res, sameSite: true, maxAge: 60*6*24});
  }),
});
