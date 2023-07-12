import { Module } from "@nestjs/common";
import { DesignController } from "./design.controller";
import { DesignService } from "./design.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DesignEntity, DesignPhotoEntity } from "./design.entity";
import { UserEntity } from "../user/user.entity";
import { PhotoEntity } from "../photo/photo.entity";
import { UserModule } from "../user/user.module";
import { PhotoModule } from "../photo/photo.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DesignEntity,
            DesignPhotoEntity,
            UserEntity,
            PhotoEntity,
        ]),
        UserModule,
        PhotoModule,
        AuthModule,
    ],
    controllers: [DesignController],
    providers: [DesignService],
})
export class DesignModule {}
