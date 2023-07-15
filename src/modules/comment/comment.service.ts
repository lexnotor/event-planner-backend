import { CommentInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { CommentEntity } from "./comment.entity";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepo: Repository<CommentEntity>
    ) {}

    async getCommentById(id: string): Promise<CommentEntity> {
        const filter: FindOneOptions<CommentEntity> = {};
        filter.where = { id };
        filter.relations = { user: true };
        filter.select = {
            created_at: true,
            date: true,
            id: true,
            public: true,
            text: true,
            user: { username: true, id: true, description: true },
        };
        try {
            return await this.commentRepo.findOneOrFail(filter);
        } catch (error) {
            throw new HttpException("COMMENT_NOT_FOUND", HttpStatus.NOT_FOUND);
        }
    }

    async addComment(
        payload: CommentInfo,
        user: UserEntity
    ): Promise<CommentEntity> {
        const comment = new CommentEntity();
        comment.date = payload.date ?? new Date();
        comment.text = payload.text ?? "";
        comment.public = payload.public ?? true;
        comment.user = user;

        try {
            await this.commentRepo.save(comment);
            return comment;
        } catch (error) {
            throw new HttpException(
                "CANNOT_SAVE_COMMENT",
                HttpStatus.BAD_REQUEST
            );
        }
    }

    async deleteComment(id: string): Promise<string> {
        const comment = await this.getCommentById(id);
        try {
            await this.commentRepo.softRemove(comment);
            return id;
        } catch (error) {
            throw new HttpException(
                "COMMENT_NOT_DELETED",
                HttpStatus.NOT_MODIFIED
            );
        }
    }
}
