import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { PhotoEntity } from "../photo/photo.entity";
import { PhotoModule } from "../photo/photo.module";
import { SecretEntity, UserEntity } from "../user/user.entity";
import { PostController } from "./post.controller";
import { PostEntity, PostPhotoEntity } from "./post.entity";
import { PostService } from "./post.service";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PostEntity,
            PostPhotoEntity,
            UserEntity,
            PhotoEntity,
            SecretEntity,
        ]),
        UserModule,
        PhotoModule,
        AuthModule,
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
