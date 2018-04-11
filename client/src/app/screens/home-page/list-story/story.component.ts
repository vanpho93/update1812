import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as faker from 'faker';
import { StoryService } from '../../../services/story.service';
import { AppState, Story } from '../../../types';

@Component({
    selector: 'app-story',
    template: `
      <div class="story" >
            <div class="header">
              <h3>
                <img class="avatar" src="{{ avatar }}" />
                {{ storyInfo.author.name }}
              </h3>
              <button
                class="btn btn-danger"
                *ngIf="storyInfo.author._id === myUserId"
                (click)="removeStory();"  
              >
                x
              </button>
            </div>
            <p>{{ storyInfo.content }}</p>
            <hr>
            <div *ngFor="let comment of storyInfo.comments">
                <p>{{ comment.user.name }}: {{ comment.content }}</p>
            </div>
            <input
                placeholder="Add comment"
                class="form-control"
                (keyup.enter)="addComment()"
                [(ngModel)]="txtComment"
            />
    </div>
  `,
    styles: [
        `
      .avatar {
        border-radius: 40px;
        width: 40px;
        height: 40px;
      }

      h3 {
        color: wheat;
      }

      .story {
        background-color: #1C273E;
        padding: 10px;
        border-radius: 5px;
        margin: 5px;
      }

      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      button {
        height: 50px;
        width: 50px;
      }
    `
    ]
})

export class StoryComponent {
    @Input() storyInfo: Story;
    avatar = faker.image.avatar();
    txtComment = '';
    myUserId = '';
    constructor(private storyService: StoryService, private store: Store<AppState>) {
      this.store.select('user').select('_id').subscribe(id => this.myUserId = id);
    }

    addComment() {
        this.storyService.addComment(this.storyInfo._id, this.txtComment);
        this.txtComment = '';
    }

    removeStory() {
      this.storyService.removeStory(this.storyInfo._id);
    }
}
