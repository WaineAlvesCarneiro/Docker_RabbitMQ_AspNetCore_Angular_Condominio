import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { CoreModule } from './core/core-module';
import { SharedModule } from './shared/shared-module';

registerLocaleData(ptBr);

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  bootstrap: [App]
})
export class AppModule {}
