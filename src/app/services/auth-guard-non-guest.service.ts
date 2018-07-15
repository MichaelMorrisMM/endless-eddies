import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";
import {User} from "../login/user.interface";

@Injectable()
export class AuthGuardNonGuestService implements CanActivate {

    constructor(private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        let user: User = this.authService.getCurrentUser();
        return user && !user.isGuest;
    }

}
