import { ApiResponse, DesignInfo } from "@/index";
import {
    Body,
    Controller,
    Delete,
    Get,
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
import { CreateDesignDto, UpdateDesignDto } from "./design.dto";
import { DesignService } from "./design.service";

@Controller("design")
export class DesignController {
    constructor(private readonly designService: DesignService) {}

    @Post()
    @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 2000000 } }))
    @UseGuards(AuthGuard)
    async saveDesign(
        @Body() payload: CreateDesignDto,
        @UploadedFile() file: Express.Multer.File,
        @User() user: UserIdentity
    ): Promise<ApiResponse<DesignInfo>> {
        return {
            message: "",
            data: await this.designService.saveDesign(payload, user.id, file),
        };
    }

    @Put(":id")
    @UseGuards(AuthGuard)
    async updateDesign(
        @Body() payload: UpdateDesignDto,
        @User() user: UserIdentity,
        @Param("id") id: string
    ): Promise<ApiResponse<DesignInfo>> {
        return {
            message: "DESIGN_UPDATED",
            data: await this.designService.updateDesign(
                { ...payload, id },
                user
            ),
        };
    }

    @Get(":id")
    async getDesign(@Param("id") id: string): Promise<ApiResponse<DesignInfo>> {
        return {
            message: "DESIGN_FOUND",
            data: await this.designService.getDesignById(id),
        };
    }

    @Get()
    async getDesigns(): Promise<ApiResponse<DesignInfo[]>> {
        return {
            message: "DESIGNS_FOUND",
            data: await this.designService.getDesigns(),
        };
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    async deleteDesign(
        @Param("id") id: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<string>> {
        return {
            message: "DESIGN_DELETED",
            data: await this.designService.deleteDesign(id, user),
        };
    }
}
