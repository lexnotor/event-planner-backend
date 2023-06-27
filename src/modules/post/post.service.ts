import { PostInfo, PostPhotoInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PhotoService } from "../photo/photo.service";
import { PostEntity, PostPhotoEntity } from "./post.entity";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepo: Repository<PostEntity>,
        @InjectRepository(PostPhotoEntity)
        private readonly postPhotoRepo: Repository<PostPhotoEntity>,
        private readonly photoService: PhotoService
    ) {}

    async getPost(id: string): Promise<PostEntity> {
        try {
            const post = await this.postRepo.findOneByOrFail({ id });
            return post;
        } catch (error) {
            throw new HttpException("POST_NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }

    async addPost(payload: PostInfo, file: any): Promise<PostEntity> {
        const post = new PostEntity();
        post.author = payload.author;
        post.date = payload.date;
        post.likes = 0;
        post.public = "true";
        post.tags = payload.tags;
        post.text = payload.text;
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
