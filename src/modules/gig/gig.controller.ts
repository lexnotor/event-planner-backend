import { ApiResponse } from "@/index";
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { UserService } from "../user/user.service";
import { GigEntity } from "./gig.entity";
import { GigService } from "./gig.service";
import { CreateGigDto, FindGigQueryDto, UpdateGigDto } from "./gig.dto";
import { User, UserIdentity } from "../auth/auth.decorator";

@Controller("gig")
export class GigController {
    constructor(
        private readonly gigService: GigService,
        private readonly userService: UserService
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async addGig(
        @Body() payload: CreateGigDto,
        @User() user_: UserIdentity
    ): Promise<ApiResponse<GigEntity>> {
        const user = await this.userService.getUserById(user_.id);
        const gig = await this.gigService.createGig(payload, user);

        return {
            message: "GIG_CREATED",
            data: gig,
        };
    }

    @Get("find")
    async findGig(
        @Query() query: FindGigQueryDto
    ): Promise<ApiResponse<GigEntity[] | GigEntity>> {
        const gigs = query.id
            ? await this.gigService.getGigById(query.id)
            : await this.gigService.getGigs(query.text);

        return {
            message: "GIG_FOUND",
            data: gigs,
        };
    }

    @Put("update/:id")
    async updateGig(
        @Param("id") gigId: string,
        @Body() payload: UpdateGigDto
    ): Promise<ApiResponse<GigEntity>> {
        return {
            message: "GIG_UPDATED",
            data: await this.gigService.updateGig({ ...payload, id: gigId }),
        };
    }

    @Delete("delete/:id")
    @UseGuards(AuthGuard)
    async deleteGig(@Param("id") gigId: string): Promise<ApiResponse<string>> {
        return {
            message: "GIG_FOUND",
            data: await this.gigService.deleteGig(gigId),
        };
    }
}
