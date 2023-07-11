import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DbconfigService } from "./modules/dbconfig/dbconfig.service";
import { PhotoModule } from "./modules/photo/photo.module";
import { PostModule } from "./modules/post/post.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UploaderModule } from "./modules/uploader/uploader.module";
import { InvitationModule } from "./modules/invitation/invitation.module";

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
        InvitationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
