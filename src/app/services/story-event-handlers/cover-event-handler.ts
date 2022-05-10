import { StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * `cover`: [value]
 * */ 
export class CoverEventHandler implements IStoryEventHandler {
  public composeEvent(line: string): StoryboardEvent[] {
    try {
      let varValue = line.split(':')[1].replace('[', '').replace(']', '').trim();

      let settings = {
        value: varValue
      };
      return [
        new StoryboardEvent(StoryboardCommand.BgImageShow, 5000, settings)
      ];
    } catch {
      return [];
    }
  }
}