import {Component, OnInit, Input} from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';

@Component({
    selector: 'app-histogram',
    templateUrl: './histogram.component.html',
    styles: []
})

export class HistogramComponent implements OnInit {

    @Input() inputData: number[];
    // @Input() numRanges: number;
    dataArray: any[] = [];
    view: any[] = [700, 400];
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Value';
    showYAxisLabel = true;
    yAxisLabel = 'Frequency';
    colorScheme = {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    onSelect(event) {
        console.log(event);
    }

    constructor() {
    }

    ngOnInit() {
        const tempObj = {};
        this.inputData.forEach( x => {
            if (tempObj['' + x] === 1 || tempObj['' + x] >= 1) {
                tempObj['' + x] += 1;
            } else {
                tempObj['' + x] = 1;
            }
        });
        const objKeys = Object.keys(tempObj);
        objKeys.forEach(k => {
            this.dataArray.push({
                name: k,
                value: tempObj[k],
            });
        });
    }
}
