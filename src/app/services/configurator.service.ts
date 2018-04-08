import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConstantsService} from './constants.service';

@Injectable()
export class ConfiguratorService {

    public readonly SETTING_ALLOW_GUEST_MODE: string = "allow_guest_mode";
    public readonly SETTING_ALLOW_GOOGLE_AUTH: string = "allow_google_auth";
    public readonly SETTING_ALLOW_GITHUB_AUTH: string = "allow_github_auth";

    constructor(private http: HttpClient) {
    }

    public getConfiguration(): Observable<Config> {
        return this.http.get<Config>(ConstantsService.URL_PREFIX + '/configurator');
    }

    /*
    public saveConfiguration(): Observable<any> {
        return this.http.post(ConstantsService.URL_PREFIX + '/configurator');
    }
    */

}
