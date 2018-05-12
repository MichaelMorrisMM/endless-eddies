import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {Config} from '../configurator/config.interface';
import {ResultsService} from '../services/results.service';
import {ResultFile} from "../configurator/result-file.model";
import {saveAs} from "../../../node_modules/file-saver";

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styles: []
})

export class ResultsComponent implements OnInit {
    public config: Config;
    u: Number[];
    v: Number[];
    w: Number[];
    isGraphShowing = false;

    constructor(public configuratorService: ConfiguratorService,
                public resultsService: ResultsService) {
    }

    toggleGraph() {
        this.isGraphShowing = !(this.isGraphShowing);
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
        });
        this.u = [];
        this.v = [];
        this.w = [];

        const tempArr: any[] = this.resultsService
                                   .lastResult
                                   .message
                                   .replace('\r\n', ' ')
                                   .replace('\n', ' ')
                                   .split(' ')
                                   .filter(x => x !== '')
                                   .map(x => Number(x))
                                   .map(x => Math.round(x * 100) / 100)
                                   .filter(x => !isNaN(x));

        //console.log(tempArr);
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

    public downloadFile(rf: ResultFile): void {
        this.resultsService.downloadFile(this.resultsService.lastResult.requestName, rf).subscribe((blob: Blob) => {
            saveAs(blob, rf.fileName);
        });
    }
}
