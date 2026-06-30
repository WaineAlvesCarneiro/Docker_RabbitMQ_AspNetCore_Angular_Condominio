import { NgModule } from '@angular/core';
import { ImovelLista } from './imovel-lista/imovel-lista';
import { ImovelForm } from './imovel-form/imovel-form';
import { ImoveisRoutingModule } from './imoveis-routing-module';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    ImovelLista,
    ImovelForm
  ],
  imports: [
    ImoveisRoutingModule,
    SharedModule
  ],
  exports: [
  ]
})
export class ImoveisModule { }
