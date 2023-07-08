import { Module } from "@nestjs/common";
import { PhotoController } from "./photo.controller";
import { PhotoService } from "./photo.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhotoEntity } from "./photo.entity";
import { UploaderModule } from "../uploader/uploader.module";
import { UploaderService } from "../uploader/uploader.service";

@Module({
    imports: [TypeOrmModule.forFeature([PhotoEntity]), UploaderModule],
    controllers: [PhotoController],
    providers: [PhotoService, UploaderService],
    exports: [PhotoService, UploaderService],
})
export class PhotoModule {}
