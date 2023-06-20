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

    @OneToMany(() => SecretEntity, (secret) => secret.user_id)
    secret: Relation<SecretEntity[]>;

    @OneToMany(() => SocialEntity, (social) => social.user_id)
    social: Relation<SocialEntity[]>;

    @OneToMany(() => ContactEntity, (contact) => contact.user_id)
    contacts: Relation<ContactEntity[]>;

    @OneToMany(() => AddressEntity, (address) => address.user_id)
    address: Relation<AddressEntity[]>;

    @OneToMany(() => UserPhotoEntity, (user_photo) => user_photo.user_id)
    photos: Relation<UserPhotoEntity[]>;

    @OneToMany(() => PostEntity, (user_post) => user_post.user_id)
    posts: Relation<PostEntity[]>;
}

@Entity("secret")
class SecretEntity extends DefaultEntity {
    @Column("varchar")
    content: string;

    @ManyToOne(() => UserEntity, (user) => user.secret)
    @JoinColumn({ name: "user_id" })
    user_id: Relation<UserEntity>;
}

@Entity("social")
class SocialEntity extends DefaultEntity {
    @Column("varchar")
    link: string;

    @Column("varchar")
    type: string;

    @ManyToOne(() => UserEntity, (user) => user.social)
    @JoinColumn({ name: "user_id" })
    user_id: Relation<UserEntity>;
}

@Entity("contact")
class ContactEntity extends DefaultEntity {
    @Column("varchar")
    content: string;

    @Column("varchar")
    type: string;

    @ManyToOne(() => UserEntity, (user) => user.contacts)
    @JoinColumn({ name: "user_id" })
    user_id: Relation<UserEntity>;
}

@Entity("address")
class AddressEntity extends DefaultEntity {
    @Column("varchar")
    content: string;

    @Column("varchar")
    type: string;

    @ManyToOne(() => UserEntity, (user) => user.address)
    @JoinColumn({ name: "user_id" })
    user_id: Relation<UserEntity>;
}

@Entity("user_photo")
class UserPhotoEntity {
    @Column("varchar")
    type: string;

    @ManyToOne(() => UserEntity, (user) => user.photos)
    @JoinColumn({ name: "user_id" })
    user_id: Relation<UserEntity>;

    @ManyToOne(() => PhotoEntity, (photo) => photo.user)
    @JoinColumn({ name: "photo_id" })
    photo_id: Relation<PhotoEntity>;
}

export {
    AddressEntity,
    ContactEntity,
    SecretEntity,
    SocialEntity,
    UserEntity,
    UserPhotoEntity,
};
