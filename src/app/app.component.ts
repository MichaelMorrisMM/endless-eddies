import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {User} from "./login/user.interface";
import {ISubscription} from "rxjs/Subscription";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    public menuItemsArray: MenuItem[] = [];
    private onUserChangeSubscription: ISubscription;

    constructor(public authService: AuthService) {
    }

    ngOnInit() {
        this.onUserChangeSubscription = this.authService.onUserChange.subscribe((user: User) => {
            if (user) {
                this.menuItemsArray = [
                    {'title': 'Home', 'link': '/home', icon: './assets/icons/icons8-home-50.png'},
                    {'title': "Submit New Request", "link":"/new-request", icon: './assets/icons/icons8-upload-50.png'},
                    {'title': "Results", "link":"/all-results", icon: './assets/icons/icons8-database-50.png'},
                ];

                if (user.isAdmin) {
                    this.menuItemsArray.push(
                        {'title': "Manage Users", "link":"/manage-users", icon: './assets/icons/icons8-inspection-50.png'},
                        {'title': "Configurator - Overview", "link":"/config", icon: './assets/icons/icons8-settings-50.png'},
                        {'title': "Configurator - Users", "link":"/config-users", icon: './assets/icons/icons8-people-50.png'},
                        {'title': "Configurator - Execution", "link":"/config-execute", icon: './assets/icons/icons8-system-task-50.png'},
                        {'title': "Configurator - Results", "link":"/config-results", icon: './assets/icons/icons8-informatics-50.png'},
                    );
                }
            } else {
                this.menuItemsArray = [];
            }
        });
    }

    ngOnDestroy() {
        this.onUserChangeSubscription.unsubscribe();
    }

}

interface MenuItem {
    readonly title: string;
    readonly link: string;
    readonly icon: string;
}
