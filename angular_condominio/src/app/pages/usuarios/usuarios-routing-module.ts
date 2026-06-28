import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioLista } from './usuario-lista/usuario-lista';
import { UsuarioForm } from './usuario-form/usuario-form';

const routes: Routes = [
  { path: '', component: UsuarioLista },
  { path: 'novo', component: UsuarioForm },
  { path: ':id', component: UsuarioForm }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
