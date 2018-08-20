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
import {Graph} from "./graph.model";

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
    private graphs: Graph[];

    constructor(public configuratorService: ConfiguratorService,
                public constantsService: ConstantsService,
                private dialog: MatDialog) {
    }


    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
            this.showAppPicker();
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
                    this.application.graphs.forEach((g: Graph) => {
                        this.makeNewGraph(g);
                    });
                }
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
        this.form.addControl(resultFile.keyFilename, new FormControl(resultFile.fileName, Validators.required));
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

    private makeNewGraph(g: Graph): void {
        let graph: Graph = new Graph(this.counterGraphs, g);
        this.counterGraphs = this.counterGraphs + 1;
        this.form.addControl(graph.keyName, new FormControl(graph.name));
        this.form.addControl(graph.keyType, new FormControl(graph.type, Validators.required));
        this.graphs.push(graph);
    }

    public deleteGraph(g: Graph): void {
        this.graphs.splice(this.graphs.indexOf(g),1);
        this.form.removeControl(g.keyName);
        this.form.removeControl(g.keyType);
        this.form.markAsDirty();
    }

    public save(): void {
        this.resultFiles.forEach((rf: ResultFile) => {
            rf.name = this.form.controls[rf.keyName].value;
            rf.fileName = this.form.controls[rf.keyFilename].value;
            rf.toolTip = this.form.controls[rf.keyTooltip].value;
        });
        this.application.resultFiles = this.resultFiles;

        this.graphs.forEach((g: Graph) => {
            g.name = this.form.controls[g.keyName].value;
            g.type = this.form.controls[g.keyType].value;
        });
        this.application.graphs = this.graphs;

        this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
            if (response.success) {
                this.form.markAsPristine();
            }
        });
    }
}
