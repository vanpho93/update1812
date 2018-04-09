import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  providers: [UserService]
})
export class SignInComponent implements OnInit {
  constructor(private userService: UserService) {}
  ngOnInit() {
    
  }

  signIn() {
    this.userService.signIn('teo@gmail.com', '123');
  }
}
