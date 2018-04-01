import { Component, OnInit } from '@angular/core';
import {ConfiguratorService} from "../services/configurator.service";

@Component({
    selector: 'configurator-overview',
    templateUrl: './configurator-overview.component.html',
    styles: [`
    `]
})
export class ConfiguratorOverviewComponent implements OnInit {
    public config: any;

    constructor(private configuratorService: ConfiguratorService) {
    }

    ngOnInit() {
        this.config = {};
        this.config.settings = [];
        this.configuratorService.getConfiguration().subscribe((response: any) => {
            this.config = response;
        })
    }
}
