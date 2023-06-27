import { UserInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SecretEntity, UserEntity } from "../user/user.entity";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(SecretEntity)
        private readonly secretRepo: Repository<SecretEntity>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    hashSecret(secret: string) {
        return secret;
    }

    async login(identifiant: string, psw: string) {
        try {
            // Find secret
            const secret = await this.secretRepo.findOneOrFail({
                relations: { user: true },
                where: [
                    {
                        content: psw,
                        user: {
                            email: identifiant,
                        },
                    },
                    {
                        content: psw,
                        user: {
                            username: identifiant,
                        },
                    },
                ],
            });

            // Extrate user
            const user = secret.user;

            // Generate token
            const token = this.jwtService.sign(
                {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    types: user.types,
                },
                {
                    expiresIn: "7d",
                    secret: this.configService.get<string>("JWT_SECRET"),
                }
            );
            return token;
        } catch (error) {
            throw new HttpException(
                "IDENTIFIANT_INVALID",
                HttpStatus.NOT_FOUND
            );
        }
    }

    async signup(payload: UserInfo, psw: string): Promise<UserEntity> {
        const user = new UserEntity();
        user.description = payload.description;
        user.email = payload.email;
        user.firstname = payload.firstname;
        user.lastname = payload.lastname;
        user.types = payload.types;
        user.username = payload.username;

        const secret = new SecretEntity();
        secret.content = this.hashSecret(psw);

        try {
            await this.userRepo.save(user);

            secret.user = user;
            await this.secretRepo.save(secret);

            return user;
        } catch (error) {
            throw new HttpException(
                "USERNAME_ALREADY_EXIST",
                HttpStatus.CONFLICT
            );
        }
    }
}
