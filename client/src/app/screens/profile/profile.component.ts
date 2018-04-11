import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { User, AppState } from '../../types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User = null;
  constructor(private store: Store<AppState>) {
    this.store.select('user').subscribe(u => this.user = u);
  }

  ngOnInit() {
  }

}
