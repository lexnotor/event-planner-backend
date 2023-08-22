import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { CommentModule } from "./modules/comment/comment.module";
import { DbconfigService } from "./modules/dbconfig/dbconfig.service";
import { DesignModule } from "./modules/design/design.module";
import { EventModule } from "./modules/event/event.module";
import { GigModule } from "./modules/gig/gig.module";
import { PhotoModule } from "./modules/photo/photo.module";
import { PostModule } from "./modules/post/post.module";
import { UploaderModule } from "./modules/uploader/uploader.module";
import { UserModule } from "./modules/user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useClass: DbconfigService,
        }),
        UserModule,
        PostModule,
        PhotoModule,
        AuthModule,
        UploaderModule,
        DesignModule,
        CommentModule,
        EventModule,
        GigModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
