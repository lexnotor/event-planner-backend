import { ApiResponse, PostInfo } from "@/index";
import {
    Body,
    Controller,
    Get,
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
    @UseInterceptors(FileInterceptor("file"))
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

    @Put(":postId")
    @UseGuards(AuthGuard)
    async updatePost(
        @Body() payload: UpdatePostDto,
        @User() user: UserIdentity
    ): Promise<ApiResponse<PostInfo>> {
        return {
            message: "",
            data: await this.postService.update(payload, user),
        };
    }
}
