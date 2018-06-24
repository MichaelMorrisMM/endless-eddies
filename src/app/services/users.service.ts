import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConstantsService} from "./constants.service";
import {User} from "../login/user.interface";
import {PostResult} from "../configurator/post-result.interface";
import {AuthService} from "./auth.service";

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

        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/manage-user-accounts', null, {params: params});
    }

}
