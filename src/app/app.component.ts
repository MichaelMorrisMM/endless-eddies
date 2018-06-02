import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public menuItemsArray: MenuItem[] = [];

    constructor(public authService: AuthService,
                private router: Router) {
    }

    ngOnInit() {
        this.menuItemsArray = [
            {'title': 'Home', 'link': '/home', icon: './assets/icons/icons8-home-50.png'},
            {'title': "Submit New Request", "link":"/new-request", icon: './assets/icons/icons8-upload-50.png'},
            {'title': "Results", "link":"/results", icon: './assets/icons/icons8-database-50.png'},
            {'title': "Configurator - Overview", "link":"/config", icon: './assets/icons/icons8-settings-50.png'},
            {'title': "Configurator - Users", "link":"/config-users", icon: './assets/icons/icons8-people-50.png'},
            {'title': "Configurator - Execution", "link":"/config-execute", icon: './assets/icons/icons8-system-task-50.png'},
            {'title': "Configurator - Results", "link":"/config-results", icon: './assets/icons/icons8-informatics-50.png'},
        ];

        this.router.navigateByUrl('/sign-in');
    }

}

interface MenuItem {
    readonly title: string;
    readonly link: string;
    readonly icon: string;
}
