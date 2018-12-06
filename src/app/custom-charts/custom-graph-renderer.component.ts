import {Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import {GraphTemplate} from "../configurator/graph-template.model";
import {ConstantsService} from "../services/constants.service";

declare var Highcharts: any;

@Component({
    selector: 'custom-graph-renderer',
    templateUrl: './custom-graph-renderer.component.html',
    styles: [`
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
                options = {
                    chart: {
                        renderTo: 'container',
                        type: 'column',
                        options3d: {
                            enabled: true,
                            alpha: 15,
                            beta: 15,
                            depth: 50,
                            viewDistance: 25
                        }
                    },
                    colors: this.constantsService.getGraphColorScheme(this.graph.colorScheme).domain,
                    title: {
                        text: this.graph.name
                    },
                    yAxis: {
                        min: null,
                        max: null,
                    },
                    plotOptions: {
                        column: {
                            depth: 25
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
                    colors: this.constantsService.getGraphColorScheme(this.graph.colorScheme).domain,
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
                options = {
                    chart: {
                        renderTo: 'container',
                        margin: 100,
                        type: 'scatter3d',
                        animation: false,
                        options3d: {
                            enabled: true,
                            alpha: 10,
                            beta: 30,
                            depth: 250,
                            viewDistance: 5,
                            fitToPlot: false,
                            frame: {
                                bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                                back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                                side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                            }
                        }
                    },
                    colors: this.constantsService.getGraphColorScheme(this.graph.colorScheme).domain,
                    title: {
                        text: this.graph.name
                    },
                    plotOptions: {
                        scatter: {
                            width: 10,
                            height: 10,
                            depth: 10
                        }
                    },
                    yAxis: {
                        min: null,
                        max: null,
                    },
                    xAxis: {
                        min: null,
                        max: null,
                        gridLineWidth: 1,
                    },
                    zAxis: {
                        min: null,
                        max: null,
                        showFirstLabel: false
                    },
                    legend: {
                        enabled: false
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
            }
            this.highchart = Highcharts.chart(this.highchartContainer.nativeElement, options);
        }
    }

}
