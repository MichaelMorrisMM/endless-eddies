import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RequestsComponent } from './requests/requests.component';

import { AppRoutingModule } from './app-routing.module';
import { ConfiguratorOverviewComponent } from './configurator/configurator-overview.component';
import { HttpClientModule } from '@angular/common/http';
import { ConstantsService } from './services/constants.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfiguratorService } from './services/configurator.service';


@NgModule({
  declarations: [
    AppComponent,
    ConfiguratorOverviewComponent,
    LoginComponent,
    SignupComponent,
    NotFoundComponent,
    RequestsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
      ConfiguratorService,
      ConstantsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
