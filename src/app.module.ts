import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PostModule } from "./modules/post/post.module";
import { UserModule } from "./modules/user/user.module";
import { PhotoModule } from './modules/photo/photo.module';

@Module({
    imports: [UserModule, PostModule, PhotoModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
