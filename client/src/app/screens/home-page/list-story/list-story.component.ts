import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as faker from 'faker';
import { StoryService } from '../../../services/story.service';

@Component({
  selector: 'app-list-story',
  template: `
    <div *ngFor="let story of stories">
      <app-story [storyInfo]="story"></app-story>
    </div>
  `
})

export class ListStoryComponent implements OnInit {
  stories = [];
  constructor(private store: Store<any>, private storyService: StoryService) {
    this.store.select('stories').subscribe(stories => this.stories = stories);
  }

  ngOnInit() {
    this.storyService.getAllStories();
  }

  get randomAvatar() {
    return faker.image.avatar();
  }
}
