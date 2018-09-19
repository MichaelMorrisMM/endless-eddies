import {User} from "../login/user.interface";

export interface CheckUserSessionResult {
    user?: User;
    sessionPresent: boolean;
}
