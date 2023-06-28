import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
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
