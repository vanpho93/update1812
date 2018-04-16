import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';

import { MustLoggedInGuard } from './guards/must-logged-in.guard';
import { MustBeGuestGuard } from './guards/must-be-guest.guard';
import { Request } from './services/request.service';
import { UserService } from './services/user.service';
import { StoryService } from './services/story.service';
import { FriendService } from './services/friend.service';

import { AppComponent } from './app.component';
import { HomePageComponent } from './screens/home-page/home-page.component';
import { ProfileComponent } from './screens/profile/profile.component';
import { FriendsComponent } from './screens/friends/friends.component';
import { SignUpComponent } from './screens/sign-up/sign-up.component';
import { SignInFormComponent } from './screens/sign-in-form/sign-in-form.component';
import { ForgotPasswordComponent } from './screens/forgot-password/forgot-password.component';
import { PageNotFoundComponent } from './screens/page-not-found/page-not-found.component';

import { StoryFormComponent } from './screens/home-page/story-form.component';
import { ListStoryComponent } from './screens/home-page/list-story/list-story.component';
import { StoryComponent } from './screens/home-page/list-story/story.component';
import { AnimationComponent } from './screens/animation.component';


//reducers
import { userReducer } from './ngrx/userReducer';
import { storiesReducer } from './ngrx/storiesReducer';
import { friendsReducer, sentRequestsReducer, incommingRequestsReducer, otherUsersReducer } from './ngrx/allUserReducer';

const routesConfig: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'animation', component: AnimationComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [MustLoggedInGuard] },
  { path: 'friends', component: FriendsComponent, canActivate: [MustLoggedInGuard] },
  { path: 'signin', component: SignInFormComponent, canActivate: [MustBeGuestGuard] },
  { path: 'signup', component: SignUpComponent, canActivate: [MustBeGuestGuard] },
  { path: 'password', component: ForgotPasswordComponent, canActivate: [MustBeGuestGuard] },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ProfileComponent,
    FriendsComponent,
    SignUpComponent,
    SignInFormComponent,
    ForgotPasswordComponent,
    PageNotFoundComponent,
    StoryFormComponent,
    ListStoryComponent,
    StoryComponent,
    AnimationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routesConfig),
    StoreModule.forRoot({
      user: userReducer,
      stories: storiesReducer,
      friends: friendsReducer,
      incommingRequests: incommingRequestsReducer,
      sentRequests: sentRequestsReducer,
      otherUsers: otherUsersReducer
    })
  ],
  providers: [MustLoggedInGuard, MustBeGuestGuard, Request, UserService, StoryService, FriendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
