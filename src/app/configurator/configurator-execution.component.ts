import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Parameter} from "./parameter.model";
import {Config} from "./config.interface";
import {PostResult} from "./post-result.interface";
import {MatDialog, MatDialogRef} from "@angular/material";
import {ValidatorsComponent} from "./validators.component";
import {ValidatorBlueprint} from "./validator-blueprint.interface";
import {OptionsComponent} from "./options.component";
import {ApplicationPickerComponent} from "./application-picker.component";
import {Application} from "./application.model";
import { DeleteApplicationDialogComponent } from './delete-application-dialog.component';
import {CommandGroup} from "./command-group.model";

@Component({
    selector: 'configurator-execution',
    templateUrl: './configurator-execution.component.html',
    styles: [`
    `]
})
export class ConfiguratorExecutionComponent implements OnInit {
    public config: Config;
    public application: Application;
    public form: FormGroup;
    private validatorBlueprints: ValidatorBlueprint[];

    private counterCommandGroups: number;
    private commandGroups: CommandGroup[];

    private counterParameters: number;

    constructor(public configuratorService: ConfiguratorService,
                public constantsService: ConstantsService,
                private dialog: MatDialog) {
    }


    ngOnInit() {
        this.configuratorService.getValidatorBlueprints().subscribe((response: ValidatorBlueprint[]) => {
            this.validatorBlueprints = response;
        });

        this.refresh();
    }

    private refresh(): void {
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
                    showAdder: true,
                }
            });

            dialog.afterClosed().subscribe((result: any) => {
                if (result === "new") {
                    this.application = new Application("", [], [], []);
                    this.config.applications.push(this.application);
                } else if (result) {
                    this.application = result;
                } else {
                    this.application = null;
                    return;
                }
                this.setUpForm();
            });
        }
    }

    private setUpForm(): void {
        this.form = new FormGroup({});
        this.form.addControl("applicationName", new FormControl((this.application && this.application.name) ? this.application.name : '', Validators.required));

        this.counterParameters = 1;

        this.counterCommandGroups = 1;
        this.commandGroups = [];
        if (this.application && this.application.commandGroups) {
            for (let commandGroup of this.application.commandGroups) {
                this.makeNewCommandGroup(commandGroup);
            }
        }
    }

    public addCommandGroup(): void {
        this.makeNewCommandGroup(null);
        this.form.markAsDirty();
    }

    private makeNewCommandGroup(cg: CommandGroup): void {
        let commandGroup: CommandGroup = new CommandGroup(this.counterCommandGroups, cg);
        this.counterCommandGroups = this.counterCommandGroups + 1;
        this.form.addControl(commandGroup.keyCommand, new FormControl(commandGroup.command, Validators.required));

        let tempParamArray = commandGroup.parameters;
        commandGroup.parameters = []; // Parameters will be added back as form is built
        for (let param of tempParamArray) {
            this.makeNewParameter(param, commandGroup);
        }

        this.commandGroups.push(commandGroup);
    }

    public deleteCommandGroup(cg: CommandGroup): void {
        this.commandGroups.splice(this.commandGroups.indexOf(cg),1);
        this.form.removeControl(cg.keyCommand);
        this.form.markAsDirty();
    }

    public addParameter(group: CommandGroup): void {
        this.makeNewParameter(null, group);
        this.form.markAsDirty();
    }

    private makeNewParameter(p: Parameter, group: CommandGroup): void {
        let param: Parameter = new Parameter(this.counterParameters, p);
        this.counterParameters = this.counterParameters + 1;
        this.form.addControl(param.keyName, new FormControl(param.name, Validators.required));
        this.form.addControl(param.keyType, new FormControl(param.type, Validators.required));
        this.form.addControl(param.keyCode, new FormControl(param.code));
        this.form.addControl(param.keySortOrder, new FormControl(param.sortOrder));
        this.form.addControl(param.keyToolTip, new FormControl(param.toolTip));
        group.parameters.push(param);
    }

    public deleteParameter(p: Parameter, group: CommandGroup): void {
        group.parameters.splice(group.parameters.indexOf(p),1);
        this.form.removeControl(p.keyName);
        this.form.removeControl(p.keyType);
        this.form.removeControl(p.keyCode);
        this.form.removeControl(p.keySortOrder);
        this.form.removeControl(p.keyToolTip);
        this.form.markAsDirty();
    }

    public openValidatorsDialog(param: Parameter) {
        let dialog: MatDialogRef<ValidatorsComponent> = this.dialog.open(ValidatorsComponent, {
            data: {
                parameter: param,
                name: this.form.controls[param.keyName].value,
                blueprints: this.validatorBlueprints,
                type: this.form.controls[param.keyType].value,
            }
        });
        dialog.afterClosed().subscribe((result: any) => {
            if (result) {
                this.form.markAsDirty();
            }
        });
    }

    public openOptionsDialog(param: Parameter) {
        let dialog: MatDialogRef<OptionsComponent> = this.dialog.open(OptionsComponent, {
            data: {
                parameter: param,
                name: this.form.controls[param.keyName].value,
            }
        });
        dialog.afterClosed().subscribe((result: any) => {
            if (result) {
                this.form.markAsDirty();
            }
        });
    }

    public onTypeChange(param: Parameter) {
        param.validators = [];
        param.selectOptions = [];
        this.form.markAsDirty();
    }

    public save(): void {
        for (let group of this.commandGroups) {
            group.command = this.form.controls[group.keyCommand].value;
            for (let param of group.parameters) {
                param.name = this.form.controls[param.keyName].value;
                param.type = this.form.controls[param.keyType].value;
                param.code = this.form.controls[param.keyCode].value;
                param.sortOrder = this.form.controls[param.keySortOrder].value;
                param.toolTip = this.form.controls[param.keyToolTip].value;
            }
        }

        this.application.name = this.form.controls['applicationName'].value;
        this.application.commandGroups = this.commandGroups;
        this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
            if (response.success) {
                this.form.markAsPristine();
                this.refresh();
            }
        });
    }

    public deleteApplication(): void {
        let dialog: MatDialogRef<DeleteApplicationDialogComponent> = this.dialog.open(DeleteApplicationDialogComponent);

        dialog.afterClosed().subscribe((result: any) => {
            if (result === "delete") {
                let index: number = this.config.applications.indexOf(this.application);
                this.config.applications.splice(index, 1);
                this.application = null;

                this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
                    if (response.success) {
                        this.refresh();
                    }
                });
            }
        });
    }
}
