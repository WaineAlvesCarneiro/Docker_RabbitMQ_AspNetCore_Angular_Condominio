import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guards/auth-guard';
import { AuthRedirectService } from './services/auth-redirect.service';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/AuthService';
import { AuthTokenInterceptor } from './interceptors/AuthTokenInterceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared-module';

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
    AuthService,
    AuthRedirectService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true
    }
  ],
  exports: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    RouterModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule já foi carregado. Importe-o apenas no AppModule.'
      );
    }
  }
}
