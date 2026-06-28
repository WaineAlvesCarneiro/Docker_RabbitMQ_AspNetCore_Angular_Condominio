import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth-guard';

import { MoradorLista } from './morador-lista/morador-lista';
import { MoradorForm } from './morador-form/morador-form';

const routes: Routes = [
  { path: '', component: MoradorLista, canActivate: [AuthGuard] },
  { path: 'novo', component: MoradorForm, canActivate: [AuthGuard] },
  { path: ':id', component: MoradorForm, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoradoresRoutingModule { }