import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login-routing-module';
import { Login } from './login';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [
    Login
  ],
  imports: [
    LoginRoutingModule,
    SharedModule
  ],
  exports: []
})
export class LoginModule { }
