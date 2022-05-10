import { CharPosition, StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * > E|R: value
 * */ 
export class TextEffectEventHandler implements IStoryEventHandler {
  public composeEvent(line: string): StoryboardEvent[] {
   
    try {
      let data = line.split(':');
      let info = data[0].split('|')?.[1];
      let position = 'pos-' + info;

      let value = data[1];

      let events: StoryboardEvent[] = [];
      let settings = {
        value: value,
        position: position
      };

      if (value) {
        events.push(new StoryboardEvent(StoryboardCommand.TextEffectShow, 1000, settings));
        events.push(new StoryboardEvent(StoryboardCommand.TextEffectHide, 0, settings));
      } else {
        events.push(new StoryboardEvent(StoryboardCommand.TextEffectHide, 0, settings));
      }

      return events;
    } catch {
      return [];
    }
  }
}