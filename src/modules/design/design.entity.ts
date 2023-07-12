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

export { DesignEntity, DesignPhotoEntity };
