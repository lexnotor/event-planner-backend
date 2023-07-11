import { DefaultEntity } from "@/utils/entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    Relation,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { PhotoEntity } from "../photo/photo.entity";

@Entity("invitation")
class InvitationEntity extends DefaultEntity {
    @Column()
    public: boolean;

    @Column()
    price: string;

    @Column()
    data: string;

    @Column()
    text: string;

    @Column()
    comments: string;

    @Column()
    likes: number;

    @Column()
    tags: string;

    @ManyToOne(() => UserEntity, (user) => user.invitations)
    @JoinColumn({ name: "user_id" })
    user: Relation<UserEntity>;

    @OneToMany(
        () => InvitationPhotoEntity,
        (invitation_photo) => invitation_photo.invitation
    )
    invitation_photo: Relation<InvitationPhotoEntity[]>;
}

@Entity("invitation_photo")
class InvitationPhotoEntity extends DefaultEntity {
    @ManyToOne(() => InvitationEntity)
    @JoinColumn({ name: "invitation_id" })
    invitation: Relation<InvitationEntity>;

    @ManyToOne(() => PhotoEntity)
    @JoinColumn({ name: "photo_id" })
    photo: Relation<PhotoEntity>;
}

export { InvitationEntity, InvitationPhotoEntity };
