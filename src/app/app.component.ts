import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    public title: string = 'endless eddies';
    public menuConfig: any;

    constructor(private router:Router) {
    }

    ngOnInit() {
        this.menuConfig = {
            closeOnCLick: true,
        };
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
