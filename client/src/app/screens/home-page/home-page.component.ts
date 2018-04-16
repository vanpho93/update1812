import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { User, AppState } from '../../types';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  user: User = null;
  constructor(private store: Store<AppState>) {
    this.store.select('user').subscribe(user => this.user = user);
  }

  ngOnInit() {
  }

}
