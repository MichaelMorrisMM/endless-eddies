import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {Config} from "../configurator/config.interface";
import {Parameter} from "../configurator/parameter.model";
import {PostResult} from "../configurator/post-result.interface";

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
                public constantsService: ConstantsService) {
        this.form = new FormGroup({});
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
            this.config.parameters.forEach((param: Parameter) => {
                this.form.addControl(param.name, new FormControl());
            });
        });
    }

    public submit(): void {
        let request: any = {};
        this.config.parameters.forEach((param: Parameter) => {
            request[param.name] = this.form.controls[param.name].value;
        });

        this.configuratorService.submitRequest(request).subscribe((response: PostResult) => {
            if (response.success) {
                // TODO
                alert(response.message);
            }
        });
    }
}
