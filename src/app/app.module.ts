import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslationService } from './service/translation.service';
import { OucaComponent } from './components/pages/ouca/ouca.component';
import { FaleComponent } from './components/pages/fale/fale.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
//import { DialogoComponent } from './components/pages/dialogo/dialogo.component';


@NgModule({
  declarations: [
    AppComponent,
    OucaComponent,
    FaleComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [TranslationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
