import { Module } from "@nestjs/common";
import { InvitationController } from "./invitation.controller";
import { InvitationService } from "./invitation.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvitationEntity, InvitationPhotoEntity } from "./invitation.entity";
import { UserEntity } from "../user/user.entity";
import { PhotoEntity } from "../photo/photo.entity";
import { UserModule } from "../user/user.module";
import { PhotoModule } from "../photo/photo.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            InvitationEntity,
            InvitationPhotoEntity,
            UserEntity,
            PhotoEntity,
        ]),
        UserModule,
        PhotoModule,
        AuthModule,
    ],
    controllers: [InvitationController],
    providers: [InvitationService],
})
export class InvitationModule {}
