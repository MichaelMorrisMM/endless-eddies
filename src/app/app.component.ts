import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public menuItemsArray: any[] = [];

    constructor() {
    }

    ngOnInit() {
        this.menuItemsArray = [
            {"title":"Home", "link":"/"},
            {"title":"Submit New Request", "link":"/new-request"},
            {"title":"Requests", "link":"/requests"},
            {"title":"Results", "link":"/results"},
            {"title":"Configurator - Overview", "link":"/config"},
            {"title":"Configurator - Users", "link":"/config-users"},
            {"title":"Configurator - Execution", "link":"/config-execute"},
        ];
    }

}
