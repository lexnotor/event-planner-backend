import { ApiResponse, ContactInfo, SocialInfo, UserInfo } from "@/index";
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";
import { isUUID } from "class-validator";
import { User, UserIdentity } from "../auth/auth.decorator";
import { AuthGuard } from "../auth/auth.guard";
import {
    AddContactDto,
    AddSocialDto,
    SearchUserDto,
    UpdateUserDto,
} from "./user.dto";
import {
    UserAddressService,
    UserContactService,
    UserService,
    UserSocialService,
} from "./user.service";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly userSocialService: UserSocialService,
        private readonly userContactService: UserContactService,
        private readonly userAddressService: UserAddressService
    ) {}

    checkId(id: string) {
        if (!isUUID(id))
            throw new HttpException("INVALID_USER", HttpStatus.BAD_REQUEST);
    }

    isMe(me: UserIdentity, id: string) {
        return me.id == id;
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async updateUser(
        @Body() payload: UpdateUserDto,
        @Param("id") id: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<UserInfo>> {
        this.checkId(id);
        if (!this.isMe(user, id))
            throw new HttpException("UNAUTHORIZED_USER", HttpStatus.CONFLICT);
        return {
            message: "User updated",
            data: await this.userService.UpdateUser({ ...payload, id }),
        };
    }
    @Get("me")
    @UseGuards(AuthGuard)
    async getMe(@User() user: UserIdentity): Promise<ApiResponse<UserInfo>> {
        return {
            message: "User",
            data: await this.userService.getUserById(user.id),
        };
    }

    @Get(":id")
    @UseGuards(AuthGuard)
    async getUser(@Param("id") id: string): Promise<ApiResponse<UserInfo>> {
        this.checkId(id);

        return {
            message: "User",
            data: await this.userService.getUserById(id),
        };
    }

    @Get()
    async searchUser(
        @Query() data: SearchUserDto
    ): Promise<ApiResponse<UserInfo[]>> {
        return {
            message: "Users",
            data: await this.userService.getUsers(data, { photos: true }),
        };
    }

    // Social Section
    @Post(":id/social")
    @UseGuards(AuthGuard)
    async addSocial(
        @Body() payload: AddSocialDto,
        @Param("id") id: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<SocialInfo>> {
        this.checkId(id);

        if (!this.isMe(user, id))
            throw new HttpException("UNAUTHORIZED_USER", HttpStatus.CONFLICT);

        return {
            message: "Link Added",
            data: await this.userSocialService.addSocial(payload, id),
        };
    }

    @Delete(":id/social/:socialID")
    @UseGuards(AuthGuard)
    async removeSocial(
        @Param("socialID") socialID: string,
        @Param("id") id: string
    ): Promise<ApiResponse<string>> {
        this.checkId(id);

        return {
            message: "Link Deleted",
            data: await this.userSocialService.removeSocial(socialID, id),
        };
    }

    // Contact Section
    @Post(":id/contact")
    @UseGuards(AuthGuard)
    async addContact(
        @Body() payload: AddContactDto,
        @Param("id") id: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<ContactInfo>> {
        this.checkId(id);

        if (!this.isMe(user, id))
            throw new HttpException("UNAUTHORIZED_USER", HttpStatus.CONFLICT);

        return {
            message: "Contact Added",
            data: await this.userContactService.addContact(payload, id),
        };
    }

    @Delete(":id/contact/:contactID")
    @UseGuards(AuthGuard)
    async removeContact(
        @Param("contactID") contactID: string,
        @Param("id") id: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<string>> {
        this.checkId(id);
        this.checkId(contactID);

        if (!this.isMe(user, id))
            throw new HttpException("UNAUTHORIZED_USER", HttpStatus.CONFLICT);

        return {
            message: "Contact Deleted",
            data: await this.userContactService.removeContact(contactID, id),
        };
    }

    // Contact Section
    @Post(":id/address")
    @UseGuards(AuthGuard)
    async addAddress(
        @Body() payload: AddContactDto,
        @Param("id") id: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<ContactInfo>> {
        this.checkId(id);

        if (!this.isMe(user, id))
            throw new HttpException("UNAUTHORIZED_USER", HttpStatus.CONFLICT);

        return {
            message: "Address Added",
            data: await this.userAddressService.addAddress(payload, id),
        };
    }

    @Delete(":id/address/:addressID")
    @UseGuards(AuthGuard)
    async removeAddress(
        @Param("addressID") addressID: string,
        @Param("id") id: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<string>> {
        this.checkId(id);
        this.checkId(addressID);

        if (!this.isMe(user, id))
            throw new HttpException("UNAUTHORIZED_USER", HttpStatus.CONFLICT);

        return {
            message: "Address Deleted",
            data: await this.userAddressService.removeAddress(addressID, id),
        };
    }
}
