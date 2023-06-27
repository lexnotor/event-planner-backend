import { PostInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    FindManyOptions,
    FindOneOptions,
    Like,
    MoreThanOrEqual,
    Repository,
} from "typeorm";
import { PhotoService } from "../photo/photo.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { PostEntity, PostPhotoEntity } from "./post.entity";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepo: Repository<PostEntity>,
        @InjectRepository(PostPhotoEntity)
        private readonly postPhotoRepo: Repository<PostPhotoEntity>,
        private readonly photoService: PhotoService,
        private readonly userService: UserService
    ) {}

    async getPost(id: string): Promise<PostEntity> {
        const filter: FindOneOptions<PostEntity> = {};

        filter.where = { id, public: true };
        filter.select = {
            id: true,
            author: true,
            date: true,
            likes: true,
            tags: true,
            text: true,
            created_at: true,
            deleted_at: true,
            updated_at: true,
            post_photo: true,
            user: {
                id: true,
                firstname: true,
                lastname: true,
            },
        };
        filter.relations = {
            user: true,
            post_photo: true,
        };

        try {
            const post = await this.postRepo.findOneOrFail(filter);
            return post;
        } catch (error) {
            throw new HttpException("POST_NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }

    async getPosts(
        payload: PostInfo = {},
        meta: { offeset: number; limit: number } = { offeset: 0, limit: 20 }
    ): Promise<PostEntity[]> {
        const filter: FindManyOptions<PostEntity> = {};

        filter.where = {
            author: Like(payload.author || "%"),
            likes: MoreThanOrEqual(payload.likes || 0),
            public: true,
        };
        filter.select = {
            id: true,
            author: true,
            date: true,
            likes: true,
            tags: true,
            text: true,
            post_photo: true,
            user: {
                id: true,
                firstname: true,
                lastname: true,
            },
        };
        filter.relations = {
            user: true,
            post_photo: true,
        };
        filter.skip = meta.offeset;
        filter.take = meta.limit;

        try {
            const post = await this.postRepo.find(filter);
            if (post.length == 0) throw new Error();
            return post;
        } catch (error) {
            throw new HttpException("POST_NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }

    async createPost(
        payload: PostInfo,
        user: string | UserEntity,
        file: Express.Multer.File
    ): Promise<PostEntity> {
        const post = new PostEntity();
        post.author = payload.author;
        post.date = payload.date;
        post.likes = 0;
        post.public = payload.public;
        post.tags = payload.tags;
        post.text = payload.text;

        if (typeof user == "string")
            post.user = (await this.userService.getUsers({ id: user }))[0];
        else post.user = user;

        try {
            await this.postRepo.save(post);
        } catch (error) {
            throw new HttpException("INVALID_DATA", HttpStatus.NOT_ACCEPTABLE);
        }
        if (!!file) await this.addPhoto(post, file);

        return post;
    }

    async addPhoto(
        post: string | PostEntity,
        ...files: Express.Multer.File[]
    ): Promise<PostPhotoEntity> {
        const postPhoto = new PostPhotoEntity();

        if (typeof post == "string") postPhoto.post = await this.getPost(post);
        else postPhoto.post = post;

        postPhoto.photo = await this.photoService.savePhoto({}, files[0]);
        try {
            await this.postPhotoRepo.save(postPhoto);
            return postPhoto;
        } catch (error) {
            throw new HttpException("CANT_UPLOAD_PHOTO", HttpStatus.CONFLICT);
        }
    }

    async update(payload: PostInfo): Promise<PostEntity> {
        const post = await this.getPost(payload.id);
        post.public = payload.public || post.public;
        post.text = post.text;

        try {
            this.postRepo.save(post);
            return post;
        } catch (error) {
            throw new HttpException(
                "POST_NOT_MODIFIED",
                HttpStatus.NOT_MODIFIED
            );
        }
    }

    async deletePost(id: string): Promise<string> {
        const post = await this.getPost(id);

        try {
            this.postRepo.softRemove(post);
            return id;
        } catch (error) {
            throw new HttpException(
                "POST_NOT_DELETED",
                HttpStatus.NOT_MODIFIED
            );
        }
    }
}
