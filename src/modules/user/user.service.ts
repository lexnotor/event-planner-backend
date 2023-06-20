import { UserInfo } from "@/index";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Like, Repository } from "typeorm";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>
    ) {}

    async getUser(
        payload: UserInfo,
        load: Record<string, boolean>
    ): Promise<UserInfo[]> {
        const filter: FindManyOptions<UserEntity> = {};
        filter.where = {
            id: Like(payload.id || "%"),
            email: Like(payload.email || "%"),
            lastname: Like(payload.lastname || "%"),
            firstname: Like(payload.firstname || "%"),
            username: Like(payload.username || "%"),
            types: Like(payload.types || "%"),
        };
        filter.relations = {
            contacts: !!load.contacts,
            address: !!load.address,
            social: !!load.social,
            photos: !!load.photos,
        };

        const users = await this.userRepo.find(filter);

        return users;
    }

    async getUserById(id: string): Promise<UserInfo> {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: {
                address: true,
                contacts: true,
                photos: true,
                posts: true,
                social: true,
            },
        });
        return user;
    }
}
