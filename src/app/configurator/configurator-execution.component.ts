import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'configurator-execution',
    templateUrl: './configurator-execution.component.html',
    styles: [`
    `]
})
export class ConfiguratorExecutionComponent implements OnInit {
    public config: Config;
    public parametersArray: ParameterTemp[];
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
            this.parametersArray = [];
            this.config.parameters.forEach((parameter: Parameter) => {
                let temp = new ParameterTempObject();
                temp.nameKey = this.counter + "name";
                temp.defaultValueKey = this.counter + "def";
                temp.typeKey = this.counter + "type";
                this.counter = this.counter + 1;
                this.form.addControl(temp.nameKey, new FormControl(parameter.name));
                this.form.addControl(temp.defaultValueKey, new FormControl(parameter.defaultValue));
                this.form.addControl(temp.typeKey, new FormControl(parameter.type));
                this.parametersArray.push(temp);
            });
        });
    }

    public addParameter(): void {
        let temp = new ParameterTempObject();
        temp.nameKey = this.counter + "name";
        temp.defaultValueKey = this.counter + "def";
        temp.typeKey = this.counter + "type";
        this.counter = this.counter + 1;
        this.form.addControl(temp.nameKey, new FormControl(""));
        this.form.addControl(temp.defaultValueKey, new FormControl(""));
        this.form.addControl(temp.typeKey, new FormControl(""));
        this.parametersArray.push(temp);

        this.form.markAsDirty();
    }

    public deleteParameter(param: ParameterTemp): void {
        this.parametersArray.splice(this.parametersArray.indexOf(param),1);
        this.form.removeControl(param.nameKey);
        this.form.removeControl(param.defaultValueKey);
        this.form.removeControl(param.typeKey);
        this.form.markAsDirty();
    }

    public save(): void {
        let newParams: Parameter[] = [];
        this.parametersArray.forEach((tempParam: ParameterTemp) => {
            newParams.push(new ParameterObject(
                this.form.controls[tempParam.nameKey].value,
                this.form.controls[tempParam.defaultValueKey].value,
                this.form.controls[tempParam.typeKey].value,
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

class ParameterObject implements Parameter {
    readonly name: string;
    readonly defaultValue: any;
    readonly type: string;

    constructor(n: string, defVal: any, t: string) {
        this.name = n;
        this.defaultValue = defVal;
        this.type = t;
    }
}

class ParameterTempObject implements ParameterTemp {
    nameKey: string;
    defaultValueKey: any;
    typeKey: string;

    constructor() {
    }
}
