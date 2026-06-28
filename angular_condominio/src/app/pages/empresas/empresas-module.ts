import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CnpjMaskDirective } from '../../shared/directive/cnpj-mask-directive';
import { CepMaskDirective } from '../../shared/directive/cep-mask-directive';
import { CelularMaskDirective } from '../../shared/directive/celular-mask-directive';
import { TelefoneMaskDirective } from '../../shared/directive/telefone-mask-directive';
import { CelularPipe } from '../../shared/pipes/celularpipe.pipe';
import { TelefonePipe } from '../../shared/pipes/telefonepipe.pipe';
import { CnpjPipe } from '../../shared/pipes/cnpjpipe.pipe';
import { EmpresaLista } from './empresa-lista/empresa-lista';
import { EmpresaForm } from './empresa-form/empresa-form';
import { EmpresasRoutingModule } from './empresas-routing-module';

@NgModule({
  declarations: [
    EmpresaLista,
    EmpresaForm
  ],
  imports: [
    CommonModule,
    EmpresasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CnpjMaskDirective,
    CepMaskDirective,
    CelularMaskDirective,
    CelularPipe,
    TelefoneMaskDirective,
    TelefonePipe,
    CnpjPipe
  ]
})
export class EmpresasModule { }
