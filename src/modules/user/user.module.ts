import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../auth/auth.module";
import { UserController } from "./user.controller";
import {
    AddressEntity,
    ContactEntity,
    SocialEntity,
    UserEntity,
    UserPhotoEntity,
} from "./user.entity";
import {
    UserAddressService,
    UserContactService,
    UserService,
    UserSocialService,
} from "./user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            SocialEntity,
            ContactEntity,
            AddressEntity,
            UserPhotoEntity,
        ]),
        AuthModule,
    ],
    controllers: [UserController],
    providers: [
        UserService,
        UserSocialService,
        UserContactService,
        UserAddressService,
    ],
})
export class UserModule {}
