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
    u: Number[];
    v: Number[];
    w: Number[];

    constructor(public configuratorService: ConfiguratorService,
                public resultsService: ResultsService) {
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
        });
        this.arr = [ 1, 3, 5, 1, -2, 4, 7, 8, 10, 3 , 4, 7, 11, 14, 15];

        let tempArr: any[] = this.resultsService.lastResult.message.split(' ').slice(13);

        tempArr = tempArr.map(x => Number(x));

        tempArr.forEach( (x, i) => {
            if (i % 3 === 0) {
                this.u.push(x);
            } else if (i % 3 === 1) {
                this.v.push(x);
            } else {
                this.w.push(x);
            }
        });
    }
}
