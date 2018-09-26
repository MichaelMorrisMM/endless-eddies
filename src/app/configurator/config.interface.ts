import {Application} from "./application.model";
import {HomePage} from "./home-page.model";
import {Theme} from "../themes/theme.interface";

export interface Config {
    applications: Application[];
    resultLifespanInDays: number;
    userStorageLimit: number;
    allowGuestMode: boolean;
    allowGoogleLogin: boolean;
    allowGithubLogin: boolean;
    appTheme: Theme;
    homePages: HomePage[];
}
