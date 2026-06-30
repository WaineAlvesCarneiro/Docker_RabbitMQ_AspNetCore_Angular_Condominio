import { NgModule } from '@angular/core';
import { UsuariosRoutingModule } from './usuarios-routing-module';
import { UsuarioLista } from './usuario-lista/usuario-lista';
import { UsuarioForm } from './usuario-form/usuario-form';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    UsuarioLista,
    UsuarioForm
  ],
  imports: [
    UsuariosRoutingModule,
    SharedModule
  ]
})
export class UsuariosModule { }
