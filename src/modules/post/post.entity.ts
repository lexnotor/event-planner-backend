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

@Entity("post")
class PostEntity extends DefaultEntity {
    @Column("varchar")
    author: string;

    @Column("varchar")
    text: string;

    @Column("boolean")
    public: boolean;

    @Column("timestamp")
    date: Date;

    @Column("integer")
    likes: number;

    @Column("varchar")
    tags: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "user_id" })
    user: Relation<UserEntity>;

    @OneToMany(() => PostPhotoEntity, (post_photo) => post_photo.post)
    post_photo: Relation<PostPhotoEntity[]>;
}

@Entity("post_photo")
class PostPhotoEntity extends DefaultEntity {
    @ManyToOne(() => PostEntity)
    @JoinColumn({ name: "post_id" })
    post: Relation<PostEntity>;

    @ManyToOne(() => PhotoEntity)
    @JoinColumn({ name: "photo_id" })
    photo: Relation<PhotoEntity>;
}

export { PostEntity, PostPhotoEntity };
