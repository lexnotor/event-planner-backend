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

@Entity("photo")
class PostEntity extends DefaultEntity {
    @Column("varchar")
    author: string;

    @Column("varchar")
    text: string;

    @Column("varchar")
    public: string;

    @Column("varchar")
    date: string;

    @Column("varchar")
    likes: string;

    @Column("varchar")
    tags: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "user_id" })
    user_id: Relation<UserEntity>;

    @OneToMany(() => PostPhotoEntity, (post_photo) => post_photo.post_id)
    post_photo: Relation<PostPhotoEntity[]>;
}

@Entity("post_photo")
class PostPhotoEntity {
    @ManyToOne(() => PostEntity)
    @JoinColumn({ name: "post_id" })
    post_id: Relation<PostEntity>;

    @ManyToOne(() => PhotoEntity)
    @JoinColumn({ name: "photo_id" })
    photo_id: Relation<PhotoEntity>;
}

export { PostEntity, PostPhotoEntity };
