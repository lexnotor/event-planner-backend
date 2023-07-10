import { UserInfo } from "@/index";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SecretEntity, UserEntity } from "../user/user.entity";
import { genSaltSync, hash, compareSync } from "bcrypt";
import { Buffer } from "buffer";

@Injectable()
export class AuthService {
    salt: string;
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(SecretEntity)
        private readonly secretRepo: Repository<SecretEntity>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {
        const round =
            +this.configService.get<number>("SECRET_HASH_ROUND") || 10;
        this.salt = genSaltSync(round);
    }

    async hashSecret(secret: string) {
        return await hash(secret, this.salt);
    }

    async basicLogin(credential: string, psw: string = null) {
        if (!psw) [credential, psw] = this.extractBasicCredential(credential);

        try {
            // Find secret
            const secrets = await this.secretRepo.find({
                relations: { user: true },
                where: [
                    {
                        user: {
                            email: credential,
                        },
                    },
                    {
                        user: {
                            username: credential,
                        },
                    },
                ],
            });

            // Extrate user
            const matches = secrets.find((secret) =>
                compareSync(psw, secret.content)
            );
            if (!matches) throw new Error("USER_NOT_FOUND");

            const user = matches.user;

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
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    async signup(payload: UserInfo, credential: string): Promise<UserEntity> {
        const [username, psw] = this.extractBasicCredential(credential);
        const user = new UserEntity();
        user.description = payload.description;
        user.email = payload.email;
        user.firstname = payload.firstname;
        user.lastname = payload.lastname;
        user.types = payload.types;
        user.username = username;

        const secret = new SecretEntity();
        secret.content = await this.hashSecret(psw);

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

    extractBasicCredential(authorization: string) {
        const basic = authorization.replace(/^Basic /, "");
        const [credential, psw] = Buffer.from(basic, "base64")
            .toString("utf-8")
            .split(":", 2);
        if (!credential || !psw)
            throw new HttpException("NO_CREDENTIAL", HttpStatus.BAD_REQUEST);

        return [credential, psw];
    }
}
