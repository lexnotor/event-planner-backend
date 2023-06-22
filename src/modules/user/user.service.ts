import { UserInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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

    async UpdateUser(payload: UserInfo): Promise<UserInfo> {
        try {
            const filter: FindManyOptions<UserEntity> = {};
            filter.where = {
                id: payload.id,
            };

            const user = await this.userRepo.findOneOrFail(filter);

            payload.firstname && (user.firstname = payload.firstname);
            payload.lastname && (user.lastname = payload.lastname);
            payload.types && (user.types = payload.types);
            payload.description && (user.description = payload.description);

            await this.userRepo.save(user);

            return user;
        } catch (error) {
            throw new HttpException("User not found", HttpStatus.NOT_MODIFIED);
        }
    }

    async disableUser(id: string): Promise<string> {
        try {
            const user = await this.userRepo.findOneOrFail({
                where: { id },
                order: { updated_at: "ASC" },
                relations: {
                    address: true,
                    contacts: true,
                    photos: true,
                    posts: true,
                    secret: true,
                    social: true,
                },
            });

            await this.userRepo.softRemove(user);

            return id;
        } catch (error) {
            throw new HttpException("User not found", HttpStatus.NOT_MODIFIED);
        }
    }

    async deleteUser(id: string): Promise<string> {
        try {
            const user = await this.userRepo.findOneOrFail({
                where: { id },
                order: { updated_at: "ASC" },
                relations: {
                    address: true,
                    contacts: true,
                    photos: true,
                    posts: true,
                    secret: true,
                    social: true,
                },
            });

            await this.userRepo.remove(user);

            return id;
        } catch (error) {
            throw new HttpException("User not found", HttpStatus.NOT_MODIFIED);
        }
    }
}
