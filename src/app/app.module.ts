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
import {ResultsComponent} from './results/results.component';
import {HomeComponent} from './home/home.component';

import {AppRoutingModule} from './app-routing.module';
import {ConfiguratorOverviewComponent} from './configurator/configurator-overview.component';
import {HttpClientModule} from '@angular/common/http';
import {ConstantsService} from './services/constants.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConfiguratorService} from './services/configurator.service';
import {ConfiguratorUsersComponent} from './configurator/configurator-users.component';
import {
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
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
import {AuthGuardService} from "./services/auth-guard.service";
import {AuthGuardAdminService} from "./services/auth-guard-admin.service";
import {MyAccountComponent} from "./users/my-account.component";
import {ManageUsersComponent} from "./users/manage-users.component";
import {AgGridModule} from "ag-grid-angular";
import {UsersService} from "./services/users.service";
import {AllResultsComponent} from "./results/all-results.component";
import {AuthGuardNonGuestService} from "./services/auth-guard-non-guest.service";
import {LoadingComponent} from "./requests/loading.component";
import {CustomGraphRendererComponent} from "./custom-charts/custom-graph-renderer.component";
import { DeleteApplicationDialogComponent } from './configurator/delete-application-dialog.component';
import {ParentPickerComponent} from "./configurator/parent-picker.component";


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
        ResultsComponent,
        HomeComponent,
        BasicInputComponent,
        NewRequestComponent,
        ValidatorsComponent,
        OptionsComponent,
        ApplicationPickerComponent,
        MyAccountComponent,
        ManageUsersComponent,
        AllResultsComponent,
        LoadingComponent,
        CustomGraphRendererComponent,
        DeleteApplicationDialogComponent,
        ParentPickerComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSelectModule,
        MatSidenavModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        NgxChartsModule,
        AppRoutingModule,
        AgGridModule.withComponents([]),
    ],
    providers: [
        ConfiguratorService,
        ConstantsService,
        ResultsService,
        AuthService,
        AuthGuardService,
        AuthGuardAdminService,
        AuthGuardNonGuestService,
        UsersService,
    ],
    entryComponents: [
        ValidatorsComponent,
        OptionsComponent,
        ApplicationPickerComponent,
        DeleteApplicationDialogComponent,
        ParentPickerComponent,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
