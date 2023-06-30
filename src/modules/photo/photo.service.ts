import { PhotoInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UploaderService } from "../uploader/uploader.service";
import { PhotoEntity } from "./photo.entity";

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(PhotoEntity)
        private readonly photoRepo: Repository<PhotoEntity>,
        private readonly uploaderService: UploaderService
    ) {}

    async uploadTo(file: Express.Multer.File) {
        const remote_file = await this.uploaderService.uploadFile(file);
        return remote_file.url;
    }

    async savePhoto(
        payload: PhotoInfo,
        file: Express.Multer.File
    ): Promise<PhotoEntity> {
        const photo = new PhotoEntity();
        photo.comment = payload.comment || "";
        photo.date = payload.date || new Date();
        photo.public = payload.public || true;
        photo.tags = payload.tags || "";
        photo.thumb = "";
        photo.link = await this.uploadTo(file);

        try {
            await this.photoRepo.save(photo);
            return photo;
        } catch (error) {
            throw new HttpException("Bad Image", HttpStatus.NOT_ACCEPTABLE);
        }
    }

    async getPhoto(id: string): Promise<PhotoEntity> {
        try {
            const photo = await this.photoRepo.findOneByOrFail({ id });
            return photo;
        } catch (error) {
            throw new HttpException("PHOTO_NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }

    async updatePhoto(payload: PhotoInfo): Promise<PhotoEntity> {
        const photo = await this.getPhoto(payload.id);
        photo.comment = payload.comment || photo.comment;
        photo.date = payload.date || photo.date;
        photo.public = payload.public || photo.public;
        photo.tags = payload.tags || photo.tags;
        try {
            await this.photoRepo.save(photo);
            return photo;
        } catch (error) {
            throw new HttpException("UPDATE_FAILED", HttpStatus.NOT_MODIFIED);
        }
    }

    async deletePhoto(id: string): Promise<string> {
        const photo = await this.getPhoto(id);

        try {
            this.photoRepo.softRemove(photo);

            return id;
        } catch (error) {
            throw new HttpException("DELETION_FAILED", HttpStatus.NOT_FOUND);
        }
    }
}
