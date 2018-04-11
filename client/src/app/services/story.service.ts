import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Request } from './request.service';

@Injectable()

export class StoryService {
    constructor(private request: Request, private store: Store<any>) {}
    
    getAllStories() {
        return this.request.get('/story')
        .then(response => {
            this.store.dispatch({ type: 'SET_STORIES', stories: response.stories });
        });
    }

    createStory(content: string) {
        return this.request.post('/story', { content })
        .then(response => {
            if (!response.success) return alert(response.message);
            this.store.dispatch({ type: 'ADD_STORY', story: response.story });
        });
    }

    addComment(storyId: string, content: string) {
        this.request.post('/comment', { storyId, content })
        .then(response => {
            if (!response.success) return alert(response.code);
            this.store.dispatch({ type: 'ADD_COMMENT', _id: storyId, comment: response.comment });
        });
    }

    removeStory(storyId: string) {
        this.request.delete('/story/' + storyId)
        .then(response => {
            this.store.dispatch({ type: 'REMOVE_STORY', _id: storyId });
        });
    }
}
