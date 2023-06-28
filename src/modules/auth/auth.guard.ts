import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IncomingHttpHeaders } from "http";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest<Request & { user: string }>();

        const token = this.extractJwt(request.headers);

        try {
            if (!token) throw new Error("EXPECTED_TOKEN");
            const user = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            request.user = user;

            return true;
        } catch (error) {
            throw new HttpException(
                error.message || "INVALID_TOKEN",
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    extractJwt({ authorization }: IncomingHttpHeaders): string {
        if (!authorization) return undefined;

        const [type, token] = authorization.split(" ", 2);
        return type == "Bearer" ? token : undefined;
    }
}
