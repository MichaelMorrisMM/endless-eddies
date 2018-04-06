import { Component, OnInit } from '@angular/core';
import { ConfiguratorService } from '../services/configurator.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styles: [`
    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class ResultsComponent implements OnInit {
  config: Config;
  constructor(public configuratorService: ConfiguratorService) {
  }
  ngOnInit() {
  }
}
