import { PostInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PhotoService } from "../photo/photo.service";
import { PostEntity, PostPhotoEntity } from "./post.entity";
import { UserService } from "../user/user.service";
import { UserEntity } from "../user/user.entity";

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
        try {
            const post = await this.postRepo.findOneByOrFail({ id });
            return post;
        } catch (error) {
            throw new HttpException("POST_NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }

    async addPost(
        payload: PostInfo,
        user: string | UserEntity,
        file: any
    ): Promise<PostEntity> {
        const post = new PostEntity();
        post.author = payload.author;
        post.date = payload.date;
        post.likes = 0;
        post.public = "true";
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
        ...files: any[]
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
}
