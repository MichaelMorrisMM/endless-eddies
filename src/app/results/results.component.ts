import { Component, OnInit } from '@angular/core';
import { ConfiguratorService } from '../services/configurator.service';

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
