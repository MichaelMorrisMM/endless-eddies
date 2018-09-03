import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {Config} from '../configurator/config.interface';
import * as marked from 'marked';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styles: [`
    `]
})
export class HomeComponent implements OnInit {
    public config: Config;
    public md = marked.setOptions({});

    constructor(public configuratorService: ConfiguratorService) {
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe(con => this.config = con);
    }
}
