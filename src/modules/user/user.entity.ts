import { DefaultEntity } from "@/utils/entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    Relation,
} from "typeorm";
import { PhotoEntity } from "../photo/photo.entity";
import { PostEntity } from "../post/post.entity";

@Entity("user")
class UserEntity extends DefaultEntity {
    @Column("varchar")
    firstname: string;

    @Column("varchar")
    lastname: string;

    @Column("varchar")
    username: string;

    @Column("varchar")
    email: string;

    @Column("varchar")
    description: string;

    @Column("varchar")
    types: string;

    @OneToMany(() => SecretEntity, (secret) => secret.user, { cascade: true })
    secret: Relation<SecretEntity[]>;

    @OneToMany(() => SocialEntity, (social) => social.user, { cascade: true })
    social: Relation<SocialEntity[]>;

    @OneToMany(() => ContactEntity, (contact) => contact.user, {
        cascade: true,
    })
    contacts: Relation<ContactEntity[]>;

    @OneToMany(() => AddressEntity, (address) => address.user, {
        cascade: true,
    })
    address: Relation<AddressEntity[]>;

    @OneToMany(() => UserPhotoEntity, (user_photo) => user_photo.user, {
        cascade: true,
    })
    photos: Relation<UserPhotoEntity[]>;

    @OneToMany(() => PostEntity, (user_post) => user_post.user, {
        cascade: true,
    })
    posts: Relation<PostEntity[]>;
}

@Entity("secret")
class SecretEntity extends DefaultEntity {
    @Column("varchar")
    content: string;

    @ManyToOne(() => UserEntity, (user) => user.secret)
    @JoinColumn({ name: "user_id" })
    user: Relation<UserEntity>;
}

@Entity("social")
class SocialEntity extends DefaultEntity {
    @Column("varchar")
    link: string;

    @Column("varchar")
    type: string;

    @ManyToOne(() => UserEntity, (user) => user.social)
    @JoinColumn({ name: "user_id" })
    user: Relation<UserEntity>;
}

@Entity("contact")
class ContactEntity extends DefaultEntity {
    @Column("varchar")
    content: string;

    @Column("varchar")
    type: string;

    @ManyToOne(() => UserEntity, (user) => user.contacts)
    @JoinColumn({ name: "user_id" })
    user: Relation<UserEntity>;
}

@Entity("address")
class AddressEntity extends DefaultEntity {
    @Column("varchar")
    content: string;

    @Column("varchar")
    type: string;

    @ManyToOne(() => UserEntity, (user) => user.address)
    @JoinColumn({ name: "user_id" })
    user: Relation<UserEntity>;
}

@Entity("user_photo")
class UserPhotoEntity extends DefaultEntity {
    @Column("varchar")
    type: string;

    @ManyToOne(() => UserEntity, (user) => user.photos)
    @JoinColumn({ name: "user_id" })
    user: Relation<UserEntity>;

    @ManyToOne(() => PhotoEntity)
    @JoinColumn({ name: "photo_id" })
    photo: Relation<PhotoEntity>;
}

export {
    AddressEntity,
    ContactEntity,
    SecretEntity,
    SocialEntity,
    UserEntity,
    UserPhotoEntity,
};
