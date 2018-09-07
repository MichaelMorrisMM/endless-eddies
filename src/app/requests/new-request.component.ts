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
import {UsersService} from "../services/users.service";
import {CheckUserStorageResult} from "./check-user-storage-result.interface";

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
                private usersService: UsersService,
                private router: Router,
                private dialog: MatDialog) {
        this.form = new FormGroup({});
    }

    ngOnInit() {
        this.usersService.checkUserStorageUsed().subscribe((result: CheckUserStorageResult) => {
            if (result.limitExceeded) {
                alert("Storage limit exceeded. Please free up space by deleting previous request(s) before submitting a new one");
            } else if (result.error) {
                alert(result.error);
            }
        });
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

            dialog.afterClosed().subscribe((result) => {
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

    public setUpForm():void {
        this.form = new FormGroup({});
        if (this.application.parameters) {
            for (let param of this.application.parameters) {
                this.form.addControl(param.name, new FormControl());
                if (param.validators.length > 0) {
                    let validatorArray: ValidatorFn[] = [];
                    for (let validator of param.validators) {
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
                        } else if (validator.validatorType === ConstantsService.VALIDATOR_TYPE_REGEX) {
                            validatorArray.push(Validators.pattern(validator.value));
                        }
                    }
                    this.form.controls[param.name].setValidators(validatorArray);
                }
            }
            for (let key of Object.keys(this.form.controls)) {
                this.form.get(key).markAsTouched();
            }
        }
    }

    public submit(): void {
        let request: any = {};
        request.targetApplication = this.application.name;
        for (let param of this.application.parameters) {
            request[param.name] = this.form.controls[param.name].value;
        }

        this.resultsService.submitRequest(this.application, request).subscribe((result: PostResult) => {
            if (result.success && result.message) {
                this.router.navigate(['/loading', result.message]);
            } else {
                alert(result.message);
            }
        });
    }
}
