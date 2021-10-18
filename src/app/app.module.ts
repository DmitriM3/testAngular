import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginFormComponent } from './login/login-form/login-form.component';
import { MaterialModule } from './material/material.module';
import { PersonModule } from './person/person.module';
import { PersonsAdministrationModule } from './persons-administration/persons-administration.module';
import { TokenInterceptor } from './security/interceptor/token-interceptor';
import { AuthenticationService } from './security/service/authentication.service';
import { SidenavComponent } from './sidenav/sidenav.component';
import {BusModule} from "./bus/bus.module";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    SidenavComponent,
    LoginFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PersonsAdministrationModule,
    PersonModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    BusModule,
  ],
  providers: [AuthenticationService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
