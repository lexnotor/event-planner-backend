import { Body, Controller, Param, Post, UploadedFile } from "@nestjs/common";
import { PostService } from "./post.service";
import { ApiResponse, PostInfo } from "@/index";
import { CreatePostDto } from "./post.dto";

@Controller("post")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post(":id")
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
}
