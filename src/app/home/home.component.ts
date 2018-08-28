import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {Config} from '../configurator/config.interface';
import * as marked from 'marked';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styles: [`
        div {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
    `]
})
export class HomeComponent implements OnInit {
    config: Config;
    tabs = ['Home', 'About', 'Contact'];
    tabsContent = [
        '# Home\n\nThis is a test of marked.js\n\n**bold**\n\n![Turbo Gen Image](https://turbulence.utah.edu/wordpress/wp-content/uploads/2015/06/vorticity2.jpg)',
        '# About\n\nThis is the about page. Using marked.js\n\n_this is italic_',
        '# Contact\n\n- Name: Eddy\n- Website: [Endless Eddies](https://github.com/MichaelMorrisMM/endless-eddies)'
    ];
    md = marked.setOptions({});

    constructor(public configuratorService: ConfiguratorService) {
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe(con => this.config = con);
    }
}
