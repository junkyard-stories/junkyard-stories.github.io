import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoryEditorPageComponent } from './pages/story-editor.component';
import { NotFoundPageComponent } from './pages/not-found.component';
import { StoryboardPageComponent } from './pages/storyboard.component';
import { JunkyardPageComponent } from './pages/junkyard.component';

const routes: Routes = [
  { path: '', component: JunkyardPageComponent },
  { path: 'junkyard', component: JunkyardPageComponent },
  { path: 'storyboard/:id', component: StoryboardPageComponent },
  { path: 'story-editor', component: StoryEditorPageComponent },
 
  { path: 'not-found', component: NotFoundPageComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
