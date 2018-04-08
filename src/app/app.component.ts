import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    public title = 'endless eddies';

    constructor(private router:Router) {
    }

    public menuItemsArray: any[] = [
        {"title":"Home", "link":"/"},
        {"title":"Requests", "link":"/requests"},
        {"title":"Results", "link":"/results"},
        {"title":"Configurator",
            "subItems":[
                {"title":"Overview", "link":"/config"},
                {"title":"Users", "link":"/config-users"},
            ]
        },
    ];

    public onMenuClose() {
    }

    public onMenuOpen() {
    }

    private onItemSelect(item:any) {
        this.router.navigateByUrl(item.link);
    }

}
