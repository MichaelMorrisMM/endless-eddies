import {Application} from "./application.model";

export interface Config {
    applications: Application[];
    resultLifespanInDays: number;
    userStorageLimit: number;
    allowGuestMode: boolean;
    allowGoogleLogin: boolean;
    allowGithubLogin: boolean;
}
