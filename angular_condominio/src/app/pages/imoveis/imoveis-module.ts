import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImovelLista } from './imovel-lista/imovel-lista';
import { ImovelForm } from './imovel-form/imovel-form';
import { ImoveisRoutingModule } from './imoveis-routing-module';

@NgModule({
  declarations: [
    ImovelLista,
    ImovelForm
  ],
  imports: [
    CommonModule,
    ImoveisRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
  ]
})
export class ImoveisModule { }
