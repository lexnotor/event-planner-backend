import { CommentInfo, PostInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    Equal,
    FindManyOptions,
    FindOneOptions,
    Like,
    MoreThanOrEqual,
    Repository,
} from "typeorm";
import { UserIdentity } from "../auth/auth.decorator";
import { CommentEntity } from "../comment/comment.entity";
import { CommentService } from "../comment/comment.service";
import { PhotoService } from "../photo/photo.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { PostCommentEntity, PostEntity, PostPhotoEntity } from "./post.entity";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepo: Repository<PostEntity>,
        @InjectRepository(PostPhotoEntity)
        private readonly postPhotoRepo: Repository<PostPhotoEntity>,
        @InjectRepository(PostCommentEntity)
        private readonly postCommentRepo: Repository<PostCommentEntity>,
        private readonly photoService: PhotoService,
        private readonly commentService: CommentService,
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
            post_photo: { photo: true },
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
            author: Like(payload.author ?? "%"),
            likes: MoreThanOrEqual(payload.likes ?? 0),
            public: true,
        };
        filter.select = {
            id: true,
            author: true,
            date: true,
            likes: true,
            tags: true,
            text: true,
            created_at: true,
            post_photo: true,
            user: {
                id: true,
                firstname: true,
                lastname: true,
            },
        };
        filter.relations = {
            user: true,
            post_photo: { photo: true },
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

        return await this.getPost(post.id);
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

    async addComment(
        post: string | PostEntity,
        user: string | UserEntity,
        ...payload: CommentInfo[]
    ): Promise<CommentEntity> {
        const postComment = new PostCommentEntity();

        if (typeof post == "string")
            postComment.post = await this.getPost(post);
        else postComment.post = post;

        if (typeof user == "string")
            postComment.comment = await this.commentService.addComment(
                payload[0],
                await this.userService.getUserById(user)
            );
        else
            postComment.comment = await this.commentService.addComment(
                payload[0],
                user
            );

        try {
            await this.postCommentRepo.save(postComment);
            return postComment.getComment();
        } catch (error) {
            throw new HttpException(
                "CANNOT_SAVE_POST_COMMENT",
                HttpStatus.CONFLICT
            );
        }
    }

    async deleteComment(id: string, user: string): Promise<string> {
        const filter: FindOneOptions<PostCommentEntity> = {};
        filter.where = { comment: { id } };
        filter.relations = { comment: { user: true } };
        filter.select = { id: true, comment: { user: { id: true }, id: true } };

        try {
            const postComment = await this.postCommentRepo.findOneOrFail(
                filter
            );

            if (postComment.comment.user?.id != user)
                throw new Error("NOT_YOUR_COMMENT");

            await this.postCommentRepo.softRemove(postComment);
            return id;
        } catch (error) {
            throw new HttpException("COMMENT_NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }

    async getComments(postId: string): Promise<CommentEntity[]> {
        const filter: FindManyOptions<PostCommentEntity> = {};
        filter.where = { post: Equal(postId) };
        filter.select = {
            comment: {
                created_at: true,
                date: true,
                text: true,
                id: true,
                user: { username: true, firstname: true, lastname: true },
            },
        };
        filter.relations = { comment: { user: true } };
        filter.order = { created_at: "DESC" };

        try {
            const postComment = await this.postCommentRepo.find(filter);

            return postComment.map((item) => item.getComment());
        } catch (error) {
            throw new HttpException("COMMENT_NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }

    async countPostComments(postId: string): Promise<number> {
        return await this.postCommentRepo.countBy({ id: postId });
    }

    async updatePost(
        payload: PostInfo,
        user: string | UserEntity | UserIdentity
    ): Promise<PostEntity> {
        const post = await this.getPost(payload.id);
        post.public = payload.public || post.public;
        post.text = payload.text || post.text;

        if (
            (typeof user == "string" && post.user.id != user) ||
            (typeof user != "string" && post.user.id != user.id)
        )
            throw new HttpException("USER_CONFLICT", HttpStatus.CONFLICT);

        try {
            await this.postRepo.save(post);
            return post;
        } catch (error) {
            throw new HttpException(
                "POST_NOT_MODIFIED",
                HttpStatus.NOT_MODIFIED
            );
        }
    }

    async deletePost(id: string, user: UserIdentity): Promise<string> {
        const post = await this.getPost(id);

        if (post.user.id != user.id)
            throw new HttpException("CONFLICT_USER", HttpStatus.CONFLICT);

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
