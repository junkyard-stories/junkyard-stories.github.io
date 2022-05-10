import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Junky, Story } from '../models';
import { StoryboardService } from '../services/storyboard.service';

@Component({
  selector: 'junkyard',
  templateUrl: './junkyard.component.html',
  styleUrls: ['./junkyard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JunkyardPageComponent implements OnInit {

  public publishedStories: Story[] = [];
  public junkies: Junky[] = [];

  constructor(public storyboardService: StoryboardService) {
    this.storyboardService.getJunkies().subscribe(data => {
      this.junkies = JSON.parse(JSON.stringify(data));
    });
  }

  public ngOnInit(): void {
    this.storyboardService.getStories().subscribe(data => {
      this.publishedStories = JSON.parse(JSON.stringify(data));
    });
  }

  public getJunkieAvatar(id: string): string {
    let hash = this.junkies[parseInt(id)].hash;
    return `https://static.shinji.xyz/unit-00/nft-images/${hash}.png`;
  }
}
