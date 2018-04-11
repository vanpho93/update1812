import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoryService } from '../../../services/story.service';
import { AppState, Story } from '../../../types';

@Component({
  selector: 'app-list-story',
  template: `
    <div *ngFor="let story of stories">
      <app-story [storyInfo]="story"></app-story>
    </div>
  `
})

export class ListStoryComponent implements OnInit {
  stories: Story[] = [];
  constructor(private store: Store<AppState>, private storyService: StoryService) {
    this.store.select('stories').subscribe(stories => this.stories = stories);
  }

  ngOnInit() {
    this.storyService.getAllStories();
  }
}
