import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {FormControl, FormGroup} from "@angular/forms";
import {ParameterPlaceholder} from "./parameter-placeholder.model";
import {Parameter} from "./parameter.model";
import {Config} from "./config.interface";
import {PostResult} from "./post-result.interface";

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

    constructor(public configuratorService: ConfiguratorService,
                public constantsService: ConstantsService) {
        this.form = new FormGroup({});
        this.counter = 1;
    }


    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
            this.parameterPlaceholders = [];
            this.config.parameters.forEach((parameter: Parameter) => {
                this.makeNewPlaceholder(parameter);
            });
        });
    }

    public addParameter(): void {
        this.makeNewPlaceholder(null);
        this.form.markAsDirty();
    }

    private makeNewPlaceholder(param: Parameter): void {
        let placeholder: ParameterPlaceholder = new ParameterPlaceholder(this.counter);
        this.counter = this.counter + 1;
        if (param) {
            this.form.addControl(placeholder.nameKey, new FormControl(param.name));
            this.form.addControl(placeholder.typeKey, new FormControl(param.type));
        } else {
            this.form.addControl(placeholder.nameKey, new FormControl(""));
            this.form.addControl(placeholder.typeKey, new FormControl(""));
        }
        this.parameterPlaceholders.push(placeholder);
    }

    public deleteParameter(placeholder: ParameterPlaceholder): void {
        this.parameterPlaceholders.splice(this.parameterPlaceholders.indexOf(placeholder),1);
        this.form.removeControl(placeholder.nameKey);
        this.form.removeControl(placeholder.typeKey);
        this.form.markAsDirty();
    }

    public save(): void {
        let newParams: Parameter[] = [];
        this.parameterPlaceholders.forEach((placeholder: ParameterPlaceholder) => {
            newParams.push(new Parameter(
                this.form.controls[placeholder.nameKey].value,
                this.form.controls[placeholder.typeKey].value,
            ));
        });
        this.config.parameters = newParams;

        this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
            if (response.success) {
                this.form.markAsPristine();
            }
        });
    }
}
