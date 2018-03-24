import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
    public message: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
      this.http.get("http://localhost:8080/endless-eddies/test").subscribe((result: any) => {
          this.message = result.message;
      });
  }

}
