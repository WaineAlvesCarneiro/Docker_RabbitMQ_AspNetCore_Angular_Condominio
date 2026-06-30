import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefinirSenha } from './definir-senha';
import { SharedModule } from '../../../shared/shared-module';

const routes: Routes = [
  { path: '', component: DefinirSenha }
];

@NgModule({
  declarations: [
    DefinirSenha
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DefinirSenhaModule {}
