import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AppRoutingModule} from "./app-routing.module";
import {TestComponent} from "./test/test.component";
import {HttpClientModule} from "@angular/common/http";
import {TestService} from "./services/test.service";
import {ConstantsService} from "./services/constants.service";


@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
      TestService,
      ConstantsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
