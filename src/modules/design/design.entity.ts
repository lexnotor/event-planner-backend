import { DefaultEntity } from "@/utils/entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    Relation,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { PhotoEntity } from "../photo/photo.entity";
import { CommentEntity } from "../comment/comment.entity";

@Entity("design")
class DesignEntity extends DefaultEntity {
    @Column("boolean")
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

    @ManyToOne(() => UserEntity, (user) => user.designs)
    @JoinColumn({ name: "user_id" })
    user: Relation<UserEntity>;

    @OneToMany(() => DesignPhotoEntity, (design_photo) => design_photo.design)
    design_photo: Relation<DesignPhotoEntity[]>;
}

@Entity("design_photo")
class DesignPhotoEntity extends DefaultEntity {
    @ManyToOne(() => DesignEntity)
    @JoinColumn({ name: "design_id" })
    design: Relation<DesignEntity>;

    @ManyToOne(() => PhotoEntity)
    @JoinColumn({ name: "photo_id" })
    photo: Relation<PhotoEntity>;
}

@Entity("design_comment")
class DesignCommentEntity extends DefaultEntity {
    @ManyToOne(() => DesignEntity)
    @JoinColumn({ name: "design_id" })
    design?: Relation<DesignEntity>;

    @OneToOne(() => CommentEntity, { cascade: true })
    @JoinColumn({ name: "comment_id" })
    comment?: Relation<CommentEntity>;

    getComment() {
        return this.comment;
    }
}

export { DesignEntity, DesignPhotoEntity, DesignCommentEntity };
