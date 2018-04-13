import { Component, OnInit } from '@angular/core';
import { ConfiguratorService } from '../services/configurator.service';
import {Config} from "../configurator/config.interface";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styles: []
})
export class ResultsComponent implements OnInit {
  config: Config;
  constructor(public configuratorService: ConfiguratorService) {
  }
  ngOnInit() {
    this.configuratorService.getConfiguration().subscribe( con => this.config = con );
  }
}
