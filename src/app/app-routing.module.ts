import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TestComponent} from './test/test.component';
import {LoginComponent} from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
    { path: 'testComp', component: TestComponent },
    { path: '', component: LoginComponent },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
