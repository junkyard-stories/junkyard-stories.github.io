import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoryEventService } from 'src/app/services/story-event.service';
import { MyStoriesListingWidgetComponent } from './my-stories-listing/my-stories-listing-widget.component';
import { NavigationWidgetComponent } from './navigation/navigation-widget.component';
import { StoryEditorWidgetComponent } from './story-editor/story-editor-widget.component';
import { StoryboardWidgetComponent } from './storyboard/storyboard-widget.component';

@NgModule({
  declarations: [
    // Pipe
    // Widgets
    MyStoriesListingWidgetComponent,
    NavigationWidgetComponent,
    StoryboardWidgetComponent,
    StoryEditorWidgetComponent
  ],
  exports: [
    MyStoriesListingWidgetComponent,
    NavigationWidgetComponent,
    StoryboardWidgetComponent,
    StoryEditorWidgetComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  providers: [
    StoryEventService
  ],
})
export class WidgetsModule { }
