import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import {AppRoutingModule} from './app-routing.module';
import {TestComponent} from './test/test.component';
import {HttpClientModule} from '@angular/common/http';
import {TestService} from './services/test.service';
import {ConstantsService} from './services/constants.service';


@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
      TestService,
      ConstantsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
