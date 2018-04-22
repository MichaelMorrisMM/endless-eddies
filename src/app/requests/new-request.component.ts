import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {Config} from "../configurator/config.interface";
import {Parameter} from "../configurator/parameter.model";
import {ResultsService} from "../services/results.service";
import {Router} from "@angular/router";
import {Validator} from "../configurator/validator.model";

@Component({
    selector: 'new-request',
    templateUrl: './new-request.component.html',
    styles: [`
    `]
})
export class NewRequestComponent implements OnInit {
    public config: Config;
    public form: FormGroup;

    constructor(public configuratorService: ConfiguratorService,
                public constantsService: ConstantsService,
                private resultsService: ResultsService,
                private router: Router) {
        this.form = new FormGroup({});
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
            this.config.parameters.forEach((param: Parameter) => {
                this.form.addControl(param.name, new FormControl());
                if (param.validators.length > 0) {
                    let validatorArray: ValidatorFn[] = [];
                    param.validators.forEach((validator: Validator) => {
                        if (validator.validatorType === ConstantsService.VALIDATOR_TYPE_REQUIRED) {
                            if (param.type === this.configuratorService.TYPE_FLAG) {
                                validatorArray.push(Validators.requiredTrue);
                            } else {
                                validatorArray.push(Validators.required);
                            }
                        } else if (validator.validatorType === ConstantsService.VALIDATOR_TYPE_MIN) {
                            validatorArray.push(Validators.min(parseInt(validator.value)));
                        } else if (validator.validatorType === ConstantsService.VALIDATOR_TYPE_MAX) {
                            validatorArray.push(Validators.max(parseInt(validator.value)));
                        } else if (validator.validatorType === ConstantsService.VALIDATOR_TYPE_MIN_LENGTH) {
                            validatorArray.push(Validators.minLength(parseInt(validator.value)));
                        } else if (validator.validatorType === ConstantsService.VALIDATOR_TYPE_MAX_LENGTH) {
                            validatorArray.push(Validators.maxLength(parseInt(validator.value)));
                        }
                    });
                    this.form.controls[param.name].setValidators(validatorArray);
                }
            });
            Object.keys(this.form.controls).forEach(key => {
                this.form.get(key).markAsTouched();
            });
        });
    }

    public submit(): void {
        let request: any = {};
        this.config.parameters.forEach((param: Parameter) => {
            request[param.name] = this.form.controls[param.name].value;
        });

        this.resultsService.submitRequest(request).subscribe(() => {
            this.router.navigateByUrl("/results");
        });
    }
}
