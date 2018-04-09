import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Request } from './request.service';

@Injectable()

export class StoryService {
    constructor(private request: Request, private store: Store<any>) {}

    createStory(content: string) {
        return this.request.post('/story', { content })
        .then(response => {
            if (!response.success) return alert(response.message);
            alert('Them thanh cong');
        });
    }
}
