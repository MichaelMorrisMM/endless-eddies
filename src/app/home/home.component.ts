import { Component, OnInit } from '@angular/core';
import { ConfiguratorService } from '../services/configurator.service';
import {Config} from "../configurator/config.interface";
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
  pageContent: string;
  constructor(public configuratorService: ConfiguratorService) {
  }
  ngOnInit() {
    this.configuratorService.getConfiguration().subscribe( con => this.config = con );
    this.pageContent = marked.parse('# Home\n\nThis is a test of marked.js\n\n**marked**');
  }
}
