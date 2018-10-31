import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConstantsService} from "./constants.service";
import {User} from "../login/user.interface";
import {PostResult} from "../configurator/post-result.interface";
import {AuthService} from "./auth.service";
import {CheckUserStorageResult} from "../requests/check-user-storage-result.interface";

@Injectable()
export class UsersService {

    public static readonly ACTION_DELETE: string = 'delete';
    public static readonly ACTION_MAKE_ADMIN: string = 'makeAdmin';
    public static readonly ACTION_MAKE_NORMAL: string = 'makeNormal';

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

    public getManageUsersList(): Observable<User[]> {
        return this.http.get<User[]>(ConstantsService.URL_PREFIX + '/manage-user-accounts');
    }

    public manageUsers(action: string, users: User[]): Observable<PostResult> {
        let idUsers: string = "";
        if (users && users.length > 0) {
            idUsers = users[0].idUser;
            for (let i = 1; i < users.length; i++) {
                idUsers += "," + users[i].idUser;
            }
        }
        let params: HttpParams = new HttpParams()
            .set("action", action)
            .set("idUsers", idUsers);
        params = this.authService.setXSRFPayloadToken(params);
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/manage-user-accounts', params.toString(), {headers: headers});
    }

    public checkUserStorageUsed(idUser?: string): Observable<CheckUserStorageResult> {
        let params: HttpParams = new HttpParams();
        if (idUser) {
            params = params.set("idUser", idUser);
        }
        return this.http.get<CheckUserStorageResult>(ConstantsService.URL_PREFIX + '/check-user-storage', {params: params});
    }

}
