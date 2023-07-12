import { DesignInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    FindManyOptions,
    FindOneOptions,
    Like,
    MoreThanOrEqual,
    Repository,
} from "typeorm";
import { UserIdentity } from "../auth/auth.decorator";
import { PhotoService } from "../photo/photo.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { DesignEntity, DesignPhotoEntity } from "./design.entity";

@Injectable()
export class DesignService {
    constructor(
        @InjectRepository(DesignEntity)
        private readonly designRepo: Repository<DesignEntity>,
        @InjectRepository(DesignPhotoEntity)
        private readonly designPhotoRepo: Repository<DesignPhotoEntity>,
        private readonly photoService: PhotoService,
        private readonly userService: UserService
    ) {}

    async getDesignById(id: string): Promise<DesignEntity> {
        const filter: FindOneOptions<DesignEntity> = {};
        filter.where = { id };
        filter.relations = {
            user: true,
            design_photo: true,
        };
        filter.select = {
            id: true,
            created_at: true,
            design_photo: true,
            price: true,
            public: true,
            text: true,
            tags: true,
            likes: true,
            user: {
                id: true,
                username: true,
                lastname: true,
                firstname: true,
            },
        };
        try {
            const design = await this.designRepo.findOneOrFail(filter);
            return design;
        } catch (error) {
            throw new HttpException("DESIGN_NOTFOUND", HttpStatus.NO_CONTENT);
        }
    }

    async getDesigns(
        payload: DesignInfo,
        meta: { offeset: number; limit: number } = { offeset: 0, limit: 20 }
    ): Promise<DesignEntity[]> {
        const filter: FindManyOptions<DesignEntity> = {};
        filter.where = {
            public: true,
            likes: MoreThanOrEqual(payload.likes ?? 0),
            user: {
                email: Like(payload.user.email ?? "%"),
                username: Like(payload.user.username ?? "%"),
            },
        };
        filter.relations = {
            user: true,
            design_photo: true,
        };
        filter.select = {
            id: true,
            created_at: true,
            design_photo: true,
            price: true,
            public: true,
            text: true,
            tags: true,
            likes: true,
            user: {
                id: true,
                username: true,
                lastname: true,
                firstname: true,
            },
        };
        filter.skip = meta.offeset;
        filter.take = meta.limit;

        try {
            const designs = await this.designRepo.find(filter);
            if (designs.length == 0) throw new Error("empty");
            return designs;
        } catch (error) {
            throw new HttpException("DESIGNS_NOTFOUND", HttpStatus.NO_CONTENT);
        }
    }

    async saveDesign(
        payload: DesignInfo,
        user: string | UserEntity,
        file: Express.Multer.File
    ): Promise<DesignEntity> {
        // create Design
        const design = new DesignEntity();
        design.text = payload.text ?? "";
        design.price = payload.price ?? "free";
        design.public = true;
        design.tags = payload.tags ?? "";
        design.data = payload.data ?? "{}";

        // specify the owner
        if (typeof user == "string")
            design.user = (await this.userService.getUsers({ id: user }))[0];
        else design.user = user;

        // try pushing in database
        try {
            await this.designRepo.save(design);
        } catch (error) {
            throw new HttpException("INVALID_DATA", HttpStatus.NOT_ACCEPTABLE);
        }

        // try add a picture
        if (!!file) await this.addPhoto(design, file);

        // return saved data
        return await this.getDesignById(design.id);
    }

    async addPhoto(
        design: string | DesignEntity,
        ...files: Express.Multer.File[]
    ): Promise<DesignPhotoEntity> {
        // create design_photo
        const designPhoto = new DesignPhotoEntity();

        // specify the design
        if (typeof design == "string")
            designPhoto.design = await this.getDesignById(design);
        else designPhoto.design = design;

        // specify a picture
        designPhoto.photo = await this.photoService.savePhoto({}, files[0]);

        // try saving in database & return result
        try {
            await this.designPhotoRepo.save(designPhoto);
            return designPhoto;
        } catch (error) {
            throw new HttpException("CANT_UPLOAD_PHOTO", HttpStatus.CONFLICT);
        }
    }

    async updateDesign(
        payload: DesignInfo,
        user: string | UserEntity | UserIdentity
    ): Promise<DesignEntity> {
        const design = await this.getDesignById(payload.id);
        design.public = payload.public ?? design.public;
        design.text = payload.text ?? design.text;

        if (
            (typeof user == "string" && design.user.id != user) ||
            (typeof user != "string" && design.user.id != user.id)
        )
            throw new HttpException("USER_CONFLICT", HttpStatus.CONFLICT);

        try {
            await this.designRepo.save(design);
        } catch (error) {
            throw new HttpException(
                "DESIGN_NOT_MODIFIED",
                HttpStatus.NOT_MODIFIED
            );
        }
        return await this.getDesignById(payload.id);
    }

    async deleteDesign(id: string, user: UserIdentity): Promise<string> {
        const design = await this.getDesignById(id);

        if (design.user.id != user.id)
            throw new HttpException("CONFLICT_USER", HttpStatus.CONFLICT);

        try {
            this.designRepo.softRemove(design);
            return id;
        } catch (error) {
            throw new HttpException(
                "DESIGN_NOT_DELETED",
                HttpStatus.NOT_MODIFIED
            );
        }
    }
}
