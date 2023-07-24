import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventEntity, EventPhotoEntity } from "./event.entity";
import { Repository } from "typeorm";

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(EventEntity)
        private readonly eventRepo: Repository<EventEntity>,
        @InjectRepository(EventPhotoEntity)
        private readonly eventPhotoEntity: Repository<EventPhotoEntity>
    ) {}
}
