import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Request } from './request.service';

@Injectable()

export class UserService {
    constructor(private request: Request, private router: Router, private store: Store<any>) {}

    signIn(email: string, password: string) {
        return this.request.post('/user/signin', { email, password })
        .then(response => {
            if (!response.success) return alert(response.message);
            localStorage.setItem('token', response.user.token);
            this.store.dispatch({ type: 'SET_USER', user: response.user });
            this.router.navigate(['/profile']);
        });
    }

    signOut() {
        this.store.dispatch({ type: 'SET_USER', user: null });
        localStorage.removeItem('token');
        this.router.navigate(['/signin']);
    }

    check() {
        return this.request.post('/user/check', null)
        .then(res => {
            if (!res.success) return;
            localStorage.setItem('token', res.user.token);
            this.store.dispatch({ type: 'SET_USER', user: res.user });
        })
        .catch(error => console.log(error.message));
    }
}
