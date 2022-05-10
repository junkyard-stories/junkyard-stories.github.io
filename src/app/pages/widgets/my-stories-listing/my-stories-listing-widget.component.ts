import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Story } from "src/app/models";
import { StoryboardService } from "src/app/services/storyboard.service";

@Component({
  selector: 'my-stories-listing-widget',
  templateUrl: './my-stories-listing-widget.component.html',
  styles: [
    '.heading { font-size: 16px; letter-spacing: 4px; }'
  ]
})
export class MyStoriesListingWidgetComponent implements OnInit {
  @Output()
  storySelected = new EventEmitter();

  public myStories: Story[] = [];

  public constructor(protected storyboardService: StoryboardService) {
    this.myStories = storyboardService.myStories;
  }
  
  ngOnInit(): void {
    
  }

  public select(story: Story): void {
    this.storySelected.emit(story);
  }
}