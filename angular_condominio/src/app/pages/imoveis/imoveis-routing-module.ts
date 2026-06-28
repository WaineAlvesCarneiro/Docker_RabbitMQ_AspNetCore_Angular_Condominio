import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth-guard';

import { ImovelLista } from './imovel-lista/imovel-lista';
import { ImovelForm } from './imovel-form/imovel-form';

const routes: Routes = [
  { path: '', component: ImovelLista, canActivate: [AuthGuard] },
  { path: 'novo', component: ImovelForm, canActivate: [AuthGuard] },
  { path: ':id', component: ImovelForm, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImoveisRoutingModule { }