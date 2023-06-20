import { DefaultEntity } from "@/utils/entity";
import { Column, Entity } from "typeorm";

@Entity("photo")
class PhotoEntity extends DefaultEntity {
    @Column("varchar")
    link: string;

    @Column("varchar")
    thumb: string;

    @Column("varchar")
    public: string;

    @Column("timestamp")
    date: Date;

    @Column("varchar")
    comment: string;

    @Column("varchar")
    tags: string;
}

export { PhotoEntity };
