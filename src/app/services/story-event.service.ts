import { Injectable } from "@angular/core";
import { StoryboardCommand, StoryboardEvent } from "../models";
import { IStoryEventHandler } from "./story-event.interface";
import { AddVariableEventHandler } from "./story-event-handlers/add-variable-event-handler";
import { BgImageEventHandler } from "./story-event-handlers/bg-image-event-handler";
import { BgMusicEventHandler } from "./story-event-handlers/bg-music-event-handler";
import { TitleEventHandler } from "./story-event-handlers/title-event-handler";
import { SceneStartEventHandler } from "./story-event-handlers/scene-start-event-handler";
import { CharAddEventHandler } from "./story-event-handlers/char-add-event-handler";
import { NarratorSpeakEventHandler } from "./story-event-handlers/narrator-speak-event-handler";
import { CoverEventHandler } from "./story-event-handlers/cover-event-handler";
import { CharRemoveEventHandler } from "./story-event-handlers/char-remove-event-handler";
import { ImgSnippetEventHandler } from "./story-event-handlers/image-snippet-event-handler";
import { TextEffectEventHandler } from "./story-event-handlers/text-effect-event-handler";
import { ClosedCaptionEventHandler } from "./story-event-handlers/closed-caption-event-handler";

@Injectable()
export class StoryEventService {
  private eventHandlerMap: Map<StoryboardCommand, IStoryEventHandler> = new Map([
    [StoryboardCommand.AddVariable, new AddVariableEventHandler],
    [StoryboardCommand.BgImageShow, new BgImageEventHandler],
    [StoryboardCommand.BgMusicPlay, new BgMusicEventHandler],
    [StoryboardCommand.ImageSnippetShow, new ImgSnippetEventHandler],
    [StoryboardCommand.TitleShow, new TitleEventHandler],
    [StoryboardCommand.NewScene, new SceneStartEventHandler],
    [StoryboardCommand.CharAdd, new CharAddEventHandler],
    [StoryboardCommand.CharRemove, new CharRemoveEventHandler],
    [StoryboardCommand.NarratorSpeak, new NarratorSpeakEventHandler],
    [StoryboardCommand.SplashShow, new CoverEventHandler],
    [StoryboardCommand.TextEffectShow, new TextEffectEventHandler],
    [StoryboardCommand.ClosedCaptionShow, new ClosedCaptionEventHandler],
  ]);
  
  public getStoryEventCommand(line: string): StoryboardEvent[] {
    let commandType: StoryboardCommand = this.getCommandType(line);
    return this.eventHandlerMap.get(commandType)?.composeEvent(line) || [];
  }

  private getCommandType(line: string): StoryboardCommand {
    // Narration
    if (line.indexOf('> N') === 0 && line.length > 4) {
      return StoryboardCommand.NarratorSpeak;
    }

    // Closed Caption
    else if (line.indexOf('> CC') === 0 && line.length > 5) {
      return StoryboardCommand.ClosedCaptionShow;
    }

    // Text Effect
    else if (line.indexOf('> E') === 0 && line.length > 4) {
      return StoryboardCommand.TextEffectShow;
    }

    // Dialogue
    else if ((line.indexOf('> L') === 0 || line.indexOf('> R') === 0)&& line.length > 4) {
      return StoryboardCommand.CharAdd;
    }

    // Remove Character
    else if (line.indexOf('> X') === 0 && line.length > 4) {
      return StoryboardCommand.CharRemove;
    }

    // BG Image
    else if (line.indexOf('`bg`:') === 0) {
      return StoryboardCommand.BgImageShow;
    }

    // BG Music
    else if (line.indexOf('`bgm`:') === 0) {
      return StoryboardCommand.BgMusicPlay;
    }

    // Sound Clip
    else if (line.indexOf('`soundclip`:') === 0) {
      return StoryboardCommand.BgMusicPlay;
    }

    // Image Snippet
    else if (line.indexOf('`imgpop`:') === 0) {
      return StoryboardCommand.ImageSnippetShow;
    }

    // BG Image
    else if (line.indexOf('`cover`:') === 0) {
      return StoryboardCommand.SplashShow;
    }

    // Variables
    else if (line.indexOf('[') === 0 && line.indexOf(']:') > 1) {
      return StoryboardCommand.AddVariable;
    }

    // Title
    else if (line.indexOf('# ') === 0) {
      return StoryboardCommand.TitleShow;
    }

    // Scene
    else if (line.indexOf('### ') === 0) {
      return StoryboardCommand.NewScene;
    }

    return StoryboardCommand.None;
  }
}