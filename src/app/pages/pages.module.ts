import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoryEditorPageComponent } from './story-editor.component';
import { NotFoundPageComponent } from './not-found.component';
import { StoryboardPageComponent } from './storyboard.component';
import { WidgetsModule } from './widgets/widgets.module';
import { JunkyardPageComponent } from './junkyard.component';
import { RouterModule } from '@angular/router';
import {ClipboardModule} from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    // Pages
    JunkyardPageComponent,
    StoryEditorPageComponent,
    StoryboardPageComponent,
    NotFoundPageComponent
  ],
  exports: [
    JunkyardPageComponent,
    StoryEditorPageComponent,
    StoryboardPageComponent,
    NotFoundPageComponent
  ],
  imports: [
    CommonModule,
    WidgetsModule,
    ClipboardModule,
    RouterModule
  ],
  providers: [
  ],
})
export class PagesModule { }
