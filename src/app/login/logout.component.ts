import {Component, OnInit} from "@angular/core";
import {AuthService} from "../services/auth.service";

@Component({
    selector: 'logout',
    template: `
        <div></div>
    `,
    styles: [`
    `]
})
export class LogoutComponent implements OnInit {

    constructor(private authService: AuthService) {
    }

    ngOnInit() {
        this.authService.logOut();
    }

}
