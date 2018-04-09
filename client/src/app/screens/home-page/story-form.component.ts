import { Component, OnInit } from '@angular/core';

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
  <button class="btn btn-success">Dang</button>
  `,
  styleUrls: ['./home-page.component.css']
})
export class StoryFormComponent {
  txtContent = '';
  constructor() { }
}
