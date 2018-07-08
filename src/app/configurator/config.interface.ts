import {Setting} from "./setting.interface";
import {Application} from "./application.model";

export interface Config {
    settings: Setting[];
    applications: Application[];
    resultLifespanInDays: number;
}
