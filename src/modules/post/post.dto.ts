import { Type } from "class-transformer";
import {
    IsBoolean,
    IsDate,
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from "class-validator";
class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    author: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    date = new Date();

    @IsOptional()
    @IsBoolean()
    public = true;

    @IsString()
    @IsOptional()
    tags = "";

    @IsString()
    @MinLength(3)
    text: string;
}

class UpdatePostDto {
    @IsDateString()
    @IsOptional()
    @Type(() => Date)
    date: Date;

    @IsBoolean()
    @IsOptional()
    public: boolean;

    @IsString()
    @IsOptional()
    tags: string;

    @IsString()
    @IsOptional()
    text: string;
}

class AddCommentPostDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    text: string;

    @IsOptional()
    @IsDate()
    date: Date;
}

export { CreatePostDto, UpdatePostDto, AddCommentPostDto };
