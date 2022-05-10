import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import {Clipboard} from '@angular/cdk/clipboard';
import { Story } from "src/app/models";
import { StoryboardService } from "src/app/services/storyboard.service";

@Component({
  selector: 'story-editor-widget',
  templateUrl: './story-editor-widget.component.html',
  styles: [
    'button { font-family: "Bangers"; letter-spacing: 4px; }',
    'input { font-size: 16px; font-family: "Inconsolata"; }',
    '.hidden { display: none; }',
    '.screenplay-controls button { font-family: "Verdana"; letter-spacing: 1px; }',
    '.screenplay-controls { display: inline-block; }',
    '.screenplay-controls .control { display: inline-block; margin-bottom: 5px; }'
  ]
})
export class StoryEditorWidgetComponent {
  @ViewChild('contentTextArea', { static: false }) public contentTextArea!: ElementRef;

  @Output()
  playStory = new EventEmitter();

  @Input()
  public set story(value: Story | null) {
    if (value === null) { return; }

    this._story = new Story();
    this._story.id = value.id;
    this._story.title = value.title;
    this._story.subtitle = value.subtitle;
    this._story.author = value.author;
    this._story.cover = value.cover;
    this._story.casts = value.casts;
    this._story.tags = value.tags;
    this._story.content = value.content;
    this._story.modifiedOn = value.modifiedOn;
    this._story.createdOn = value.createdOn;

    this.isSavingSuccess = false;
  }
  public get story(): Story {
    return this._story;
  }

  public isSavingSuccess: boolean = false;
  public isExportSuccess: boolean = false;
  
  private _story: Story = new Story;

  public constructor(private clipboard: Clipboard, protected storyboardService: StoryboardService) {
  }

  public save(): void {
    this.storyboardService.saveStoryDraft(this.story);
    this.isSavingSuccess = true;
  }

  public play(): void {
    this.playStory.next(this.story);
  }

  public cancel(): void {
    window.location.reload();
  } 

  public delete(): void {
    if (window.confirm("Do you really want to delete this story?")) {
      this.storyboardService.deleteStoryDraft(this.story);
      this.cancel();
    }
  }

  public export(): void {
    let copy: Story = JSON.parse(JSON.stringify(this.story));
    copy.casts = (copy.casts).toString().split(' ');
    copy.tags = (copy.tags).toString().split(' ');
    this.clipboard.copy(JSON.stringify(copy));
    this.isExportSuccess = true;
  }

  public canDelete(): boolean {
    return this.story.id !== '';
  }

  public isValid(): boolean {
    return this.story.title !== '' 
    && this.story.author !== '' 
    && this.story.cover !== '' 
    && this.story.content !== '';
  }

  public insert(param: string) {
    console.log(this.story.content);
    let insertThis = '';
    switch (param) {
      case 'char':
        insertThis = '[John]: 9000';
        break;
      case 'file':
        insertThis = '[file_name]: <url>';
        break;
      case 'narrate':
        insertThis = '> N: Hello.';
        break;
      case 'cc':
        insertThis = '> CC: Hello.';
        break;
      case 'speak':
        insertThis = '> R|John: Hello.';
        break;
      case 'soundtext':
        insertThis = '> E|5: Krakoom!';
        break;
      case 'cover':
        insertThis = '`cover`: [file_name]';
        break;
      case 'bg':
        insertThis = '`bg`: [file_name]';
        break;
      case 'bgm':
        insertThis = '`bgm`: [file_name]';
        break;
      case 'soundclip':
        insertThis = '`soundclip`: [file_name]';
        break;
      case 'imgpop':
        insertThis = '`imgpop`: [file_name]';
        break;
      case 'template':
        insertThis = `[bg_cover]: <https://hdwallpaperim.com/wp-content/uploads/2017/08/24/110153-Silent_Hill_HD_Collection.jpg>
[bg_road]: <https://wallpapercave.com/wp/R3CF5u0.jpg>

[bgm_haunting]: <https://freesound.org/data/previews/133/133716_1173265-lq.mp3>
[se_steps]: <https://freesound.org/data/previews/165/165181_3000652-lq.mp3>

[silhouette]: <http://getdrawings.com/img/male-silhouette-png-31.png>
[Harry]: 7104
[Freddy]: 5426

\`cover\`: [bg_cover]
# Silent Hill
\`soundclip\`: [se_steps]
\`bg\`: #000
\`bgm\`: [bgm_haunting]
> N: After waking up from the accident Harry found himself in an unknown town. 
### The Town
\`bg\`: [bg_road]
> R|Harry: Where am I? Is this the real life? Or is this just fantasy? Caught in the landslide. No escape from reality.

> CC: walking slowly towards the town
> E|9: EEEEE-OH!
> E|8: E-OH!
> E|7: EEE-EEE-OH!
\`imgpop\`: [silhouette]
> CC: a creepy man appeared from the dark
> L???|Freddy: $creepy$Mama. $creepy$Just killed a man. 
> L?|Freddy: $creepy$Put a gun against his head. $creepy$Pulled my trigger now dead!
> R|Harry: Who are you?
> L|Freddy: $creepy$Mercury.
> CC: the creepy man moonwalks back into the dark
> L??|Freddy: $creepy$ Freddy Mercury.
> N: To be continued...
        `;
        break;
    }
    let textArea = this.contentTextArea.nativeElement;
    var startPos = textArea.selectionStart;
        var endPos = textArea.selectionEnd;
        textArea.value = textArea.value.substring(0, startPos)
            + insertThis
            + textArea.value.substring(endPos, textArea.value.length);
  }
}