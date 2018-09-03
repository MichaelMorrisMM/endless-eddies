import {Application} from "./application.model";
import {HomePage} from "./home-page.model";

export interface Config {
    applications: Application[];
    resultLifespanInDays: number;
    userStorageLimit: number;
    allowGuestMode: boolean;
    allowGoogleLogin: boolean;
    allowGithubLogin: boolean;
    homePages: HomePage[];
}
