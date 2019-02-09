import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LoginComponent } from './login.component';
import { routing } from './app.routes';
import { PaymentModule } from './payment/payment.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { CoreModule } from './shared/core.module';
import { AuthorizationGuard } from './shared/guards/authorization.guard';
import { CanDeactivateGuard } from './shared/guards/can-deactivate.guard';
import * as shared from './shared/index';

@NgModule({
 imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    PaymentModule,
    SharedModule,
    CoreModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    //shared.InputRComponent
  ],
  
  providers: [AuthorizationGuard,CanDeactivateGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
