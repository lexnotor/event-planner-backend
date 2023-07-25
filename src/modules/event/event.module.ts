import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { PhotoModule } from "../photo/photo.module";
import { UserModule } from "../user/user.module";
import { EventController } from "./event.controller";
import { EventEntity, EventPhotoEntity } from "./event.entity";
import { EventService } from "./event.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([EventEntity, EventPhotoEntity]),
        JwtModule,
        AuthModule,
        PhotoModule,
        UserModule,
    ],
    controllers: [EventController],
    providers: [EventService],
})
export class EventModule {}
