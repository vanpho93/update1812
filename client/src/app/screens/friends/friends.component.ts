import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FriendService } from '../../services/friend.service';
import { User, AppState } from '../../types';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styles:['h3 { color: wheat; }']
})

export class FriendsComponent implements OnInit {
  sentRequests: User[];
  incommingRequests: User[];
  friends: User[];
  otherUsers: User[];

  constructor(
    private friendService: FriendService,
    private store: Store<AppState>
  ) {
    this.store.select('sentRequests').subscribe(users => this.sentRequests = users);
    this.store.select('friends').subscribe(users => this.friends = users);
    this.store.select('otherUsers').subscribe(users => this.otherUsers = users);
    this.store.select('incommingRequests').subscribe(users => this.incommingRequests = users);
  }

  ngOnInit() {
    this.friendService.getAllUser();
  }

  sendRequest(_id: string) {
    this.friendService.sentRequest(_id);
  }

  acceptFriend(_id: string) {
    this.friendService.acceptRequest(_id);
  }

  removeFriend(_id: string) {
    this.friendService.removeFriend(_id);
  }
}
