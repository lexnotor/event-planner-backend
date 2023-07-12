import { InvitationInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    FindManyOptions,
    FindOneOptions,
    Like,
    MoreThanOrEqual,
    Repository,
} from "typeorm";
import { UserIdentity } from "../auth/auth.decorator";
import { PhotoService } from "../photo/photo.service";
import { UserEntity } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { InvitationEntity, InvitationPhotoEntity } from "./invitation.entity";

@Injectable()
export class InvitationService {
    constructor(
        @InjectRepository(InvitationEntity)
        private readonly invitationRepo: Repository<InvitationEntity>,
        @InjectRepository(InvitationPhotoEntity)
        private readonly invitationPhotoRepo: Repository<InvitationPhotoEntity>,
        private readonly photoService: PhotoService,
        private readonly userService: UserService
    ) {}

    async getInvitationById(id: string): Promise<InvitationEntity> {
        const filter: FindOneOptions<InvitationEntity> = {};
        filter.where = { id };
        filter.relations = {
            user: true,
            invitation_photo: true,
        };
        filter.select = {
            id: true,
            created_at: true,
            invitation_photo: true,
            price: true,
            public: true,
            text: true,
            tags: true,
            likes: true,
            user: {
                id: true,
                username: true,
                lastname: true,
                firstname: true,
            },
        };
        try {
            const invitation = await this.invitationRepo.findOneOrFail(filter);
            return invitation;
        } catch (error) {
            throw new HttpException(
                "INVITATION_NOTFOUND",
                HttpStatus.NO_CONTENT
            );
        }
    }

    async getInvitations(
        payload: InvitationInfo,
        meta: { offeset: number; limit: number } = { offeset: 0, limit: 20 }
    ): Promise<InvitationEntity[]> {
        const filter: FindManyOptions<InvitationEntity> = {};
        filter.where = {
            public: true,
            likes: MoreThanOrEqual(payload.likes ?? 0),
            user: {
                email: Like(payload.user.email ?? "%"),
                username: Like(payload.user.username ?? "%"),
            },
        };
        filter.relations = {
            user: true,
            invitation_photo: true,
        };
        filter.select = {
            id: true,
            created_at: true,
            invitation_photo: true,
            price: true,
            public: true,
            text: true,
            tags: true,
            likes: true,
            user: {
                id: true,
                username: true,
                lastname: true,
                firstname: true,
            },
        };
        filter.skip = meta.offeset;
        filter.take = meta.limit;

        try {
            const invitations = await this.invitationRepo.find(filter);
            if (invitations.length == 0) throw new Error("empty");
            return invitations;
        } catch (error) {
            throw new HttpException(
                "INVITATIONS_NOTFOUND",
                HttpStatus.NO_CONTENT
            );
        }
    }

    async saveInvitation(
        payload: InvitationInfo,
        user: string | UserEntity,
        file: Express.Multer.File
    ): Promise<InvitationEntity> {
        // create Invitation
        const invitation = new InvitationEntity();
        invitation.text = payload.text ?? "";
        invitation.price = payload.price ?? "free";
        invitation.public = true;
        invitation.tags = payload.tags ?? "";

        // specify the owner
        if (typeof user == "string")
            invitation.user = (
                await this.userService.getUsers({ id: user })
            )[0];
        else invitation.user = user;

        // try pushing in database
        try {
            await this.invitationRepo.save(invitation);
        } catch (error) {
            throw new HttpException("INVALID_DATA", HttpStatus.NOT_ACCEPTABLE);
        }

        // try add a picture
        if (!!file) await this.addPhoto(invitation, file);

        // return saved data
        return await this.getInvitationById(invitation.id);
    }

    async addPhoto(
        invitation: string | InvitationEntity,
        ...files: Express.Multer.File[]
    ): Promise<InvitationPhotoEntity> {
        // create invitation_photo
        const invitationPhoto = new InvitationPhotoEntity();

        // specify the invitation
        if (typeof invitation == "string")
            invitationPhoto.invitation = await this.getInvitationById(
                invitation
            );
        else invitationPhoto.invitation = invitation;

        // specify a picture
        invitationPhoto.photo = await this.photoService.savePhoto({}, files[0]);

        // try saving in database & return result
        try {
            await this.invitationPhotoRepo.save(invitationPhoto);
            return invitationPhoto;
        } catch (error) {
            throw new HttpException("CANT_UPLOAD_PHOTO", HttpStatus.CONFLICT);
        }
    }

    async updateInvitation(
        payload: InvitationInfo,
        user: string | UserEntity | UserIdentity
    ): Promise<InvitationEntity> {
        const invitation = await this.getInvitationById(payload.id);
        invitation.public = payload.public ?? invitation.public;
        invitation.text = payload.text ?? invitation.text;

        if (
            (typeof user == "string" && invitation.user.id != user) ||
            (typeof user != "string" && invitation.user.id != user.id)
        )
            throw new HttpException("USER_CONFLICT", HttpStatus.CONFLICT);

        try {
            await this.invitationRepo.save(invitation);
        } catch (error) {
            throw new HttpException(
                "INVITATION_NOT_MODIFIED",
                HttpStatus.NOT_MODIFIED
            );
        }
        return await this.getInvitationById(payload.id);
    }

    async deleteInvitation(id: string, user: UserIdentity): Promise<string> {
        const invitation = await this.getInvitationById(id);

        if (invitation.user.id != user.id)
            throw new HttpException("CONFLICT_USER", HttpStatus.CONFLICT);

        try {
            this.invitationRepo.softRemove(invitation);
            return id;
        } catch (error) {
            throw new HttpException(
                "INVITATION_NOT_DELETED",
                HttpStatus.NOT_MODIFIED
            );
        }
    }
}
