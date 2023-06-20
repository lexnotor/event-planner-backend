import { DefaultEntity } from "@/utils/entity";
import { Column, Entity, ManyToOne, Relation } from "typeorm";
import { UserPhotoEntity } from "../user/user.entity";

@Entity("photo")
class PhotoEntity extends DefaultEntity {
    @Column("varchar")
    link: string;

    @Column("varchar")
    thumb: string;

    @Column("varchar")
    public: string;

    @Column("varchar")
    date: string;

    @Column("varchar")
    comment: string;

    @Column("varchar")
    tags: string;

    @ManyToOne(() => UserPhotoEntity, (user_photo) => user_photo.photo_id)
    user: Relation<UserPhotoEntity>;
}

export { PhotoEntity };
