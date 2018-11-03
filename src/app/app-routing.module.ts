import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { ResultsComponent } from './results/results.component';
import { HomeComponent } from './home/home.component';
import { ConfiguratorOverviewComponent } from './configurator/configurator-overview.component';
import { ConfiguratorUsersComponent } from './configurator/configurator-users.component';
import {ConfiguratorExecutionComponent} from './configurator/configurator-execution.component';
import {NewRequestComponent} from './requests/new-request.component';
import {ConfiguratorResultsComponent} from "./configurator/configurator-results.component";
import {AuthGuardAdminService} from "./services/auth-guard-admin.service";
import {AuthGuardService} from "./services/auth-guard.service";
import {MyAccountComponent} from "./users/my-account.component";
import {ManageUsersComponent} from "./users/manage-users.component";
import {AllResultsComponent} from "./results/all-results.component";
import {AuthGuardNonGuestService} from "./services/auth-guard-non-guest.service";
import {LoadingComponent} from "./requests/loading.component";
import {ThemePickerComponent} from "./themes/theme-picker.component";
import {LogoutComponent} from "./login/logout.component";

const routes: Routes = [
    { path: 'config', component: ConfiguratorOverviewComponent, canActivate: [AuthGuardAdminService] },
    { path: 'config-users', component: ConfiguratorUsersComponent, canActivate: [AuthGuardAdminService] },
    { path: 'config-execute', component: ConfiguratorExecutionComponent, canActivate: [AuthGuardAdminService] },
    { path: 'config-results', component: ConfiguratorResultsComponent, canActivate: [AuthGuardAdminService] },
    { path: 'manage-users', component: ManageUsersComponent, canActivate: [AuthGuardAdminService] },
    { path: 'new-request', component: NewRequestComponent, canActivate: [AuthGuardService] },
    { path: 'loading/:requestName', component: LoadingComponent, canActivate: [AuthGuardService] },
    { path: 'results/:idRequest', component: ResultsComponent, canActivate: [AuthGuardService] },
    { path: 'all-results', component: AllResultsComponent, canActivate: [AuthGuardService] },
    { path: 'my-account', component: MyAccountComponent, canActivate: [AuthGuardNonGuestService] },
    { path: 'theme-picker', component: ThemePickerComponent, canActivate: [AuthGuardAdminService] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
    { path: 'logout', component: LogoutComponent, canActivate: [AuthGuardService] },
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent, canActivate: [AuthGuardService] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
