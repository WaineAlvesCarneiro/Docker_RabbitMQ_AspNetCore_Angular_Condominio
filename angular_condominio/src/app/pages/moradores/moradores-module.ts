import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CelularMaskDirective } from '../../shared/directive/celular-mask-directive';
import { MoradorLista } from './morador-lista/morador-lista';
import { MoradorForm } from './morador-form/morador-form';
import { MoradoresRoutingModule } from './moradores-routing-module';
import { CelularPipe } from '../../shared/pipes/celularpipe.pipe';
import { TelefonePipe } from '../../shared/pipes/telefonepipe.pipe';

@NgModule({
  declarations: [
    MoradorLista,
    MoradorForm
  ],
  imports: [
    CommonModule,
    MoradoresRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CelularMaskDirective,
    CelularPipe,
    TelefonePipe
  ],
  exports: [
  ]
})
export class MoradoresModule { }
