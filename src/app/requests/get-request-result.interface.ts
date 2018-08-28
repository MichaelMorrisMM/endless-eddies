import {Request} from "./request.interface";
import {Application} from "../configurator/application.model";

export interface GetRequestResult {
    readonly success: boolean;
    readonly message: string;
    readonly request?: Request;
    readonly application?: Application;
    readonly systemOut?: string;
    readonly graphResults?: any[];
}
