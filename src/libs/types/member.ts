import { Request } from "express";
import { MemberStatus, MemberType } from "../enums/member.enum";

export interface Member {
    _id: string;
    memberType: MemberType;
    memberStatus: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword?: string;
    memberImage?: string;
    memberPoints: number;
    memberAddress?: string;
    memberDesc?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MemberInput {
    memberType?: MemberType;
    memberStatus?: MemberStatus;
    memberNick: string;
    memberPhone: string;
    memberPassword: string;
    memberImage?: string;
    memberAddress?: string;
    memberDesc?: string;
}

export interface LoginInput {
    memberNick: string;
    memberPassword: string;
}

export interface MemberUpdateInput {
    memberNick?: string;
    memberPhone?: string;
    memberPassword?: string;
    memberImage?: string;
    memberAddress?: string;
    memberDesc?: string;
}

export interface ExtendedRequest extends Request {
    member: Member;
}