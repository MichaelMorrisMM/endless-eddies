import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConstantsService} from './constants.service';
import {PostResult} from "../configurator/post-result.interface";
import {Config} from "../configurator/config.interface";
import {ValidatorBlueprint} from "../configurator/validator-blueprint.interface";
import {AuthService} from "./auth.service";

@Injectable()
export class ConfiguratorService {

    public readonly TYPE_FLAG: string = "flag";
    public readonly TYPE_STRING: string = "string";
    public readonly TYPE_INTEGER: string = "integer";
    public readonly TYPE_FLOAT: string = "float";
    public readonly TYPE_SELECT: string = "select";
    public readonly TYPE_FILE: string = "file";
    public readonly TYPE_MULTI_SELECT: string = "multiselect";
    public readonly GROUP_USERS: string = "users";
    public readonly SETTING_ALLOW_GUEST_MODE: string = "allow_guest_mode";
    public readonly SETTING_ALLOW_GOOGLE_AUTH: string = "allow_google_auth";
    public readonly SETTING_ALLOW_GITHUB_AUTH: string = "allow_github_auth";
    public readonly SETTING_APP_THEME: string = "appTheme";

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

    public getConfiguration(): Observable<Config> {
        return this.http.get<Config>(ConstantsService.URL_PREFIX + '/configurator');
    }

    public saveConfiguration(config: Config): Observable<PostResult> {
        let headers: HttpHeaders = this.authService.setXSRFPayloadTokenHeader(new HttpHeaders());
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/configurator', JSON.stringify(config), {headers: headers});
    }

    public getValidatorBlueprints(): Observable<ValidatorBlueprint[]> {
        return this.http.get<ValidatorBlueprint[]>(ConstantsService.URL_PREFIX + '/validators');
    }

    public getParameterTypes(): string[] {
        let types: string[] = [];
        types.push(this.TYPE_FLAG);
        types.push(this.TYPE_STRING);
        types.push(this.TYPE_INTEGER);
        types.push(this.TYPE_FLOAT);
        types.push(this.TYPE_SELECT);
        types.push(this.TYPE_FILE);
        types.push(this.TYPE_MULTI_SELECT);
        return types;
    }

}
