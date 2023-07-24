import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEntity, EventPhotoEntity } from "./event.entity";
import { PhotoModule } from "../photo/photo.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([EventEntity, EventPhotoEntity]),
        PhotoModule,
    ],
    controllers: [EventController],
    providers: [EventService],
})
export class EventModule {}
