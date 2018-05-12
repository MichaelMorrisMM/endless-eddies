import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {NgxChartsModule} from '@swimlane/ngx-charts';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {RequestsComponent} from './requests/requests.component';
import {ResultsComponent} from './results/results.component';
import {HomeComponent} from './home/home.component';
import {HistogramComponent} from './custom-charts/histogram.component';

import {AppRoutingModule} from './app-routing.module';
import {ConfiguratorOverviewComponent} from './configurator/configurator-overview.component';
import {HttpClientModule} from '@angular/common/http';
import {ConstantsService} from './services/constants.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConfiguratorService} from './services/configurator.service';
import {ConfiguratorUsersComponent} from './configurator/configurator-users.component';
import {
    MatCheckboxModule, MatDialogModule, MatExpansionModule, MatSelectModule, MatSidenavModule, MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import {BasicInputComponent} from './components/basic-input/basic-input.component';
import {ConfiguratorExecutionComponent} from './configurator/configurator-execution.component';
import {NewRequestComponent} from './requests/new-request.component';
import {ResultsService} from './services/results.service';
import {AuthService} from './services/auth.service';
import {ValidatorsComponent} from "./configurator/validators.component";
import {OptionsComponent} from "./configurator/options.component";
import {ApplicationPickerComponent} from "./configurator/application-picker.component";
import {ConfiguratorResultsComponent} from "./configurator/configurator-results.component";


@NgModule({
    declarations: [
        AppComponent,
        ConfiguratorOverviewComponent,
        ConfiguratorUsersComponent,
        ConfiguratorExecutionComponent,
        ConfiguratorResultsComponent,
        LoginComponent,
        SignupComponent,
        NotFoundComponent,
        RequestsComponent,
        ResultsComponent,
        HomeComponent,
        BasicInputComponent,
        NewRequestComponent,
        ValidatorsComponent,
        OptionsComponent,
        HistogramComponent,
        ApplicationPickerComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTooltipModule,
        MatDialogModule,
        MatExpansionModule,
        NgxChartsModule,
    ],
    providers: [
        ConfiguratorService,
        ConstantsService,
        ResultsService,
        AuthService,
    ],
    entryComponents: [
        ValidatorsComponent,
        OptionsComponent,
        ApplicationPickerComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
