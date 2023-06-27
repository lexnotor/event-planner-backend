import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PhotoEntity } from "../photo/photo.entity";
import { PhotoService } from "../photo/photo.service";
import { UserEntity } from "../user/user.entity";
import { PostController } from "./post.controller";
import { PostEntity, PostPhotoEntity } from "./post.entity";
import { PostService } from "./post.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PostEntity,
            PostPhotoEntity,
            UserEntity,
            PhotoEntity,
        ]),
    ],
    controllers: [PostController],
    providers: [PostService, PhotoService],
})
export class PostModule {}
