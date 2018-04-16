import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Store } from '@ngrx/store';
import { User, AppState } from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})

export class AppComponent {
  isLoading = false;
  user: User = null;
  constructor(private userService: UserService, private store: Store<AppState>) {
    this.store.select('user').subscribe(user => this.user = user);
    // this.userService.check()
    // .then(() => this.isLoading = false);
  }

  signOut() {
    this.userService.signOut();
  }
}
