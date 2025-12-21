import { MurmurType } from "./murmurType";

export type UserType = {
    id: string;
    username: string;
    email: string;
    createdAt: any;
    murmurs: MurmurType[];
}