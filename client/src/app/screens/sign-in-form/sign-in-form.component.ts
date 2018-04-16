import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.css']
})

export class SignInFormComponent implements OnInit {
  formSignIn: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.formSignIn = this.fb.group({
      email: ['teo@gmail.com'],
      password: ['123', Validators.required]
    });
  }
  
  onSubmitForm() {
    const { email, password } = this.formSignIn.value;
    this.userService.signIn(email, password);
  }

  getShouldShowEmailWarning(controlName) {
    const emailControl = this.formSignIn.get(controlName);
    return emailControl.invalid && emailControl.touched;
  }
}

function gmail(control: AbstractControl): ValidationErrors | null {
  if ((control.value as string).trim().endsWith('@gmail.com')) return null;
  return { error: 'gmail' };
}
