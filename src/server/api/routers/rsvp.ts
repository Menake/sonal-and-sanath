import { Status, EventType, ResponseStage } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const rsvpRouter = createTRPCRouter({
    get: protectedProcedure
        .input(z.nativeEnum(EventType))
        .query(async ({input, ctx}) => {
        const invitation = await ctx.prisma.invitation.findUnique({
            where: {
                id: ctx.invitationId,
            },
            select: {
                rsvps: {
                    include: {
                        event: {
                        include: {
                        venue: true
                        }
                    },
                    guests: {
                        include: {
                        guest: true
                        }
                    }
                    }
                },
                events: {
                    include: {
                    venue: true
                    }
                },
                guests: {
                    select: {
                    id: true,
                    name: true
                    }
                }
            }
        })

        const eventRsvp = invitation?.rsvps.find(rsvp => rsvp.event.eventType === input);

        if (!eventRsvp) {
            const guests = invitation?.guests.map(guest => ({
                id: guest.id,
                name: guest.name,
                status: Status.NORESPONSE 
            }));

            const event = invitation?.events.find(event => event.eventType === input);
            if (!event) return;

            return {
            event: {
                name: event.name,
                date: event.date,
                venue: event.venue.name,
                address: event.venue.address,
            },
            guests: guests ?? []
            }
        }

        const guests = eventRsvp.guests.map(guestRsvp => ({
            id: guestRsvp.guestId,
            name: guestRsvp.guest.name,
            status: guestRsvp.status
        }));

        return {
            event: {
            name: eventRsvp.event.name,
            date: eventRsvp.event.date,
            venue: eventRsvp.event.venue.name,
            address: eventRsvp.event.venue.address
            },
            guests: guests ?? []
        }
        }),
    update: protectedProcedure
        .input(z.object({
        guests: z.array(z.object({ 
            id: z.string(), 
            status: z.nativeEnum(Status), 
        })),
        eventType: z.nativeEnum(EventType)
        }))
        .mutation(async ({input, ctx}) => {
        const invitation = await ctx.prisma.invitation.findFirst({
            where: {
            id: ctx.invitationId
            },
            include: {
            rsvps: {
                include: {
                guests: true,
                event: true
                }
            },
            events: true
            }
        })

        if (!invitation) return;

        const eventRsvp = invitation.rsvps.find(rsvp => rsvp.event.eventType === input.eventType);
        
        if (!eventRsvp) {
            const event = invitation.events.find(event => event.eventType == input.eventType)!;

            await ctx.prisma.invitation.update({
            where: {
                id: ctx.invitationId
            },
            data: {
                rsvps: {
                create: {
                    eventId: event.id,
                    guests: {
                    createMany: {
                        data: input.guests.map(guest => ({
                        guestId: guest.id,
                        status: guest.status
                        }))
                    }
                    }
                }
                }
            }
            })
        } 
        else 
        {
            for (const guest of input.guests) {
            await ctx.prisma.guestRsvp.update({
                where: {
                guestId_eventRsvpId: {guestId: guest.id, eventRsvpId: eventRsvp.id}
                },
                data: {
                status: guest.status
                }
            })
            }
        }
        
        const hasNextStage = input.eventType === EventType.PORUWA_AND_RECEPTION || invitation.events.length > 1

        if (hasNextStage) {
            const responseStage = input.eventType === EventType.PORUWA_AND_RECEPTION
            ? ResponseStage.RECEPTION_TRANSPORT
            : ResponseStage.RECEPTION;

            await ctx.prisma.invitation.update({
            where: {
                id: ctx.invitationId
            },
            data: {
                responseStage
            }
            });
        }
        }),
    transport: protectedProcedure
        .query(async ({ctx}) => {
        const invitation = await ctx.prisma.invitation.findUnique({
            where: {
                id: ctx.invitationId
            },
            include: {
                rsvps: {
                    where: {
                        event: {
                            eventType: EventType.PORUWA_AND_RECEPTION
                        }
                    },
                    include: {
                        guests: true,
                        event: {
                            include: {
                                venue: true,
                            }
                        }
                    }
                }
            }
        })

        const poruwaEvent = invitation?.rsvps[0];

        console.log(poruwaEvent);

        if (!poruwaEvent) 
            throw new TRPCError({ code: "NOT_FOUND"})

        return {
            venue: poruwaEvent.event.venue.name,
            dateTime: poruwaEvent.event.date,
            numberOfSeats: poruwaEvent.transportSeats ?? 0,
            pickupLocation: poruwaEvent.transportPickupLocation,
            dropOffLocation: poruwaEvent.transportDropOffLocation,
            numberOfGuests: poruwaEvent.guests.length
        }
    }),
    updateTransport: protectedProcedure
        .input(z.object({
            numberOfSeats: z.number(),
            pickupLocation: z.string().nullable(),
            dropOffLocation: z.string().nullable()
        }))
        .mutation(async ({input, ctx}) => {
            const invitation = await ctx.prisma.invitation.findUnique({
                where: {
                    id: ctx.invitationId
                },
                include: {
                    rsvps: {
                        where: {
                            event: {
                                eventType: EventType.PORUWA_AND_RECEPTION
                            }
                        }
                    }
                }
            });

            const poruwaEvent = invitation?.rsvps[0];

            if (!poruwaEvent) return;


            await ctx.prisma.eventRsvp.update({
                where: {
                    id: poruwaEvent.id
                },
                data: {
                    transportSeats: Number(input.numberOfSeats),
                    transportPickupLocation: input.pickupLocation,
                    transportDropOffLocation: input.dropOffLocation
                }
            })
        })
    });

