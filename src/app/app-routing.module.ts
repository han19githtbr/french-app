import { FaleComponent } from './components/pages/fale/fale.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { OucaComponent } from './components/pages/ouca/ouca.component';
import { LoginComponent } from './components/pages/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'login', component: LoginComponent},
  //{path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'ouca', component: OucaComponent},
  {path: 'fale', component: FaleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
