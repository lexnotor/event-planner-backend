import { EventGigInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Equal, FindManyOptions, FindOneOptions, Repository } from "typeorm";
import { GigEntity } from "../gig/gig.entity";
import { EventEntity, EventGigEntity } from "./event.entity";

@Injectable()
export class EventGigService {
    constructor(
        @InjectRepository(EventGigEntity)
        private readonly eventGigRepo: Repository<EventGigEntity>
    ) {}

    async addGigToEvent(
        payload: EventGigInfo,
        event: EventEntity,
        gig?: GigEntity
    ): Promise<EventGigEntity> {
        const event_gig = new EventGigEntity();
        event_gig.event = event;
        event_gig.gig = gig ?? null;
        event_gig.title = gig?.title ?? payload.title ?? "INCONNU";
        event_gig.details = payload.details ?? "";
        event_gig.confirm = false;

        try {
            await this.eventGigRepo.save(event_gig);
        } catch (error) {
            throw new HttpException("GIG_NOT_ADDED", HttpStatus.BAD_REQUEST);
        }

        return event_gig;
    }

    async getEventGigById(eventGigId: string): Promise<EventGigEntity> {
        let gig: EventGigEntity;
        const filter: FindOneOptions<EventGigEntity> = {};
        filter.where = { id: Equal(eventGigId) };
        filter.relations = { event: true, gig: true };

        try {
            gig = await this.eventGigRepo.findOne(filter);
        } catch (error) {
            throw new HttpException("GIG_NOT_FOUND", HttpStatus.NOT_FOUND);
        }

        return gig;
    }

    async getEventGigs(event_id: string): Promise<EventGigEntity[]> {
        let gigs: EventGigEntity[];

        const filter: FindManyOptions<EventGigEntity> = {};
        filter.where = { event: Equal(event_id) };
        filter.loadRelationIds = true;

        try {
            gigs = await this.eventGigRepo.find(filter);
        } catch (error) {
            throw new HttpException("NO_GIG_FOUND", HttpStatus.NOT_FOUND);
        }

        return gigs;
    }

    async updateEventGig(
        payload: EventGigInfo,
        gig?: GigEntity
    ): Promise<EventGigEntity> {
        const eventGig = await this.getEventGigById(payload.id);
        eventGig.title = payload.title ?? eventGig.title;
        eventGig.details = payload.details ?? eventGig.details;
        eventGig.gig = gig ?? eventGig.gig;

        try {
            await this.eventGigRepo.save(eventGig);
        } catch (error) {
            throw new HttpException(
                "EVENT_GIG_NOT_MODIFIED",
                HttpStatus.NOT_MODIFIED
            );
        }

        return eventGig;
    }

    async deleteEventGig(eventGigId: string): Promise<string> {
        const gig = await this.getEventGigById(eventGigId);

        try {
            await this.eventGigRepo.softRemove(gig);
        } catch (error) {
            throw new HttpException(
                "EVENT_GIG_NOT_DELETED",
                HttpStatus.NOT_MODIFIED
            );
        }

        return eventGigId;
    }
}
