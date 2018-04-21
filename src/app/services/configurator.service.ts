import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConstantsService} from './constants.service';
import {PostResult} from "../configurator/post-result.interface";
import {Config} from "../configurator/config.interface";
import {Setting} from "../configurator/setting.interface";
import {ValidatorBlueprint} from "../configurator/validator-blueprint.interface";

@Injectable()
export class ConfiguratorService {

    public readonly TYPE_FLAG: string = "flag";
    public readonly TYPE_STRING: string = "string";
    public readonly TYPE_INTEGER: string = "integer";
    public readonly TYPE_FLOAT: string = "float";
    public readonly GROUP_USERS: string = "users";
    public readonly SETTING_ALLOW_GUEST_MODE: string = "allow_guest_mode";
    public readonly SETTING_ALLOW_GOOGLE_AUTH: string = "allow_google_auth";
    public readonly SETTING_ALLOW_GITHUB_AUTH: string = "allow_github_auth";

    constructor(private http: HttpClient) {
    }

    public getConfiguration(): Observable<Config> {
        return this.http.get<Config>(ConstantsService.URL_PREFIX + '/configurator');
    }

    public saveConfiguration(config: Config): Observable<PostResult> {
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/configurator', JSON.stringify(config));
    }

    public getValidatorBlueprints(): Observable<ValidatorBlueprint[]> {
        return this.http.get<ValidatorBlueprint[]>(ConstantsService.URL_PREFIX + '/validators');
    }

    public static getGroupSettings(group: string, config: Config): Setting[] {
        if (group && config && config.settings) {
            return config.settings.filter((setting: Setting) => {
                return setting.group === group;
            });
        }
        return [];
    }

    public static getSetting(name: string, config: Config): Setting {
        if (name && config && config.settings) {
            let trimmedList: Setting[] = config.settings.filter((setting: Setting) => {
                return setting.name === name;
            });
            if (trimmedList.length === 1) {
                return trimmedList[0];
            }
        }
        return null;
    }

    public static getSettingValue(name: string, config: Config): any {
        let setting: Setting = ConfiguratorService.getSetting(name, config);
        if (setting) {
            return setting.value;
        }
        return null;
    }

    public static setSettingValue(name: string, value: any, config: Config): void {
        let setting: Setting = ConfiguratorService.getSetting(name, config);
        if (setting) {
            setting.value = value;
        }
    }

    public getParameterTypes(): string[] {
        let types: string[] = [];
        types.push(this.TYPE_FLAG);
        types.push(this.TYPE_STRING);
        types.push(this.TYPE_INTEGER);
        types.push(this.TYPE_FLOAT);
        return types;
    }

}
