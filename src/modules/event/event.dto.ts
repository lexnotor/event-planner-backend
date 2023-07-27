import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MinLength,
} from "class-validator";

class CreateEventDto {
    @IsOptional()
    @IsBoolean()
    public?: boolean;

    @IsOptional()
    @IsString()
    price?: string;

    @IsOptional()
    @IsString()
    data?: object;

    @IsOptional()
    @IsString()
    text?: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    title: string;

    @IsOptional()
    @IsString()
    comments?: string;

    @IsOptional()
    @IsString()
    likes?: number;

    @IsOptional()
    @IsString()
    tags?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    location?: string;
}
class UpdateEventDto {
    @IsOptional()
    @IsBoolean()
    public?: boolean;

    @IsOptional()
    @IsString()
    price?: string;

    @IsOptional()
    @IsString()
    data?: object;

    @IsOptional()
    @IsString()
    text?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    title?: string;

    @IsOptional()
    @IsString()
    comments?: string;

    @IsOptional()
    @IsString()
    likes?: number;

    @IsOptional()
    @IsString()
    tags?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    location?: string;
}

class QueryUpdateEventDto {
    @IsNotEmpty()
    @IsString()
    @IsUUID()
    user: string;

    @IsNotEmpty()
    @IsString()
    @IsUUID()
    event: string;
}

class QueryEventDto {
    @IsOptional()
    @IsString()
    @IsUUID()
    id?: string;

    @IsOptional()
    @IsString()
    text?: string;

    @IsOptional()
    @IsString()
    title?: string;
}

export { CreateEventDto, QueryEventDto, QueryUpdateEventDto, UpdateEventDto };
