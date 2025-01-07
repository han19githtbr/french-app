import { FaleComponent } from './components/pages/fale/fale.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { OucaComponent } from './components/pages/ouca/ouca.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'ouca', component: OucaComponent},
  {path: 'fale', component: FaleComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
