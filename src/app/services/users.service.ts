import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConstantsService} from "./constants.service";
import {User} from "../login/user.interface";

@Injectable()
export class UsersService {

    constructor(private http: HttpClient) {
    }

    public getManageUsersList(): Observable<User[]> {
        return this.http.get<User[]>(ConstantsService.URL_PREFIX + '/manage-user-accounts');
    }

}
