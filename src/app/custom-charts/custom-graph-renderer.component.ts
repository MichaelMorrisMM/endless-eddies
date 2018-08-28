import {Component, OnInit, Input} from '@angular/core';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {GraphTemplate} from "../configurator/graph-template.model";
import {ConstantsService} from "../services/constants.service";

@Component({
    selector: 'custom-graph-renderer',
    templateUrl: './custom-graph-renderer.component.html',
    styles: [`
        div.graph-div {
            width: 50%;
            height: 300px;
        }
    `]
})

export class CustomGraphRendererComponent implements OnInit {

    @Input() graph: GraphTemplate;
    @Input() data: any[];

    constructor(public constantsService: ConstantsService) {
    }

    ngOnInit() {
    }
}
