import { Component, OnInit } from '@angular/core';
import { StoryService } from '../../services/story.service';

@Component({
  selector: 'app-story-form',
  template: `
    <textarea
      placeholder="Ban dang nghi gi?"
      cols="70"
      rows="5"
      style="border-radius: 5px; padding-left: 5px"
      [(ngModel)]="txtContent"
  ></textarea>
  <br>
  <button class="btn btn-success" (click)="postStory();">Dang</button>
  `,
  styleUrls: ['./home-page.component.css']
})
export class StoryFormComponent {
  txtContent = '';

  constructor(private storyService: StoryService) {}

  postStory() {
    this.storyService.createStory(this.txtContent)
    this.txtContent = '';
  }
}
