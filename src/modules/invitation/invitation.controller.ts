import {
    Body,
    Controller,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { CreateInvitationDto, UpdateInvitationDto } from "./invitation.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "../auth/auth.guard";
import { User, UserIdentity } from "../auth/auth.decorator";
import { InvitationService } from "./invitation.service";
import { ApiResponse, InvitationInfo } from "@/index";

@Controller("invitation")
export class InvitationController {
    constructor(private readonly invitationService: InvitationService) {}

    @Post()
    @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 2000000 } }))
    @UseGuards(AuthGuard)
    async saveInvitation(
        @Body() payload: CreateInvitationDto,
        @UploadedFile() file: Express.Multer.File,
        @User() user: UserIdentity
    ): Promise<ApiResponse<InvitationInfo>> {
        return {
            message: "",
            data: await this.invitationService.saveInvitation(
                payload,
                user.id,
                file
            ),
        };
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async updateInvitation(
        @Body() payload: UpdateInvitationDto,
        @User() user: UserIdentity,
        @Param("id") id: string
    ): Promise<ApiResponse<InvitationInfo>> {
        return {
            message: "INVITATION_UPDATED",
            data: await this.invitationService.updateInvitation(
                { ...payload, id },
                user
            ),
        };
    }
}
