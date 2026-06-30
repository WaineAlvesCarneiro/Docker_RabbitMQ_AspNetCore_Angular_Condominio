import { NgModule } from '@angular/core';
import { MoradorLista } from './morador-lista/morador-lista';
import { MoradorForm } from './morador-form/morador-form';
import { MoradoresRoutingModule } from './moradores-routing-module';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    MoradorLista,
    MoradorForm
  ],
  imports: [
    MoradoresRoutingModule,
    SharedModule
  ],
  exports: [
  ]
})
export class MoradoresModule { }
