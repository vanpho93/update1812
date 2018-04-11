import { Component, Input } from '@angular/core';
import * as faker from 'faker';
import { StoryService } from '../../../services/story.service';

@Component({
    selector: 'app-story',
    template: `
      <div class="story" >
            <h3>
            <img class="avatar" src="{{ avatar }}" />
            {{ storyInfo.author.name }}
            </h3>
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
    `
    ]
})

export class StoryComponent {
    @Input() storyInfo: any;
    avatar = faker.image.avatar();
    txtComment = '';
    constructor(private storyService: StoryService) { }

    addComment() {
        this.storyService.addComment(this.storyInfo._id, this.txtComment);
        this.txtComment = '';
    }
}
