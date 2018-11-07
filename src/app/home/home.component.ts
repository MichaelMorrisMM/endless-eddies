import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import * as marked from 'marked';
import {DomSanitizer} from '@angular/platform-browser';
import {HomePage} from '../configurator/home-page.model';
import * as katex from 'katex';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styles: [`
    `]
})
export class HomeComponent implements OnInit {
    public md = marked.setOptions({});
    public parsedHomePages: HomePage[] = [];

    constructor(public configuratorService: ConfiguratorService,
                public sanitizer: DomSanitizer) {
    }

    private static equationReplacer(match: string, equation: string): string {
        return katex.renderToString(equation, {
            throwOnError: false
        });
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe(config => config.homePages.forEach(page => {
                page.content = this.md.parse(page.content).replace(/\$\$(.+)\$\$/, HomeComponent.equationReplacer);
                this.parsedHomePages.push(page);
            }
        ));
    }
}
