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
import { AuthGuard } from "../auth/auth.guard";
import { CommentEntity } from "../comment/comment.entity";
import { AddCommentPostDto, CreatePostDto, UpdatePostDto } from "./post.dto";
import { PostService } from "./post.service";

@Controller("post")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor("file", { limits: { fileSize: 2_000_000 } })
    )
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

    @Post(":postId/comment")
    @UseGuards(AuthGuard)
    async addComment(
        @Param("postId") id: string,
        @Body() payload: AddCommentPostDto,
        @User() user: UserIdentity
    ): Promise<ApiResponse<CommentEntity>> {
        return {
            message: "COMMENT_ADDED",
            data: await this.postService.addComment(id, user.id, payload),
        };
    }

    @Get(":postId/comment")
    @UseGuards(AuthGuard)
    async getComments(
        @Param("postId") postId: string
    ): Promise<ApiResponse<CommentEntity[]>> {
        return {
            message: "COMMENT_FOUND",
            data: await this.postService.getComments(postId),
        };
    }

    @Delete(":postId/comment/:commentId")
    @UseGuards(AuthGuard)
    async deleteComment(
        @Param("commentId") id: string,
        @User() user: UserIdentity
    ): Promise<ApiResponse<string>> {
        return {
            message: "COMMENT_DELETED",
            data: await this.postService.deleteComment(id, user.id),
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
