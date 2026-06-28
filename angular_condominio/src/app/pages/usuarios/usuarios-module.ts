import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsuariosRoutingModule } from './usuarios-routing-module';
import { UsuarioLista } from './usuario-lista/usuario-lista';
import { UsuarioForm } from './usuario-form/usuario-form';

@NgModule({
  declarations: [
    UsuarioLista,
    UsuarioForm
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsuariosModule { }
