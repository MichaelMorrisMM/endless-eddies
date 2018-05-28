import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {PostResult} from "../configurator/post-result.interface";
import {ConstantsService} from "./constants.service";

@Injectable()
export class AuthService {
    private loggedIn = false;

    constructor(private http: HttpClient) {
    }

    public createUser(params: HttpParams): Observable<PostResult> {
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/register-user', null, {params: params});
    }

    public logIn() {
        this.loggedIn = true;
    }

    public logOut() {
        this.loggedIn = false;
    }

    public getLoggedIn() {
        return this.loggedIn;
    }

}
