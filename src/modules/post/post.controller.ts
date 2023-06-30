import { ApiResponse, PostInfo } from "@/index";
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
import { CreatePostDto, UpdatePostDto } from "./post.dto";
import { PostService } from "./post.service";
import { AuthGuard } from "../auth/auth.guard";

@Controller("post")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    @UseInterceptors(FileInterceptor("file", { limits: { fileSize: 2000000 } }))
    @UseGuards(AuthGuard)
    async createPost(
        @Body() payload: CreatePostDto,
        @User() user: UserIdentity,
        @UploadedFile() file: Express.Multer.File
    ): Promise<ApiResponse<PostInfo>> {
        return {
            message: "Post created",
            data: await this.postService.createPost(payload, user.id, file),
        };
    }

    @Get()
    async getPosts(): Promise<ApiResponse<PostInfo[]>> {
        return {
            message: "Posts Found",
            data: await this.postService.getPosts(),
        };
    }

    @Get(":postId")
    async getPost(@Param("postId") id: string): Promise<ApiResponse<PostInfo>> {
        return {
            message: "POST_FOUND",
            data: await this.postService.getPost(id),
        };
    }

    @Put(":postId")
    @UseGuards(AuthGuard)
    async updatePost(
        @Body() payload: UpdatePostDto,
        @User() user: UserIdentity,
        @Param("postId") id: string
    ): Promise<ApiResponse<PostInfo>> {
        return {
            message: "Post Updated",
            data: await this.postService.updatePost({ ...payload, id }, user),
        };
    }

    @Delete(":postId")
    @UseGuards(AuthGuard)
    async deletePost(
        @Param("postId") id: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<string>> {
        return {
            message: "Post Deleted",
            data: await this.postService.deletePost(id, user),
        };
    }
}
