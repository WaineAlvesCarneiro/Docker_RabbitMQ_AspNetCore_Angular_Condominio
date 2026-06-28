import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth-guard';
import { Layout } from './layout/layout';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login/login-module').then(m => m.LoginModule) },
  { path: 'definir-senha', loadChildren: () => import('./login/definir-senha/definir-senha-module').then(m => m.DefinirSenhaModule) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  {
    path: '',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: 'imoveis', loadChildren: () => import('./pages/imoveis/imoveis-module').then(m => m.ImoveisModule) },
      { path: 'moradores', loadChildren: () => import('./pages/moradores/moradores-module').then(m => m.MoradoresModule) },
      { path: 'empresas', loadChildren: () => import('./pages/empresas/empresas-module').then(m => m.EmpresasModule) }
      ,{ path: 'usuarios', loadChildren: () => import('./pages/usuarios/usuarios-module').then(m => m.UsuariosModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
