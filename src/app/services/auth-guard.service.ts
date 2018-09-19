import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";
import {map} from "rxjs/operators";

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        if (this.authService.getCurrentUser()) {
            return true;
        } else {
            return this.authService.checkUserSession().pipe(map(() => {
                return !!this.authService.getCurrentUser();
            }));
        }
    }

}
