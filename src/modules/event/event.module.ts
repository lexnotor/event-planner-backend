import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventEntity, EventPhotoEntity } from "./event.entity";
import { PhotoModule } from "../photo/photo.module";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([EventEntity, EventPhotoEntity]),
        PhotoModule,
        UserModule,
    ],
    controllers: [EventController],
    providers: [EventService],
})
export class EventModule {}
