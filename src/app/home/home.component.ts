import { Component, OnInit } from '@angular/core';
import { ConfiguratorService } from '../services/configurator.service';

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
  constructor(public configuratorService: ConfiguratorService) {
  }
  ngOnInit() {
    this.configuratorService.getConfiguration().subscribe( con => this.config = con );
  }
}
