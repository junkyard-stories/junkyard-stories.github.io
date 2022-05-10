import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Junky, Story } from '../models';
import { StoryboardService } from '../services/storyboard.service';

@Component({
  selector: 'story-editor',
  templateUrl: './story-editor.component.html'
})
export class StoryEditorPageComponent {  
  public selectedStory$: Subject<Story> = new Subject<Story>();

  constructor(private router: Router, public storyboardService: StoryboardService) {
  }

  public storySelected(story: Story) {
    this.selectedStory$.next(story);
  }
}
