import {Application} from "./application.model";

export interface Config {
    applications: Application[];
    resultLifespanInDays: number;
    allowGuestMode: boolean;
    allowGoogleLogin: boolean;
    allowGithubLogin: boolean;
}
