import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostController } from "./post.controller";
import { PostEntity, PostPhotoEntity } from "./post.entity";
import { PostService } from "./post.service";
import { UserEntity } from "../user/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity, PostPhotoEntity, UserEntity]),
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
