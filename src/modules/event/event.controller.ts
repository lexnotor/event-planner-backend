import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";
import { EventService } from "./event.service";
import {
    AddGigToEventDto,
    CreateEventDto,
    FindEventGigDto,
    QueryEventDto,
    QueryUpdateEventDto,
    UpdateEventDto,
    UpdateEventGigDto,
} from "./event.dto";
import { AuthGuard } from "../auth/auth.guard";
import { User, UserIdentity } from "../auth/auth.decorator";
import { ApiResponse, EventInfo } from "@/index";
import { isUUID } from "class-validator";
import { EventGigService } from "./event_gig.service";
import { GigService } from "../gig/gig.service";
import { EventGigEntity } from "./event.entity";

@Controller("event")
export class EventController {
    constructor(
        private readonly eventService: EventService,
        private readonly eventGigService: EventGigService,
        private readonly gigService: GigService
    ) {}

    @Post("new")
    @UseGuards(AuthGuard)
    async createEvent(
        @Body() payload: CreateEventDto,
        @User() user: UserIdentity
    ): Promise<ApiResponse<EventInfo>> {
        return {
            message: "EVENT_CREATED",
            data: await this.eventService.createEvent(payload, user.id),
        };
    }

    @Get("find")
    async findEvent(
        @Query() query: QueryEventDto
    ): Promise<ApiResponse<EventInfo | EventInfo[]>> {
        const { id } = query;
        if (id)
            return {
                message: "EVENT_FOUND",
                data: await this.eventService.getEventById(id),
            };

        return {
            message: "EVENTS_FOUND",
            data: await this.eventService.getEvents(query),
        };
    }

    @Get("find/mine")
    @UseGuards(AuthGuard)
    async getMyEvent(
        @User() user: UserIdentity
    ): Promise<ApiResponse<EventInfo[]>> {
        return {
            message: "EVENT_FOUND",
            data: await this.eventService.getUserEvent(user.id),
        };
    }

    @Put("update")
    @UseGuards(AuthGuard)
    async updateEvent(
        @Body() payload: UpdateEventDto,
        @Query() query: QueryUpdateEventDto,
        @User() user: UserIdentity
    ): Promise<ApiResponse<EventInfo>> {
        const { event: eventId } = query;
        return {
            message: "EVENT_UPDATED",
            data: await this.eventService.updateEvent(
                payload,
                user.id,
                eventId
            ),
        };
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async deleteEvent(
        @Param("id") eventId: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<string>> {
        if (!isUUID(eventId))
            throw new HttpException("EVENT_NOT_FOUND", HttpStatus.BAD_REQUEST);
        return {
            message: "EVENT_UPDATED",
            data: await this.eventService.deleteEvent(eventId, user.id),
        };
    }

    @Post("gig/add")
    @UseGuards(AuthGuard)
    async addGigToEvent(
        @Body() payload: AddGigToEventDto
    ): Promise<ApiResponse<EventGigEntity>> {
        const { details, eventId, title, gigId } = payload;

        const event = await this.eventService.getEventById(eventId);
        const gig = gigId ? await this.gigService.getGigById(gigId) : null;
        const eventGig = await this.eventGigService.addGigToEvent(
            { details, title },
            event,
            gig
        );
        return {
            message: "GIG_ADDED",
            data: eventGig,
        };
    }

    @Put("gig/update/:id")
    @UseGuards(AuthGuard)
    async updateGigToEvent(
        @Body() payload: UpdateEventGigDto,
        @Param("id") eventGigId: string
    ): Promise<ApiResponse<EventGigEntity>> {
        const { details, title, gigId } = payload;

        const gig = gigId ? await this.gigService.getGigById(gigId) : null;
        const eventGig = await this.eventGigService.updateEventGig(
            {
                id: eventGigId,
                details,
                title,
            },
            gig
        );

        return {
            message: "GIG_ADDED",
            data: eventGig,
        };
    }

    @Get("gig")
    @UseGuards(AuthGuard)
    async findEventGig(
        @Query() query: FindEventGigDto
    ): Promise<ApiResponse<EventGigEntity | EventGigEntity[]>> {
        const { eventGigId, eventId } = query;
        const eventGigs = eventId
            ? await this.eventGigService.getEventGigs(eventId)
            : eventGigId
            ? await this.eventGigService.getEventGigById(eventGigId)
            : [];

        return {
            message: "GIG_FOUND",
            data: eventGigs,
        };
    }

    @Delete("gig/:id")
    @UseGuards(AuthGuard)
    async removeGigFromEvent(
        @Param("id") eventGigId: string
    ): Promise<ApiResponse<string>> {
        return {
            message: "GIG_REMOVED",
            data: await this.eventGigService.deleteEventGig(eventGigId),
        };
    }
}
