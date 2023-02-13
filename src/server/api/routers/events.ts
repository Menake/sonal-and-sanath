import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const eventsRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.event.findMany();
  }),
});
