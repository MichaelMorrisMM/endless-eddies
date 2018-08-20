import {Component, OnInit, Input} from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {Graph} from "../configurator/graph.model";

@Component({
    selector: 'custom-graph-renderer',
    templateUrl: './custom-graph-renderer.component.html',
    styles: []
})

export class CustomGraphRendererComponent implements OnInit {

    @Input() graph: Graph;

    constructor() {
    }

    ngOnInit() {
    }
}
