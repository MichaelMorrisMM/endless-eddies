import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {Config} from "../configurator/config.interface";
import {ResultsService} from "../services/results.service";

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styles: []
})

export class ResultsComponent implements OnInit {
    public config: Config;
    arr: Number[];

    constructor(public configuratorService: ConfiguratorService,
                public resultsService: ResultsService) {
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
        });
        this.arr = [ 1, 3, 5, 1, -2, 4, 7, 8, 10, 3 , 4, 7, 11, 14, 15];
    }
}
