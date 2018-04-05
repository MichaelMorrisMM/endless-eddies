import { Component, OnInit } from '@angular/core';
import { ConfiguratorService } from '../services/configurator.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styles: [`
    div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  `]
})
export class RequestsComponent implements OnInit {
  config: Config;
  constructor(public configuratorService: ConfiguratorService) {
  }
  ngOnInit() {
    this.configuratorService.getConfiguration().subscribe( con => this.config = con );
  }
}
