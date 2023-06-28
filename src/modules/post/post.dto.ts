import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";
import { Type } from "class-transformer";
class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    author: string;

    @IsString()
    @Type(() => Date)
    date = new Date();

    @IsString()
    public = true;

    @IsString()
    tags: string;

    @IsString()
    text: string;
}

class UpdatePostDto {
    @IsDateString()
    @IsOptional()
    @Type(() => Date)
    date: Date;

    @IsString()
    @IsOptional()
    public = true;

    @IsString()
    @IsOptional()
    tags: string;

    @IsString()
    @IsOptional()
    text: string;
}

export { CreatePostDto, UpdatePostDto };
