import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { Layout } from './layout/layout';
import { NotificationComponent } from './notification/notification';
import { Confirmation } from './modal/confirmation/confirmation';

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    App,
    Layout,
    Confirmation
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CoreModule,
    NotificationComponent
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  bootstrap: [App]
})
export class AppModule { }
