import { Component, OnInit } from '@angular/core';
import { FriendService } from '../../services/friend.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
})

export class FriendsComponent implements OnInit {

  constructor(private friendService: FriendService) { }

  ngOnInit() {
    this.friendService.getAllUser();
  }

}
