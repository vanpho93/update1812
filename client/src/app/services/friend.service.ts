import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Request } from './request.service';

@Injectable()

export class FriendService {
    constructor(private request: Request, private store: Store<any>) {}
    
    getAllUser() {
        return this.request.get('/friend')
        .then(response => {
            const { friends, sentRequests, incommingRequests, otherUsers } = response.users;
            this.store.dispatch({ type: 'SET_ALL_USER',friends, sentRequests, incommingRequests, otherUsers });
        });
    }
}
