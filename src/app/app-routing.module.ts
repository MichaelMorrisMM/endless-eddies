import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ResultsComponent } from './results/results.component';
import { HomeComponent } from './home/home.component';
import { ConfiguratorOverviewComponent } from './configurator/configurator-overview.component';
import { ConfiguratorUsersComponent } from './configurator/configurator-users.component';
import {ConfiguratorExecutionComponent} from './configurator/configurator-execution.component';
import {NewRequestComponent} from './requests/new-request.component';
import {ConfiguratorResultsComponent} from "./configurator/configurator-results.component";

const routes: Routes = [
    { path: 'config', component: ConfiguratorOverviewComponent },
    { path: 'config-users', component: ConfiguratorUsersComponent },
    { path: 'config-execute', component: ConfiguratorExecutionComponent },
    { path: 'config-results', component: ConfiguratorResultsComponent },
    { path: 'new-request', component: NewRequestComponent },
    { path: 'results', component: ResultsComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent},
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
