import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {PostResult} from "../configurator/post-result.interface";
import {ConstantsService} from "./constants.service";
import {Router} from "@angular/router";

@Injectable()
export class AuthService {
    private loggedIn = false;

    constructor(private http: HttpClient,
                private router: Router) {
    }

    public createUser(params: HttpParams): Observable<PostResult> {
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/register-user', null, {params: params});
    }

    public logIn(params: HttpParams): void {
        this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/login', null, {params: params}).subscribe((pr: PostResult) => {
            if (pr && pr.success) {
                this.loggedIn = true;
                this.router.navigateByUrl('/home');
            } else {
                alert(pr.message);
            }
        });
    }

    public logOut() {
        this.loggedIn = false;
    }

    public getLoggedIn() {
        return this.loggedIn;
    }

}
