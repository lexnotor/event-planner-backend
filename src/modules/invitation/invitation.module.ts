import { Module } from "@nestjs/common";
import { InvitationController } from "./invitation.controller";
import { InvitationService } from "./invitation.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InvitationEntity, InvitationPhotoEntity } from "./invitation.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([InvitationEntity, InvitationPhotoEntity]),
    ],
    controllers: [InvitationController],
    providers: [InvitationService],
})
export class InvitationModule {}
