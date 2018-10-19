import {Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {GraphTemplate} from "../configurator/graph-template.model";
import {ConstantsService} from "../services/constants.service";

declare var Highcharts: any;

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

export class CustomGraphRendererComponent implements OnInit, AfterViewInit {

    @ViewChild("highchartContainer") highchartContainer: ElementRef;

    @Input() graph: GraphTemplate;
    @Input() data: any[];

    public isHighchart: boolean = false;
    private highchart: any;

    constructor(public constantsService: ConstantsService) {
    }

    ngOnInit() {
        this.isHighchart =
            this.graph.type === this.constantsService.GRAPH_3D_COLUMN
            || this.graph.type === this.constantsService.GRAPH_3D_PIE
            || this.graph.type === this.constantsService.GRAPH_3D_SCATTER;
    }

    ngAfterViewInit() {
        if (this.isHighchart) {
            let options: any = {};
            if (this.graph.type === this.constantsService.GRAPH_3D_COLUMN) {
                // TODO
            } else if (this.graph.type === this.constantsService.GRAPH_3D_PIE) {
                options = {
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        }
                    },
                    title: {
                        text: this.graph.name
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            depth: 35,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}'
                            }
                        }
                    },
                    series: this.data,
                    responsive: {
                        rules: [{
                            condition: {
                                maxHeight: 300
                            }
                        }]
                    }
                };
            } else if (this.graph.type === this.constantsService.GRAPH_3D_SCATTER) {
                // TODO
            }
            this.highchart = Highcharts.chart(this.highchartContainer.nativeElement, options);
        }
    }

}
