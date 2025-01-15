import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslationService } from './service/translation.service';
import { OucaComponent } from './components/pages/ouca/ouca.component';
import { FaleComponent } from './components/pages/fale/fale.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from './material.module';
import { HomeComponent } from './components/pages/home/home.component';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    AppComponent,
    OucaComponent,
    FaleComponent,
    HomeComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    MaterialModule,
    RouterModule,
    MatIconModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      toastClass: 'toast-custom' // Define a classe de posição
    }),

  ],
  providers: [TranslationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
