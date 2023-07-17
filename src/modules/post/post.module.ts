import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { CommentModule } from "../comment/comment.module";
import { PhotoModule } from "../photo/photo.module";
import { UserModule } from "../user/user.module";
import { PostController } from "./post.controller";
import { PostCommentEntity, PostEntity, PostPhotoEntity } from "./post.entity";
import { PostService } from "./post.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PostEntity,
            PostPhotoEntity,
            PostCommentEntity,
        ]),
        UserModule,
        PhotoModule,
        AuthModule,
        CommentModule,
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
