import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {Config} from "../configurator/config.interface";
import {Parameter} from "../configurator/parameter.model";
import {ResultsService} from "../services/results.service";
import {Router} from "@angular/router";
import {Validator} from "../configurator/validator.model";
import {Application} from "../configurator/application.model";
import {ApplicationPickerComponent} from "../configurator/application-picker.component";
import {MatDialog, MatDialogRef} from "@angular/material";
import {PostResult} from "../configurator/post-result.interface";

@Component({
    selector: 'new-request',
    templateUrl: './new-request.component.html',
    styles: [`
    `]
})
export class NewRequestComponent implements OnInit {
    public config: Config;
    public application: Application;
    public form: FormGroup;

    constructor(public configuratorService: ConfiguratorService,
                public constantsService: ConstantsService,
                private resultsService: ResultsService,
                private router: Router,
                private dialog: MatDialog) {
        this.form = new FormGroup({});
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

            dialog.afterClosed().subscribe((result) => {
                if (result) {
                    this.application = result;
                } else {
                    this.application = null;
                    return;
                }
                this.form = new FormGroup({});
                this.application.parameters.forEach((param: Parameter) => {
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
                                validatorArray.push(Validators.min(parseFloat(validator.value)));
                            } else if (validator.validatorType === ConstantsService.VALIDATOR_TYPE_MAX) {
                                validatorArray.push(Validators.max(parseFloat(validator.value)));
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
    }

    public submit(): void {
        let request: any = {};
        request.targetApplication = this.application.name;
        this.application.parameters.forEach((param: Parameter) => {
            request[param.name] = this.form.controls[param.name].value;
        });

        this.resultsService.submitRequest(this.application, request).subscribe((result: PostResult) => {
            if (result.success && result.message) {
                this.router.navigate(['/loading', result.message]);
            } else {
                alert(result.message);
            }
        });
    }
}
