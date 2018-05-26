import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ParameterPlaceholder} from "./parameter-placeholder.model";
import {Parameter} from "./parameter.model";
import {Config} from "./config.interface";
import {PostResult} from "./post-result.interface";
import {MatDialog, MatDialogRef} from "@angular/material";
import {ValidatorsComponent} from "./validators.component";
import {ValidatorBlueprint} from "./validator-blueprint.interface";
import {OptionsComponent} from "./options.component";
import {ApplicationPickerComponent} from "./application-picker.component";
import {Application} from "./application.model";

@Component({
    selector: 'configurator-execution',
    templateUrl: './configurator-execution.component.html',
    styles: [`
    `]
})
export class ConfiguratorExecutionComponent implements OnInit {
    public config: Config;
    public parameterPlaceholders: ParameterPlaceholder[];
    public form: FormGroup;
    private counter: number;
    private validatorBlueprints: ValidatorBlueprint[];
    public application: Application;

    constructor(public configuratorService: ConfiguratorService,
                public constantsService: ConstantsService,
                private dialog: MatDialog) {
        this.form = new FormGroup({});
        this.counter = 1;
    }


    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
            this.showAppPicker();
        });

        this.configuratorService.getValidatorBlueprints().subscribe((response: ValidatorBlueprint[]) => {
            this.validatorBlueprints = response;
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
                    this.application = new Application("", [], "", []);
                    this.config.applications.push(this.application);
                } else if (result) {
                    this.application = result;
                } else {
                    this.application = null;
                    return;
                }
                this.form = new FormGroup({});
                this.counter = 1;
                this.form.addControl("command", new FormControl(this.application.command));
                this.form.addControl("applicationName", new FormControl(this.application.name));
                this.parameterPlaceholders = [];
                this.application.parameters.forEach((parameter: Parameter) => {
                    this.makeNewPlaceholder(parameter);
                });
            });
        }
    }

    public addParameter(): void {
        this.makeNewPlaceholder(null);
        this.form.markAsDirty();
    }

    private makeNewPlaceholder(param: Parameter): void {
        let placeholder: ParameterPlaceholder = new ParameterPlaceholder(this.counter);
        if (param) {
            this.form.addControl(placeholder.nameKey, new FormControl(param.name));
            this.form.addControl(placeholder.typeKey, new FormControl(param.type));
            this.form.addControl(placeholder.codeKey, new FormControl(param.code));
            this.form.addControl(placeholder.sortOrderKey, new FormControl(param.sortOrder));
            this.form.addControl(placeholder.toolTipKey, new FormControl(param.toolTip));
            placeholder.validators = param.validators;
            placeholder.selectOptions = param.selectOptions;
        } else {
            this.form.addControl(placeholder.nameKey, new FormControl(""));
            this.form.addControl(placeholder.typeKey, new FormControl(""));
            this.form.addControl(placeholder.codeKey, new FormControl(""));
            this.form.addControl(placeholder.sortOrderKey, new FormControl(this.counter));
            this.form.addControl(placeholder.toolTipKey, new FormControl(""));
        }
        this.counter = this.counter + 1;
        this.parameterPlaceholders.push(placeholder);
    }

    public deleteParameter(placeholder: ParameterPlaceholder): void {
        this.parameterPlaceholders.splice(this.parameterPlaceholders.indexOf(placeholder),1);
        this.form.removeControl(placeholder.nameKey);
        this.form.removeControl(placeholder.typeKey);
        this.form.removeControl(placeholder.codeKey);
        this.form.removeControl(placeholder.sortOrderKey);
        this.form.removeControl(placeholder.toolTipKey);
        this.form.markAsDirty();
    }

    public openValidatorsDialog(paramPlaceholder: ParameterPlaceholder) {
        let dialog: MatDialogRef<ValidatorsComponent> = this.dialog.open(ValidatorsComponent, {
            data: {
                paramPlaceholder: paramPlaceholder,
                name: this.form.controls[paramPlaceholder.nameKey].value,
                blueprints: this.validatorBlueprints,
                type: this.form.controls[paramPlaceholder.typeKey].value,
            }
        });

        dialog.afterClosed().subscribe((result: any) => {
            if (result) {
                this.form.markAsDirty();
            }
        });
    }

    public openOptionsDialog(paramPlaceholder: ParameterPlaceholder) {
        let dialog: MatDialogRef<OptionsComponent> = this.dialog.open(OptionsComponent, {
            data: {
                paramPlaceholder: paramPlaceholder,
                name: this.form.controls[paramPlaceholder.nameKey].value,
            }
        });

        dialog.afterClosed().subscribe((result: any) => {
            if (result) {
                this.form.markAsDirty();
            }
        });
    }

    public onTypeChange(paramPlaceholder: ParameterPlaceholder) {
        paramPlaceholder.validators = [];
        paramPlaceholder.selectOptions = [];
    }

    public save(): void {
        let newParams: Parameter[] = [];
        this.parameterPlaceholders.forEach((placeholder: ParameterPlaceholder) => {
            newParams.push(new Parameter(
                this.form.controls[placeholder.nameKey].value,
                this.form.controls[placeholder.typeKey].value,
                this.form.controls[placeholder.codeKey].value,
                this.form.controls[placeholder.sortOrderKey].value,
                this.form.controls[placeholder.toolTipKey].value,
                placeholder.validators,
                placeholder.selectOptions,
            ));
        });
        this.application.parameters = newParams;
        this.application.command = this.form.controls["command"].value;
        this.application.name = this.form.controls['applicationName'].value;

        this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
            if (response.success) {
                this.form.markAsPristine();
            }
        });
    }
}
