import {User} from "../login/user.interface";

export interface PostResult {
    requestName?: string;
    user?: User;
    success: boolean;
    message: string;
}
