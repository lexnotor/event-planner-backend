import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { GigModule } from "../gig/gig.module";
import { PhotoModule } from "../photo/photo.module";
import { UserModule } from "../user/user.module";
import { EventController } from "./event.controller";
import { EventEntity, EventGigEntity, EventPhotoEntity } from "./event.entity";
import { EventService } from "./event.service";
import { EventGigService } from "./event_gig.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            EventEntity,
            EventPhotoEntity,
            EventGigEntity,
        ]),
        JwtModule,
        AuthModule,
        PhotoModule,
        GigModule,
        UserModule,
    ],
    controllers: [EventController],
    providers: [EventService, EventGigService],
})
export class EventModule {}
