import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RequestsComponent } from './requests/requests.component';
import { ResultsComponent } from './results/results.component';
import { HomeComponent } from './home/home.component';
import { ConfiguratorOverviewComponent } from './configurator/configurator-overview.component';

const routes: Routes = [
    { path: 'config', component: ConfiguratorOverviewComponent },
    { path: 'requests', component: RequestsComponent },
    { path: 'results', component: ResultsComponent },
    { path: '', component: HomeComponent },
    { path: '**', component: NotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
