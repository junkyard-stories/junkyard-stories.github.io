import { StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * `bgm`: [value]
 * */ 
export class BgMusicEventHandler implements IStoryEventHandler {
  public composeEvent(line: string): StoryboardEvent[] {
    try {
      let varValue = line.split(':')[1].replace('[', '').replace(']', '').trim();

      let settings = {
        value: varValue,
        loop: line.split(':')[0].trim().includes('bgm')
      };

      let events: StoryboardEvent[] = [];
      if (varValue) {
        events.push(new StoryboardEvent(StoryboardCommand.BgMusicPlay, 0, settings));
      } else {
        events.push(new StoryboardEvent(StoryboardCommand.BgMusicStop, 0, settings));
      }
      return events;
    } catch {
      return [];
    }
  }
}