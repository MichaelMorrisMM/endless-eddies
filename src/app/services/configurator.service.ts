import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {ConstantsService} from "./constants.service";

@Injectable()
export class ConfiguratorService {

    constructor(private http: HttpClient) {
    }

    public getConfiguration(): Observable<Config> {
        return this.http.get<Config>(ConstantsService.URL_PREFIX + "/configurator");
    }


}