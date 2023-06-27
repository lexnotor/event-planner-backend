import { PhotoInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { Repository } from "typeorm";
import { PhotoEntity } from "./photo.entity";

@Injectable()
export class PhotoService {
    constructor(
        @InjectRepository(PhotoEntity)
        private readonly photoRepo: Repository<PhotoEntity>
    ) {}

    uploadTo(file: any) {
        file;
        return randomUUID();
    }

    async savePhoto(payload: PhotoInfo, file: any): Promise<PhotoEntity> {
        const photo = new PhotoEntity();
        photo.comment = payload.comment || "";
        photo.date = payload.date || new Date();
        photo.link = this.uploadTo(file);
        photo.public = payload.public;
        photo.tags = payload.tags;
        photo.thumb = "";

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
