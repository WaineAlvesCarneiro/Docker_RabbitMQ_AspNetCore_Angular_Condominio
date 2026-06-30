import { NgModule } from '@angular/core';
import { EmpresaLista } from './empresa-lista/empresa-lista';
import { EmpresaForm } from './empresa-form/empresa-form';
import { EmpresasRoutingModule } from './empresas-routing-module';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    EmpresaLista,
    EmpresaForm
  ],
  imports: [
    EmpresasRoutingModule,
    SharedModule
  ]
})
export class EmpresasModule { }
