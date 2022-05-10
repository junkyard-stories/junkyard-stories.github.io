import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { Character, CharPosition, Junky, Queue, StoryboardCommand, StoryboardEvent } from "src/app/models";
import { StoryboardState } from "src/app/models/story-state";
import { StoryEventService } from "src/app/services/story-event.service";

const cyrb53 = function(str: any, seed = 0) {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
  h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1>>>0);
};

@Component({
  selector: 'storyboard-widget',
  templateUrl: './storyboard-widget.component.html',
  styleUrls: ['./storyboard-widget.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StoryboardWidgetComponent {
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.processing && event.key === 'Enter') {
      this.storyEnded.emit();
    } else if (!this.processing) {
      this.processNextEvent();
    }
  }

  @Output()
  storyEnded = new EventEmitter();

  @ViewChild('bgmPlayer', { static: false }) public bgmPlayer!: ElementRef<HTMLAudioElement>;
  @ViewChild('audioPlayer', { static: false }) public audioPlayer!: ElementRef<HTMLAudioElement>;
  
  @Input()
  public set rawStory(value: string | null) {
    if (value === null) { return; }
    
    this._rawStory = value;
    this.state.hash = cyrb53(value);
    this.storyboardEvents = this.getEvents(value);

    // Reset
    this.reset();
 
    this.processNextEvent();
  }
  public get rawStory(): string {
    return this._rawStory;
  }
  private _rawStory: string = '';

  @Input()
  public set junkies(value: Junky[] | null) {
    if (value === null) { return; }
    this._junkies = value;
  }
  public get junkies(): Junky[] {
    return this._junkies;
  }
  private _junkies: Junky[] = [];

  protected storyboardEvents: Queue<StoryboardEvent> = new Queue<StoryboardEvent>();

  public title: string = '';
  public subtitle: string = '';
  public showTitlePanel: boolean = false;
  public scenetitle: string = '';
  public showScenePanel: boolean = false;
  public closedcaption: string = '';
  
  public imgSnippet: string = '';
  public bgm: string = '';
  public audio: string = '';
  public txtEffect: string = '';
  public txtEffectPos: string = '';

  public narration: string = '';
  public leftName: string = '';
  public leftDialogue: string = '';
  public rightName: string = '';
  public rightDialogue: string = '';

  public customBackgroundStyle: string = '';
  public charCache: Character[] = [];
  public lCharCache: Character[] = [];
  public rCharCache: Character[] = [];
  public bgImage: string = ``;
  protected state: StoryboardState = new StoryboardState();
  private processing: boolean = false;

  constructor(protected storyEventService: StoryEventService) {
  }

  private getEvents(story: string): Queue<StoryboardEvent> {
    let events: Queue<StoryboardEvent> = new Queue<StoryboardEvent>();
    let lines = story.split(/[\r\n]+/);
    lines.forEach((line) => {
      this.storyEventService.getStoryEventCommand(line).forEach((event) => {
        events.enqueue(event);
      })
    });

    return events;
  }

  public processNextEvent() {
    if (this.processing) return;

    while(this.storyboardEvents.size() > 0) {
      this.processing = true;
      let event = this.storyboardEvents.dequeue();
      if (event) {
        this.processEvent(event);
        if (event.waitAfterInMs > 0) {
          this.processing = false;
          break;
        }
      }
    }

    if (this.storyboardEvents.size() === 0) {
      this.storyEnded.emit();
    }
  }

  public processEvent(event: StoryboardEvent) {
    console.log(`Processing ${StoryboardCommand[event.commandType]}`)
    switch (event?.commandType) {
      case StoryboardCommand.AddVariable:
        this.addVariable(event);
        break;
      case StoryboardCommand.BgImageShow:
        this.showBgImage(event);
        break;
      case StoryboardCommand.ImageSnippetShow:
        this.imageSnippetShow(event);
        break;
      case StoryboardCommand.ImageSnippetHide:
        this.imageSnippetHide();
        break;
      case StoryboardCommand.TextEffectShow:
        this.textEffectShow(event);
        break;
      case StoryboardCommand.TextEffectHide:
        this.textEffectHide();
        break;
      case StoryboardCommand.BgMusicPlay:
        this.bgMusicPlay(event);
        break;
      case StoryboardCommand.BgMusicStop:
        this.bgMusicStop();
        break;
      case StoryboardCommand.TitleShow:
        this.showTitle(event);
        break;
      case StoryboardCommand.TitleHide:
        this.hideTitle();
        break;
      case StoryboardCommand.ClosedCaptionShow:
        this.showClosedCaption(event);
        break;
      case StoryboardCommand.ClosedCaptionHide:
        this.hideClosedCaption();
        break;
      case StoryboardCommand.NewScene:
        this.newScene(event);
        break;
      case StoryboardCommand.SceneTitleHide:
        this.hideSceneTitle();
        break;
      case StoryboardCommand.NarratorSpeak:
        this.narratorSpeak(event);
        break;
      case StoryboardCommand.ClosedCaptionShow:
        this.showClosedCaption(event);
        break;
      case StoryboardCommand.CharAdd:
        this.characterAdd(event);
        break;
      case StoryboardCommand.CharRemove:
        this.characterRemove(event);
        break;
      case StoryboardCommand.CharSpeak:
        this.characterSpeak(event);
        break;
    }
  }

  private addVariable(event: StoryboardEvent): void {
    this.state.variables.set(event.settings['name'], event.settings['value'].trim());
  }

  private showBgImage(event: StoryboardEvent): void {
    let bg = this.state.variables.get(event.settings['value']);

    if (/^#([0-9A-F]{3}){1,2}$/i.test(event.settings['value'])) {
      this.customBackgroundStyle = `background-color: ${event.settings['value']}`;
    } else if (bg !== undefined){
      this.customBackgroundStyle = `background-image: url(${bg})`; 
    } else {
      this.customBackgroundStyle = `background-color: #333333`;
    }
  }

  private imageSnippetShow(event: StoryboardEvent): void {
    let image = this.state.variables.get(event.settings['value']);

    this.imgSnippet = image; 
  }

  private imageSnippetHide(): void {
    this.imgSnippet = ''; 
  }

  private textEffectShow(event: StoryboardEvent): void {
    this.txtEffect = event.settings['value'];
    this.txtEffectPos = event.settings['position'];
  }

  private textEffectHide(): void {
    this.txtEffect = '';
  }

  private bgMusicPlay(event: StoryboardEvent): void {
    
    let sound = this.state.variables.get(event.settings['value']);

    if (event.settings['loop']) {
      this.bgm = sound;
      this.bgmPlayer.nativeElement.load();
      this.bgmPlayer.nativeElement.loop = true;
      this.bgmPlayer.nativeElement.play();
    } else {
      this.audio = sound;
      this.audioPlayer.nativeElement.load();
      this.audioPlayer.nativeElement.loop = false;
      this.audioPlayer.nativeElement.play();
    }
  }

  private bgMusicStop(): void {
    this.bgm = ''; 
    this.bgmPlayer.nativeElement.pause();
  }

  private showTitle(event: StoryboardEvent): void {
    this.title = event.settings['title'];
    this.subtitle = event.settings['subtitle'];
    this.showTitlePanel = true;
  }

  private hideTitle(): void {
    this.showTitlePanel = false;
  }

  private showClosedCaption(event: StoryboardEvent): void {
    this.closedcaption = event.settings['cc'];
  }

  private hideClosedCaption(): void {
    this.closedcaption = '';
  }

  private newScene(event: StoryboardEvent): void {
    this.charCache = [];
    this.scenetitle = event.settings['title'];
    this.showScenePanel = true;
  }

  private hideSceneTitle(): void {
    this.scenetitle = '';
    this.showScenePanel = false;
  }

  private narratorSpeak(event: StoryboardEvent): void {
    this.narration = event.settings['dialogue'];
  }

  private characterAdd(event: StoryboardEvent): void {
    let id = event.settings['id'];
    if (this.state.variables.get(event.settings['id']) === undefined) {
      alert(`You forgot to define: ${event.settings['id']}`)
      return;
    }

    let tokenId = Number.parseInt(this.state.variables.get(event.settings['id']));
    
    let anonLevel = event.settings['anonLevel'];
    let existingChar = this.charCache.find((char) => char.id === id);
    if (existingChar) {
      return;
    }

    this.charCache.push(new Character({
      id: id,
      name: '',
      tokenId: tokenId,
      imageUrl: anonLevel <= 2 ? `https://static.shinji.xyz/unit-00/nft-images/${this.junkies[tokenId].hash}.png` : 'assets/images/silhouette-20.png',
      position: event.settings['position'],
      anonLevel: anonLevel,
      dialogue: event.settings['dialogue'],
      dialogueType: event.settings['dialogueType']
    }));
    
    this.updateStage();
  }

  private characterRemove(event: StoryboardEvent): void {
    if (!event.settings['id']) {
      this.charCache = [];
    } else {
      let index = this.charCache.findIndex((char) => char.id === event.settings['id']);
      this.charCache.splice(index, 1);
    }

    this.updateStage();
  }

  private characterSpeak(event: StoryboardEvent): void {
    let id = event.settings['id'];
    let anonLevel = event.settings['anonLevel'];
    let talkingCharIndex = this.charCache.findIndex((char) => char.id === id);
    
    if (talkingCharIndex >= 0) {
      let talkingChar: Character = this.charCache[talkingCharIndex];
      talkingChar.name = event.settings['name'];
      talkingChar.imageUrl = anonLevel < 3 ? `https://static.shinji.xyz/unit-00/nft-images/${this.junkies[talkingChar.tokenId].hash}.png` : 'assets/images/silhouette-20.png',
      talkingChar.dialogue = event.settings['dialogue'];
      talkingChar.dialogueType = event.settings['dialogueType'];

      let mainIndex = talkingChar.position === CharPosition.Left 
        ? this.charCache.findIndex((char) => char.position === CharPosition.Left) 
        : this.charCache.findIndex((char) => char.position === CharPosition.Right);
      
      [this.charCache[mainIndex], this.charCache[talkingCharIndex]] = [this.charCache[talkingCharIndex], this.charCache[mainIndex]];

      //Reposition
      this.updateStage();
    }
  }

  private updateStage() {
    this.lCharCache = this.charCache.filter((char) => char.position === CharPosition.Left);
    this.rCharCache = this.charCache.filter((char) => char.position === CharPosition.Right);
  }

  private reset(): void {
    this.charCache = [];
    this.hideTitle();
    this.hideSceneTitle();
    this.textEffectHide();
    this.imageSnippetHide();
    this.updateStage();
  }
}
