import { Component, OnInit } from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {Config} from "./config.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HomePage} from "./home-page.model";
import {PostResult} from "./post-result.interface";
import {ConstantsService} from "../services/constants.service";

@Component({
    selector: 'configurator-overview',
    templateUrl: './configurator-overview.component.html',
    styles: [`
    `]
})
export class ConfiguratorOverviewComponent implements OnInit {
    public config: Config;
    public form: FormGroup;

    private counterHomePages: number;
    private homePages: HomePage[];

    constructor(private configuratorService: ConfiguratorService,
                public constantsService: ConstantsService) {
    }

    ngOnInit() {
        this.reset();
    }

    private reset(): void {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;

            this.form = new FormGroup({});
            this.counterHomePages = 1;
            this.homePages = [];
            if (this.config.homePages) {
                for (let page of this.config.homePages) {
                    this.makeNewHomePage(page);
                }
            }
        });
    }

    public addHomePage(): void {
        this.makeNewHomePage(null);
        this.form.markAsDirty();
    }

    private makeNewHomePage(p: HomePage): void {
        let page: HomePage = new HomePage(this.counterHomePages, p);
        this.counterHomePages = this.counterHomePages + 1;
        this.form.addControl(page.keyTitle, new FormControl(page.title, Validators.required));
        this.form.addControl(page.keyContent, new FormControl(page.content, Validators.required));
        this.homePages.push(page);
    }

    public deleteHomePage(p: HomePage): void {
        this.homePages.splice(this.homePages.indexOf(p),1);
        this.form.removeControl(p.keyTitle);
        this.form.removeControl(p.keyContent);
        this.form.markAsDirty();
    }

    public save(): void {
        for (let page of this.homePages) {
            page.title = this.form.controls[page.keyTitle].value;
            page.content = this.form.controls[page.keyContent].value;
        }
        this.config.homePages = this.homePages;

        this.configuratorService.saveConfiguration(this.config).subscribe((response: PostResult) => {
            if (response.success) {
                this.reset();
            }
        });
    }

}
