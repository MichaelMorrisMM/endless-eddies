import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {Config} from "../configurator/config.interface";
import {ResultsService} from "../services/results.service";
import {Router} from "@angular/router";
import {Application} from "../configurator/application.model";
import {ApplicationPickerComponent} from "../configurator/application-picker.component";
import {MatDialog, MatDialogRef} from "@angular/material";
import {PostResult} from "../configurator/post-result.interface";
import {UsersService} from "../services/users.service";
import {CheckUserStorageResult} from "./check-user-storage-result.interface";
import {Parameter} from "../configurator/parameter.model";
import {ThemesService} from "../services/themes.service";

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

    private parameterCounter: number;
    public currentParameters: Parameter[] = [];

    constructor(public configuratorService: ConfiguratorService,
                public constantsService: ConstantsService,
                private resultsService: ResultsService,
                private usersService: UsersService,
                private router: Router,
                private dialog: MatDialog,
                private changeDetector: ChangeDetectorRef,
                public themesService: ThemesService) {
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
        this.parameterCounter = 1;
        this.form = new FormGroup({});
        this.currentParameters = [];
        let allParameters: Parameter[] = [];
        for (let param of this.application.parameters) {
            let p: Parameter = new Parameter(this.parameterCounter, param);
            this.parameterCounter++;
            allParameters.push(p);
        }
        Parameter.establishRelationships(allParameters);

        for (let param of allParameters) {
            if (!param.parent) {
                this.addParameter(param);
            }
        }
    }

    private addParameter(param: Parameter, index: number = -1): void {
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
                } else if (validator.validatorType === ConstantsService.VALIDATOR_TYPE_MOD) {
                    validatorArray.push(NewRequestComponent.moduloValidator(parseInt(validator.value)));
                } else if (validator.validatorType === ConstantsService.VALIDATOR_TYPE_MAX_SIZE) {
                    validatorArray.push(NewRequestComponent.maxSizeValidator(parseInt(validator.value)));
                }
            }
            this.form.controls[param.name].setValidators(validatorArray);
            this.form.controls[param.name].markAsTouched();
        }
        if (index > -1) {
            this.currentParameters.splice(index + 1, 0, param);
        } else {
            this.currentParameters.push(param);
        }
    }

    private removeParameter(param: Parameter): void {
        this.form.removeControl(param.name);
        this.currentParameters.splice(this.currentParameters.indexOf(param), 1);
    }

    public onSelectParamChange(param: Parameter): void {
        if (param.currentlyDisplayedChildren) {
            for (let p of param.currentlyDisplayedChildren) {
                this.removeParameter(p);
            }
        }
        param.currentlyDisplayedChildren = [];
        if (this.form.controls[param.name].value) {
            let parentIndex: number = this.currentParameters.indexOf(param);
            for (let p of param.getChildrenWithOption(this.form.controls[param.name].value)) {
                this.addParameter(p, parentIndex);
                param.currentlyDisplayedChildren.push(p);
            }
        }
        this.changeDetector.detectChanges();
    }

    public onFileChange(event: any, param: Parameter): void {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.form.controls[param.name].setValue(fileList[0]);
        } else {
            this.form.controls[param.name].setValue(null);
        }
    }

    public submit(): void {
        let request: FormData = new FormData();
        request.append("targetApplication", this.application.name);
        for (let param of this.currentParameters) {
            if (param.type === this.configuratorService.TYPE_FILE && this.form.controls[param.name].value) {
                let file: File = this.form.controls[param.name].value;
                request.append(param.name, file, file.name);
            } else {
                request.append(param.name, this.form.controls[param.name].value ? "" + this.form.controls[param.name].value : "");
            }
        }

        this.resultsService.submitRequest(this.application, request).subscribe((result: PostResult) => {
            if (result.success && result.message) {
                this.router.navigate(['/loading', result.message]);
            } else {
                alert(result.message);
            }
        });
    }

    private static moduloValidator(value: number): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            const remainder: number = control.value && !isNaN(value) ? control.value % value : -1;
            return remainder !== 0 ? {'modulo': {value: control.value}} : null;
        };
    }

    private static maxSizeValidator(value: number): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            if (control.value && control.value instanceof File) {
                let file: File = control.value;
                return file.size > value ? {'maxSize': {value: control.value}} : null;
            }
            return null;
        };
    }

}
