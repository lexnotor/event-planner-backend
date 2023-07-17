import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { PhotoModule } from "../photo/photo.module";
import { UserModule } from "../user/user.module";
import { DesignController } from "./design.controller";
import {
    DesignCommentEntity,
    DesignEntity,
    DesignPhotoEntity,
} from "./design.entity";
import { DesignService } from "./design.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DesignEntity,
            DesignPhotoEntity,
            DesignCommentEntity,
        ]),
        UserModule,
        PhotoModule,
        AuthModule,
    ],
    controllers: [DesignController],
    providers: [DesignService],
})
export class DesignModule {}
