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
} from "@nestjs/common";
import { isUUID } from "class-validator";
import {
    AddContactDto,
    AddSocialDto,
    SearchUserDto,
    UpdateUserDto,
} from "./user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    checkId(id: string) {
        if (!isUUID(id))
            throw new HttpException("INVALID_USER", HttpStatus.BAD_REQUEST);
    }

    @Put(":id")
    async updateUser(
        @Body() payload: UpdateUserDto,
        @Param("id") id: string
    ): Promise<ApiResponse<UserInfo>> {
        this.checkId(id);

        return {
            message: "User updated",
            data: await this.userService.UpdateUser({ ...payload, id }),
        };
    }

    @Get(":id")
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
    async addSocial(
        @Body() payload: AddSocialDto,
        @Param("id") id: string
    ): Promise<ApiResponse<SocialInfo>> {
        this.checkId(id);

        return {
            message: "Link Added",
            data: await this.userService.addSocial(payload, id),
        };
    }

    @Delete(":id/social/:socialID")
    async removeSocial(
        @Param("socialID") socialID: string,
        @Param("id") id: string
    ): Promise<ApiResponse<string>> {
        this.checkId(id);

        return {
            message: "Link Deleted",
            data: await this.userService.removeSocial(socialID, id),
        };
    }

    // Contact Section
    @Post(":id/contact")
    async addContact(
        @Body() payload: AddContactDto,
        @Param("id") id: string
    ): Promise<ApiResponse<ContactInfo>> {
        this.checkId(id);

        return {
            message: "Link Added",
            data: await this.userService.addContact(payload, id),
        };
    }

    @Delete(":id/contact/:contactID")
    async removeContact(
        @Param("contactID") contactID: string,
        @Param("id") id: string
    ): Promise<ApiResponse<string>> {
        this.checkId(id);
        this.checkId(contactID);

        return {
            message: "Contact Deleted",
            data: await this.userService.removeContact(contactID, id),
        };
    }
}
