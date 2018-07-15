import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {PostResult} from "../configurator/post-result.interface";
import {ConstantsService} from "./constants.service";
import {Router} from "@angular/router";
import {User} from "../login/user.interface";
import {map} from "rxjs/operators";

@Injectable()
export class AuthService {
    private currentUser: User;

    @Output() onLogIn: EventEmitter<User> = new EventEmitter<User>();
    @Output() onLogOut: EventEmitter<any> = new EventEmitter<any>();

    constructor(private http: HttpClient,
                private router: Router) {
    }

    public createUser(params: HttpParams): Observable<PostResult> {
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/register-user', null, {params: params});
    }

    public logIn(params: HttpParams): void {
        this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/login', null, {params: params}).subscribe((pr: PostResult) => {
            if (pr && pr.success && pr.user) {
                this.currentUser = pr.user;
                this.onLogIn.emit(this.currentUser);
                this.router.navigateByUrl('/home');
            } else {
                alert(pr.message);
            }
        });
    }

    public guestLogIn(): void {
        this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/guest-login', null).subscribe((pr: PostResult) => {
            if (pr && pr.success && pr.user) {
                this.currentUser = pr.user;
                this.onLogIn.emit(this.currentUser);
                this.router.navigateByUrl('/home');
            } else {
                alert(pr.message);
            }
        });
    }

    public logOut(): void {
        this.currentUser = null;
        this.onLogOut.emit(null);
    }

    public updateMyAccount(params: HttpParams): Observable<boolean> {
        params = this.setXSRFPayloadToken(params);
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/manage-my-account', null, {params: params}).pipe(map((result: PostResult) => {
            if (result && result.success && result.user) {
                let xsrfToken: string = this.currentUser.xsrfToken;
                this.currentUser = result.user;
                this.currentUser.xsrfToken = xsrfToken;
                return true;
            } else {
                alert(result.message);
                return false;
            }
        }));
    }

    public deleteAccount(params: HttpParams): Observable<boolean> {
        params = this.setXSRFPayloadToken(params);
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/delete-account', null, {params: params}).pipe(map((result: PostResult) => {
            if (result && result.success) {
                return true;
            } else {
                alert(result.message);
                return false;
            }
        }));
    }

    public getCurrentUser(): User {
        return this.currentUser;
    }

    public setXSRFPayloadToken(params: HttpParams): HttpParams {
        return params.set(ConstantsService.XSRF_TOKEN, this.currentUser ? this.currentUser.xsrfToken : "");
    }

}
