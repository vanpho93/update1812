import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';

import { MustLoggedInGuard } from './must-logged-in.guard';
import { MustBeGuestGuard } from './must-be-guest.guard';
import { Request } from './services/request.service';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ProfileComponent } from './profile/profile.component';
import { MessagesComponent } from './messages/messages.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
//reducers
import { loadingReducer } from './ngrx/loadingReducer';
import { userReducer } from './ngrx/userReducer';

const routesConfig: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [MustLoggedInGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [MustLoggedInGuard] },
  { path: 'signin', component: SignInComponent, canActivate: [MustBeGuestGuard] },
  { path: 'signup', component: SignUpComponent, canActivate: [MustBeGuestGuard] },
  { path: 'password', component: ForgotPasswordComponent, canActivate: [MustBeGuestGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ProfileComponent,
    MessagesComponent,
    SignUpComponent,
    SignInComponent,
    ForgotPasswordComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routesConfig),
    StoreModule.forRoot({ user: userReducer, loading: loadingReducer })
  ],
  providers: [MustLoggedInGuard, MustBeGuestGuard, Request],
  bootstrap: [AppComponent]
})
export class AppModule { }
