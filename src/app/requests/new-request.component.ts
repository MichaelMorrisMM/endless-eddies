import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ConfiguratorService} from '../services/configurator.service';
import {ConstantsService} from "../services/constants.service";
import {Config} from "../configurator/config.interface";
import {Parameter} from "../configurator/parameter.model";
import {ResultsService} from "../services/results.service";
import {Router} from "@angular/router";

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
