import { ApiResponse, CommentInfo, DesignInfo } from "@/index";
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
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { User, UserIdentity } from "../auth/auth.decorator";
import { AuthGuard } from "../auth/auth.guard";
import {
    AddCommentDesignDto,
    CreateDesignDto,
    UpdateDesignDto,
} from "./design.dto";
import { DesignService } from "./design.service";

@Controller("design")
export class DesignController {
    constructor(private readonly designService: DesignService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor("file", { limits: { fileSize: 2_000_000 } })
    )
    @UseGuards(AuthGuard)
    async saveDesign(
        @Body() payload: CreateDesignDto,
        @UploadedFile() file: Express.Multer.File,
        @User() user: UserIdentity
    ): Promise<ApiResponse<DesignInfo>> {
        if (!file) throw new HttpException("NO_FILE", HttpStatus.BAD_REQUEST);

        return {
            message: "",
            data: await this.designService.saveDesign(payload, user.id, file),
        };
    }

    @Put(":designId")
    @UseGuards(AuthGuard)
    async updateDesign(
        @Body() payload: UpdateDesignDto,
        @User() user: UserIdentity,
        @Param("designId") id: string
    ): Promise<ApiResponse<DesignInfo>> {
        return {
            message: "DESIGN_UPDATED",
            data: await this.designService.updateDesign(
                { ...payload, id },
                user
            ),
        };
    }

    @Get(":designId")
    async getDesign(
        @Param("designId") id: string
    ): Promise<ApiResponse<DesignInfo>> {
        return {
            message: "DESIGN_FOUND",
            data: await this.designService.getDesignById(id),
        };
    }

    @Post(":designId/comment")
    @UseGuards(AuthGuard)
    async addComment(
        @Param("designId") id: string,
        @Body() payload: AddCommentDesignDto,
        @User() user: UserIdentity
    ): Promise<ApiResponse<CommentInfo>> {
        return {
            message: "COMMENT_ADDED",
            data: await this.designService.addComment(id, user.id, payload),
        };
    }

    @Delete(":designId/comment/:commentId")
    @UseGuards(AuthGuard)
    async deleteComment(
        @Param("commentId") id: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<string>> {
        return {
            message: "COMMENT_DELETED",
            data: await this.designService.deleteComment(id, user.id),
        };
    }

    @Get()
    async getDesigns(): Promise<ApiResponse<DesignInfo[]>> {
        return {
            message: "DESIGNS_FOUND",
            data: await this.designService.getDesigns(),
        };
    }

    @Delete(":designId")
    @UseGuards(AuthGuard)
    async deleteDesign(
        @Param("designId") id: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<string>> {
        return {
            message: "DESIGN_DELETED",
            data: await this.designService.deleteDesign(id, user),
        };
    }
}
