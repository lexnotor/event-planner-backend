import { GigInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    Equal,
    FindManyOptions,
    FindOneOptions,
    ILike,
    Repository,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { GigEntity } from "./gig.entity";

@Injectable()
export class GigService {
    constructor(
        @InjectRepository(GigEntity)
        private readonly gigRepo: Repository<GigEntity>
    ) {}

    async createGig(payload: GigInfo, user: UserEntity): Promise<GigEntity> {
        const gig = new GigEntity();
        gig.likes = 0;
        gig.tags = payload?.tags ?? "";
        gig.text = payload?.text ?? "";
        gig.title = payload?.title ?? "";
        gig.type = payload.type ?? "";
        gig.user = user;

        try {
            await this.gigRepo.save(gig);
        } catch (error) {
            throw new HttpException("GIG_NOT_SAVED", HttpStatus.BAD_REQUEST);
        }

        return await this.getGigById(gig.id);
    }

    async updateGig(payload: GigInfo): Promise<GigEntity> {
        const gig = await this.getGigById(payload.id);

        try {
            await this.gigRepo.save(gig);
        } catch (error) {
            throw new HttpException(
                "GIG_NOT_MODIFIED",
                HttpStatus.NOT_MODIFIED
            );
        }
        return await this.getGigById(gig.id);
    }

    async getGigById(gigId: string, withDeleted = false): Promise<GigEntity> {
        let gig: GigEntity;
        const filter: FindOneOptions<GigEntity> = {};
        filter.where = { id: Equal(gigId) };
        filter.relations = { user: true };
        filter.select = {
            id: true,
            created_at: true,
            likes: true,
            tags: true,
            text: true,
            title: true,
            type: true,
            user: { id: true, username: true },
        };

        filter.withDeleted = withDeleted;

        try {
            gig = await this.gigRepo.findOneOrFail(filter);
        } catch (error) {
            throw new HttpException("GIG_NOT_FOUND", HttpStatus.NOT_FOUND);
        }

        return gig;
    }

    async getGigs(text: string): Promise<GigEntity[]> {
        let gigs: GigEntity[];

        const filter: FindManyOptions<GigEntity> = {};
        filter.where = [
            { text: ILike(`%${text ?? ""}%`) },
            { tags: ILike(`%${text ?? ""}%`) },
            { title: ILike(`%${text ?? ""}%`) },
            { type: ILike(`%${text ?? ""}%`) },
        ];

        filter.relations = { user: true };
        filter.select = {
            id: true,
            created_at: true,
            tags: true,
            text: true,
            title: true,
            type: true,
        };

        try {
            gigs = await this.gigRepo.find(filter);
        } catch (error) {
            throw new HttpException("NO_GIG_FOUND", HttpStatus.NOT_FOUND);
        }

        return gigs;
    }

    async getUserGigs(userId: string): Promise<GigEntity[]> {
        let gigs: GigEntity[];

        const filter: FindManyOptions<GigEntity> = {};
        filter.where = [{ user: Equal(userId) }];

        filter.relations = { user: true };
        filter.select = {
            id: true,
            created_at: true,
            tags: true,
            text: true,
            title: true,
            type: true,
        };

        try {
            gigs = await this.gigRepo.find(filter);
        } catch (error) {
            throw new HttpException("NO_GIG_FOUND", HttpStatus.NOT_FOUND);
        }

        return gigs;
    }

    async deleteGig(gigId: string): Promise<string> {
        const gig = await this.getGigById(gigId);

        try {
            await this.gigRepo.softRemove(gig);
        } catch (error) {
            throw new HttpException("GIG_NOT_DELETED", HttpStatus.NOT_MODIFIED);
        }

        return gigId;
    }
}
