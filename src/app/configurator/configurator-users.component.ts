import { Component, OnInit } from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';

@Component({
    selector: 'configurator-users',
    templateUrl: './configurator-users.component.html',
    styles: [`
    `]
})
export class ConfiguratorUsersComponent implements OnInit {
    public config: Config;

    constructor(private configuratorService: ConfiguratorService) {
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
        });
    }
}
