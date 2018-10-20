import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Config} from "./config.interface";
import {PostResult} from "./post-result.interface";
import {MatDialog, MatDialogRef} from "@angular/material";
import {ApplicationPickerComponent} from "./application-picker.component";
import {Application} from "./application.model";
import {ResultFile} from "./result-file.model";
import {GraphTemplate} from "./graph-template.model";
import {ThemesService} from "../services/themes.service";

@Component({
    selector: 'configurator-results',
    templateUrl: './configurator-results.component.html',
    styles: [`
    `]
})
export class ConfiguratorResultsComponent implements OnInit {
    public config: Config;
    public application: Application;
    public form: FormGroup;

    private counterResultFiles: number;
    private resultFiles: ResultFile[];

    private counterGraphs: number;
    private graphs: GraphTemplate[];

    constructor(public configuratorService: ConfiguratorService,
                public constantsService: ConstantsService,
                private dialog: MatDialog,
                public themesService: ThemesService) {
    }


    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
            if(this.config.applications.length > 1) { // If there is more than one app, show the dialog
                this.showAppPicker();
            } else { // Otherwise, choose the only app by default
                this.application = this.config.applications[0];
                this.setUpForm();
            }
        });
    }

    public showAppPicker(): void {
        if (this.config) {
            let dialog: MatDialogRef<ApplicationPickerComponent> = this.dialog.open(ApplicationPickerComponent, {
                data: {
                    config: this.config,
                    showAdder: false,
                }
            });

            dialog.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.application = result;
                } else {
                    this.application = null;
                    return;
                }

                this.setUpForm();
            });
        }
    }

    public setUpForm(): void {
        this.form = new FormGroup({});

        this.counterResultFiles = 1;
        this.resultFiles = [];
        if (this.application.resultFiles) {
            this.application.resultFiles.forEach((rf: ResultFile) => {
                this.makeNewResultFile(rf);
            });
        }

        this.counterGraphs = 1;
        this.graphs = [];
        if (this.application.graphs) {
            this.application.graphs.forEach((g: GraphTemplate) => {
                this.makeNewGraph(g);
            });
        }
    }

    public addResultFile(): void {
        this.makeNewResultFile(null);
        this.form.markAsDirty();
    }

    private makeNewResultFile(rf: ResultFile): void {
        let resultFile: ResultFile = new ResultFile(this.counterResultFiles, rf);
        this.counterResultFiles = this.counterResultFiles + 1;
        this.form.addControl(resultFile.keyName, new FormControl(resultFile.name));
        this.form.addControl(resultFile.keyFilename, new FormControl(resultFile.filename, Validators.required));
        this.form.addControl(resultFile.keyTooltip, new FormControl(resultFile.toolTip));
        this.resultFiles.push(resultFile);
    }

    public deleteResultFile(rf: ResultFile): void {
        this.resultFiles.splice(this.resultFiles.indexOf(rf),1);
        this.form.removeControl(rf.keyName);
        this.form.removeControl(rf.keyFilename);
        this.form.removeControl(rf.keyTooltip);
        this.form.markAsDirty();
    }

    public addGraph(): void {
        this.makeNewGraph(null);
        this.form.markAsDirty();
    }

    private makeNewGraph(g: GraphTemplate): void {
        let graph: GraphTemplate = new GraphTemplate(this.counterGraphs, g);
        if (!g) {
            graph.colorScheme = this.constantsService.GRAPH_COLOR_SCHEMES[0].name;
        }
        this.counterGraphs = this.counterGraphs + 1;
        this.form.addControl(graph.keyName, new FormControl(graph.name));
        this.form.addControl(graph.keyType, new FormControl(graph.type, Validators.required));
        this.form.addControl(graph.keyFilename, new FormControl(graph.filename, Validators.required));
        this.form.addControl(graph.keyXAxisLabel, new FormControl(graph.xAxisLabel));
        this.form.addControl(graph.keyYAxisLabel, new FormControl(graph.yAxisLabel));
        this.form.addControl(graph.keyColorScheme, new FormControl(graph.colorScheme));
        this.graphs.push(graph);

        this.onGraphTypeChange(graph);
    }

    public deleteGraph(g: GraphTemplate): void {
        this.graphs.splice(this.graphs.indexOf(g),1);
        this.form.removeControl(g.keyName);
        this.form.removeControl(g.keyType);
        this.form.removeControl(g.keyFilename);
        this.form.removeControl(g.keyXAxisLabel);
        this.form.removeControl(g.keyYAxisLabel);
        this.form.removeControl(g.keyColorScheme);
        this.form.markAsDirty();
    }

    public onGraphTypeChange(g: GraphTemplate): void {
        let type = this.form.controls[g.keyType].value;
        if (type === this.constantsService.GRAPH_PIE || type === this.constantsService.GRAPH_3D_COLUMN || type === this.constantsService.GRAPH_3D_PIE || type === this.constantsService.GRAPH_3D_SCATTER) {
            this.form.controls[g.keyXAxisLabel].setValue('');
            this.form.controls[g.keyXAxisLabel].disable();
            this.form.controls[g.keyYAxisLabel].setValue('');
            this.form.controls[g.keyYAxisLabel].disable();
        } else {
            this.form.controls[g.keyXAxisLabel].enable();
            this.form.controls[g.keyYAxisLabel].enable();
        }
    }

    public showDataSourceInfo(g: GraphTemplate): void {
        alert(this.constantsService.getGraphDataSourceTooltip(this.form.controls[g.keyType].value));
    }

    public save(): void {
        this.resultFiles.forEach((rf: ResultFile) => {
            rf.name = this.form.controls[rf.keyName].value;
            rf.filename = this.form.controls[rf.keyFilename].value;
            rf.toolTip = this.form.controls[rf.keyTooltip].value;
        });
        this.application.resultFiles = this.resultFiles;

        this.graphs.forEach((g: GraphTemplate) => {
            g.name = this.form.controls[g.keyName].value;
            g.type = this.form.controls[g.keyType].value;
            g.filename = this.form.controls[g.keyFilename].value;
            g.xAxisLabel = this.form.controls[g.keyXAxisLabel].value;
            g.yAxisLabel = this.form.controls[g.keyYAxisLabel].value;
            g.colorScheme = this.form.controls[g.keyColorScheme].value;
        });
        this.application.graphs = this.graphs;

        this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
            if (response.success) {
                this.form.markAsPristine();
            }
        });
    }
}
