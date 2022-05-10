import { StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * > X|Name: value
 * */ 
export class CharRemoveEventHandler implements IStoryEventHandler {
  public composeEvent(line: string): StoryboardEvent[] {
    try {
      let data = line.split('|');

      let id = data[1] ; 

      let settings = {
        name: id,
        id: id
      };

      let events: StoryboardEvent[] = [new StoryboardEvent(StoryboardCommand.CharRemove, 0, settings)];

      return events;
    } catch {
      return [];
    }
  }
}