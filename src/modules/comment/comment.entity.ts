import { DefaultEntity } from "@/utils/entity";
import { Column, Entity, ManyToOne, Relation } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity("comment")
class CommentEntity extends DefaultEntity {
    @Column()
    text: string;

    @Column()
    public: boolean;

    @Column()
    date: Date;

    @ManyToOne(() => UserEntity)
    user: Relation<UserEntity>;
}

export { CommentEntity };
