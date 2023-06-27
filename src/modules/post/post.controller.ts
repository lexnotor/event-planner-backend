import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { ApiResponse, PostInfo } from "@/index";
import { CreatePostDto } from "./post.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("post")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post(":id")
    @UseInterceptors(FileInterceptor("file"))
    async createPost(
        @Body() payload: CreatePostDto,
        @Param("id") user: string,
        @UploadedFile() file: Express.Multer.File
    ): Promise<ApiResponse<PostInfo>> {
        return {
            message: "Post created",
            data: await this.postService.createPost(payload, user, file),
        };
    }

    @Get()
    async getPosts(): Promise<ApiResponse<PostInfo[]>> {
        return {
            message: "Posts Found",
            data: await this.postService.getPosts(),
        };
    }
}
