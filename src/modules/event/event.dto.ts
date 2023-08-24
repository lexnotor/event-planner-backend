import {
    IsBoolean,
    IsDateString,
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
    @IsDateString()
    date?: string;

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
    @IsDateString()
    date?: string;

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

class AddGigToEventDto {
    @IsNotEmpty()
    @IsUUID()
    eventId: string;

    @IsOptional()
    @IsUUID()
    gigId?: string;

    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @IsOptional()
    @MinLength(3)
    details?: string;
}

class UpdateEventGigDto {
    @IsOptional()
    @IsUUID()
    gigId?: string;

    @IsOptional()
    @MinLength(3)
    title?: string;

    @IsOptional()
    @MinLength(3)
    details?: string;
}

class FindEventGigDto {
    @IsOptional()
    @IsUUID()
    eventId?: string;

    @IsOptional()
    @IsUUID()
    gigId?: string;

    @IsOptional()
    @IsUUID()
    eventGigId?: string;
}

export {
    AddGigToEventDto,
    CreateEventDto,
    QueryEventDto,
    QueryUpdateEventDto,
    UpdateEventDto,
    UpdateEventGigDto,
    FindEventGigDto,
};
