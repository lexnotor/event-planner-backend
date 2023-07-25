import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    Equal,
    FindManyOptions,
    FindOneOptions,
    FindOptionsSelect,
    Like,
    Repository,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { CreateEventDto, QueryEventDto, UpdateEventDto } from "./event.dto";
import { EventEntity, EventPhotoEntity } from "./event.entity";

@Injectable()
export class EventService {
    EVENT_FIND_ONE_SELECT_FULL: FindOptionsSelect<EventEntity> = {
        comments: true,
        created_at: true,
        data: {},
        id: true,
        likes: true,
        deleted_at: true,
        location: true,
        price: true,
        public: true,
        tags: true,
        text: true,
        title: true,
        type: true,
        updated_at: true,
        user: { username: true, id: true, firstname: true, lastname: true },
    };

    EVENT_FIND_ONE_SELECT_IMPORTANT: FindOptionsSelect<EventEntity> = {
        created_at: true,
        id: true,
        public: true,
        text: true,
        title: true,
        type: true,
        updated_at: true,
        user: { username: true, id: true, firstname: true, lastname: true },
    };

    EVENT_FIND_ONE_SELECT_MINIMAL: FindOptionsSelect<EventEntity> = {
        id: true,
        title: true,
        created_at: true,
        public: true,
        text: true,
        type: true,
        user: { username: true, id: true, firstname: true, lastname: true },
    };

    constructor(
        @InjectRepository(EventEntity)
        private readonly eventRepo: Repository<EventEntity>,
        @InjectRepository(EventPhotoEntity)
        private readonly eventPhotoEntity: Repository<EventPhotoEntity>,
        private readonly userService: UserService
    ) {}

    async createEvent(
        payload: CreateEventDto,
        user: UserEntity | string
    ): Promise<EventEntity> {
        const event = new EventEntity();
        event.comments = payload.comments ?? null;
        event.data = payload.data ?? null;
        event.likes = payload.likes ?? null;
        event.location = payload.location ?? null;
        event.price = payload.price ?? null;
        event.public = payload.public;
        event.text = payload.text ?? null;
        event.title = payload.title ?? null;
        event.tags = payload.tags ?? null;
        event.type = payload.type ?? null;

        if (typeof user == "string")
            event.user = await this.userService.getUserById(user);
        else event.user = user;

        try {
            await this.eventRepo.save(event);
        } catch (error) {
            throw new HttpException(
                "CANNOT_CREATE_EVENT",
                HttpStatus.BAD_REQUEST
            );
        }
        return await this.getEventById(event.id);
    }

    async updateEvent(
        payload: UpdateEventDto,
        userId: string,
        eventId: string
    ): Promise<EventEntity> {
        const event = await this.getEventById(eventId);

        if (event.user.id != userId)
            throw new HttpException("USER_CONFLICT", HttpStatus.CONFLICT);

        event.comments = payload.comments ?? event.comments;
        event.data = payload.data ?? event.data;
        event.likes = payload.likes ?? event.likes;
        event.location = payload.location ?? event.location;
        event.price = payload.price ?? event.price;
        event.public = payload.public ?? event.public;
        event.text = payload.text ?? event.text;
        event.title = payload.title ?? event.title;
        event.tags = payload.tags ?? event.tags;
        event.type = payload.type ?? event.type;

        try {
            await this.eventRepo.save(event);
        } catch (error) {
            throw new HttpException(
                "CANT_MODIFY_EVENT",
                HttpStatus.NOT_MODIFIED
            );
        }

        return await this.getEventById(eventId);
    }

    async getEventById(eventId: string): Promise<EventEntity> {
        const filter: FindOneOptions<EventEntity> = {};
        filter.where = { id: Equal(eventId) };
        filter.relations = { user: true };
        filter.select = {
            comments: true,
            created_at: true,
            id: true,
            likes: true,
            type: true,
            price: true,
            location: true,
            text: true,
            title: true,
            user: { username: true, id: true },
        };

        try {
            const event = await this.eventRepo.findOneOrFail(filter);
            return event;
        } catch (error) {
            throw new HttpException("EVENT_NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }

    async getUserEvent(userId: string): Promise<EventEntity[]> {
        const filter: FindManyOptions<EventEntity> = {};
        filter.where = {
            user: Equal(userId),
        };

        filter.select = {
            comments: true,
            created_at: true,
            id: true,
            likes: true,
            type: true,
            price: true,
            location: true,
            text: true,
            title: true,
        };

        filter.order = { created_at: "DESC" };

        filter.loadRelationIds = { relations: ["user"] };

        try {
            const events = await this.eventRepo.find(filter);
            return events;
        } catch (error) {
            throw new HttpException("NO_EVENT", HttpStatus.NOT_FOUND);
        }
    }

    async getEvents(payload: QueryEventDto): Promise<EventEntity[]> {
        const filter: FindManyOptions<EventEntity> = {};

        filter.select = this.EVENT_FIND_ONE_SELECT_IMPORTANT;
        filter.where = { text: Like(`%${payload.text}`) };
        filter.order = { created_at: "DESC" };
        filter.relations = { user: true };

        try {
            const events = await this.eventRepo.find(filter);
            return events;
        } catch (error) {
            throw new HttpException("NOT_EVENT", HttpStatus.FORBIDDEN);
        }
    }

    async deleteEvent(eventId: string, userId: string): Promise<string> {
        const event = await this.getEventById(eventId);

        if (event.user.id != userId)
            throw new HttpException("USER_CONFLICT", HttpStatus.CONFLICT);

        try {
            await this.eventRepo.softRemove(event);
            return eventId;
        } catch (error) {
            throw new HttpException(
                "CANT_DELETE_EVENT",
                HttpStatus.NOT_MODIFIED
            );
        }
    }
}
