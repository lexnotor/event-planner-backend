export type ApiResponse<T = object> = {
    message: string;
    data?: T;
};

export interface DefaultInfo {
    id?: string;
    created_at?: Date;
    deleted_at?: Date;
    updated_at?: Date;
}

export interface UserInfo extends DefaultInfo {
    firstname?: string;
    lastname?: string;
    username?: string;
    email?: string;
    description?: string;
    types?: string;
    secret?: SecretInfo[];
    social?: SocialInfo[];
    contacts?: ContactInfo[];
    address?: AddressInfo[];
    photos?: UserPhotoInfo[];
    posts?: PostInfo[];
    invitations?: InvitationInfo[];
}

export interface SecretInfo extends DefaultInfo {
    content?: string;
    user?: UserInfo;
}

export interface SocialInfo extends DefaultInfo {
    link?: string;
    type?: string;
    user?: UserInfo;
}

export interface ContactInfo extends DefaultInfo {
    content?: string;
    type?: string;
    user?: UserInfo;
}

export interface AddressInfo extends DefaultInfo {
    content?: string;
    type?: string;
    user?: UserInfo;
}

export interface UserPhotoInfo extends DefaultInfo {
    type?: string;
    user?: UserInfo;
    photo?: PhotoInfo;
}

export interface PostInfo extends DefaultInfo {
    author?: string;
    text?: string;
    public?: boolean;
    date?: Date;
    likes?: number;
    tags?: string;
    user?: UserInfo;
    post_photo?: PostPhotoInfo[];
}

export interface PostPhotoInfo extends DefaultInfo {
    post?: PostInfo;
    photo?: PhotoInfo;
}

export interface PhotoInfo extends DefaultInfo {
    link?: string;
    thumb?: string;
    public?: boolean;
    date?: Date;
    comment?: string;
    tags?: string;
}

export interface FileMeta {
    size: number;
    filename: string;
    url: string;
    mimetype: string;
    public_id?: string;
    format?: string;
    type?: string;
}

export interface InvitationInfo extends DefaultInfo {
    public?: boolean;
    price?: string;
    data?: string;
    text?: string;
    comments?: string;
    likes?: number;
    tags?: string;
    user?: UserInfo;
    invitation_photo?: InvitationPhotoInfo[];
}

export interface InvitationPhotoInfo extends DefaultInfo {
    invitation?: InvitationInfo;
    photo?: PhotoInfo;
}
