import { AddressInfo, ContactInfo, SocialInfo, UserInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Like, Repository } from "typeorm";
import {
    AddressEntity,
    ContactEntity,
    SecretEntity,
    SocialEntity,
    UserEntity,
} from "./user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(SocialEntity)
        private readonly socialRepo: Repository<SocialEntity>,
        @InjectRepository(SecretEntity)
        private readonly secretRepo: Repository<SecretEntity>,
        @InjectRepository(ContactEntity)
        private readonly contactRepo: Repository<ContactEntity>,
        @InjectRepository(AddressEntity)
        private readonly addressRepo: Repository<AddressEntity>
    ) {}

    hashSecret(secret: string) {
        return secret;
    }

    // User Section
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

    async createUser(payload: UserInfo, psw: string): Promise<UserInfo> {
        const user = new UserEntity();
        user.description = payload.description;
        user.email = payload.email;
        user.firstname = payload.firstname;
        user.lastname = payload.lastname;
        user.types = payload.types;
        user.username = payload.username;

        const secret = new SecretEntity();
        secret.content = this.hashSecret(psw);

        try {
            await this.userRepo.save(user);

            secret.user = user;
            await this.secretRepo.save(secret);

            return user;
        } catch (error) {
            throw new HttpException(
                "USERNAME_ALREADY_EXIST",
                HttpStatus.CONFLICT
            );
        }
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

    // Social Section
    async addSocial(payload: SocialInfo, id: string): Promise<SocialInfo> {
        let user: UserEntity;

        try {
            user = await this.userRepo.findOneByOrFail({ id });
        } catch (error) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        const social = new SocialEntity();
        social.link = payload.link;
        social.type = payload.type;
        social.user = user;

        try {
            await this.socialRepo.save(social);

            return social;
        } catch (error) {
            throw new HttpException(
                "CANNOT ADD SOCIAL",
                HttpStatus.NOT_ACCEPTABLE
            );
        }
    }

    async removeSocial(socialId: string, userId: string): Promise<string> {
        try {
            const social = await this.socialRepo.findOneOrFail({
                where: { id: socialId },
                relations: { user: true },
            });
            if (userId != social.user.id)
                throw new HttpException(
                    "NOT_YOUR_SOCIAL",
                    HttpStatus.UNAUTHORIZED
                );
            await this.socialRepo.softRemove(social);

            return socialId;
        } catch (error) {
            throw new HttpException("Social not found", HttpStatus.NOT_FOUND);
        }
    }

    // Contact Section
    async addContact(payload: ContactInfo, id: string): Promise<ContactInfo> {
        let user: UserEntity;

        try {
            user = await this.userRepo.findOneByOrFail({ id });
        } catch (error) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        const contact = new ContactEntity();
        contact.content = payload.content;
        contact.type = payload.type;
        contact.user = user;

        try {
            await this.contactRepo.save(contact);

            return contact;
        } catch (error) {
            throw new HttpException(
                "CANNOT_ADD_CONTACT",
                HttpStatus.NOT_ACCEPTABLE
            );
        }
    }

    async removeContact(contactId: string, userId: string): Promise<string> {
        try {
            const contact = await this.contactRepo.findOneOrFail({
                where: { id: contactId },
                relations: { user: true },
            });

            if (userId != contact.user.id)
                throw new HttpException(
                    "NOT_YOUR_CONTACT",
                    HttpStatus.UNAUTHORIZED
                );
            await this.contactRepo.softRemove(contact);

            return contactId;
        } catch (error) {
            throw new HttpException("Contact not found", HttpStatus.NOT_FOUND);
        }
    }

    // Address Section
    async addAddress(payload: AddressInfo, id: string): Promise<AddressInfo> {
        let user: UserEntity;

        try {
            user = await this.userRepo.findOneByOrFail({ id });
        } catch (error) {
            throw new HttpException("User not found", HttpStatus.NOT_FOUND);
        }

        const address = new ContactEntity();
        address.content = payload.content;
        address.type = payload.type;
        address.user = user;

        try {
            await this.addressRepo.save(address);

            return address;
        } catch (error) {
            throw new HttpException(
                "CANNOT_ADD_ADDRESS",
                HttpStatus.NOT_ACCEPTABLE
            );
        }
    }

    async removeAddress(addressId: string, userId: string): Promise<string> {
        try {
            const address = await this.addressRepo.findOneOrFail({
                where: { id: addressId },
                relations: { user: true },
            });

            if (userId != address.user.id)
                throw new HttpException(
                    "NOT_YOUR_ADDRESS",
                    HttpStatus.UNAUTHORIZED
                );
            await this.addressRepo.softRemove(address);

            return addressId;
        } catch (error) {
            throw new HttpException("Address not found", HttpStatus.NOT_FOUND);
        }
    }
}
