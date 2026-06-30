import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { DefinirSenha } from './definir-senha';

const routes: Routes = [
  { path: '', component: DefinirSenha }
];

@NgModule({
  declarations: [DefinirSenha],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class DefinirSenhaModule {}
