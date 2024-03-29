import { createTRPCRouter } from "./trpc";
import { eventsRouter } from "./routers/events";
import { invitationRouter } from "./routers/invitation";
import { authRouter } from "./routers/auth";
import { rsvpRouter } from "./routers/rsvp";
import { adminRouter } from "./routers/admin";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  events: eventsRouter,
  invitation: invitationRouter,
  rsvp: rsvpRouter,
  auth: authRouter,
  admin: adminRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
