import {Parameter} from "./parameter.model";
import {Setting} from "./setting.interface";

export interface Config {
    settings: Setting[];
    parameters: Parameter[];
    command: string;
}
