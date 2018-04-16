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

    sentRequest(idFriend: string) {
        return this.request.post('/friend/request', { idFriend })
        .then(response => {
            if (!response.success) alert(response.code);
            const { friend } = response;
            this.store.dispatch({ type: 'SEND_REQUEST', user: friend });
        });
    }

    acceptRequest(idFriend: string) {
        return this.request.post('/friend/accept', { idFriend })
        .then(response => {
            if (!response.success) alert(response.code);
            const { friend } = response;
            this.store.dispatch({ type: 'ACCEPT_FRIEND', user: friend });
        });
    }

    removeFriend(idFriend: string) {
        return this.request.delete('/friend/' + idFriend)
        .then(response => {
            if (!response.success) alert(response.code);
            const { friend } = response;
            this.store.dispatch({ type: 'REMOVE_FRIEND', user: friend });
        });
    }
}
