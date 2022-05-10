import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Story } from "../models";

@Injectable()
export class StoryboardService {
  public myStories: Story[] = [];

  public publishedStories: Story[] = [];

  public constructor(private http: HttpClient) {
    this.getMyStories();
  }

  public getStories(): Observable<Object> {
    return this.http.get('assets/stories.json');
  }

  public getRawStory(storyId: string): Observable<string> {
    return this.http.get(`assets/stories/${storyId}.md`, {responseType: 'text'});
  }

  public getJunkies(): Observable<Object> {
    return this.http.get('assets/junkies.json');
  }

  public saveStoryDraft(story: Story): void {
    let today = new Date();
    let now = today.toDateString() + ' ' + today.toLocaleTimeString(); 
    let isNew = story.id === '';

    if (isNew) {
      story.id = today.toJSON();
      story.createdOn = now;
      this.myStories.push(story);
      localStorage.setItem(`junkyardStories.local.${story.id}`, story.content);
    } else {
      story.modifiedOn = now;
      let index = this.myStories.findIndex((s) => s.id === story.id);
      this.myStories[index] = story;
      this.myStories.find((s) => s.id === story.id)
      localStorage.setItem(`junkyardStories.local.${story.id}`, story.content);
    }

    this.updateMyStories(); 
  }

  public getMyStories(): void {
    let storageData = localStorage.getItem('junkyardStories.local.myStories')?.toString();
    let stories: Story[] = JSON.parse(storageData || '[]');
    stories.forEach(story => {
      story.content = localStorage.getItem(`junkyardStories.local.${story.id}`) || '';
    }); 
    this.myStories = stories;
  }

  public deleteStoryDraft(story: Story): void {
    let index = this.myStories.indexOf(story);
    this.myStories.splice(index, 1);
    this.updateMyStories(); 
  }

  private updateMyStories(): void {
    let stories: Story[]  = [];
    this.myStories.forEach(myStory => {
      stories.push({
        id: myStory.id,
        seriesId: myStory.seriesId,
        seriesName: myStory.seriesName,
        title: myStory.title,
        subtitle: myStory.subtitle,
        cover: myStory.cover,
        description: myStory.description,
        author: myStory.author,
        content: '',
        casts: myStory.casts,
        tags: myStory.tags,
        likes: myStory.likes,
        modifiedOn: myStory.modifiedOn,
        createdOn: myStory.createdOn,
        state: myStory.state,
      });
    });

    localStorage.setItem('junkyardStories.local.myStories', JSON.stringify(stories));
  }
}