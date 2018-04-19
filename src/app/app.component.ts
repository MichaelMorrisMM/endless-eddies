import {Component, OnInit} from '@angular/core';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public menuItemsArray: any[] = [];

    constructor(public authService: AuthService) {
    }

    ngOnInit() {
        this.menuItemsArray = [
            {'title': 'Home', 'link': '/home'},
            {'title': "Submit New Request", "link":"/new-request"},
            {'title': "Requests", "link":"/requests"},
            {'title': "Results", "link":"/results"},
            {'title': "Configurator - Overview", "link":"/config"},
            {'title': "Configurator - Users", "link":"/config-users"},
            {'title': "Configurator - Execution", "link":"/config-execute"},
        ];
    }

}
