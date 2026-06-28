import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth-guard';

import { EmpresaLista } from './empresa-lista/empresa-lista';
import { EmpresaForm } from './empresa-form/empresa-form';

const routes: Routes = [
  { path: '', component: EmpresaLista, canActivate: [AuthGuard] },
  { path: 'novo', component: EmpresaForm, canActivate: [AuthGuard] },
  { path: ':id', component: EmpresaForm, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresasRoutingModule { }
