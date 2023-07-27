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
    CreateEventDto,
    QueryEventDto,
    QueryUpdateEventDto,
    UpdateEventDto,
} from "./event.dto";
import { AuthGuard } from "../auth/auth.guard";
import { User, UserIdentity } from "../auth/auth.decorator";
import { ApiResponse, EventInfo } from "@/index";
import { isUUID } from "class-validator";

@Controller("event")
export class EventController {
    constructor(private readonly eventService: EventService) {}

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
        if (typeof id != "undefined")
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
}
