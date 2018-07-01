import {User} from "../login/user.interface";

export interface PostResult {
    user?: User;
    success: boolean;
    message: string;
}
