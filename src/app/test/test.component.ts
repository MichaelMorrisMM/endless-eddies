import { Component, OnInit } from '@angular/core';
import {TestService} from "../services/test.service";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
    public message: string;

  constructor(private testService: TestService) {
  }

  ngOnInit() {
      this.testService.pingTomcatServer().subscribe((response: any) => {
          this.message = response.message;
      });
  }

}
