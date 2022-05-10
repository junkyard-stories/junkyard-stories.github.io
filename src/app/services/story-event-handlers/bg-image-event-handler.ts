import { StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * `bg`: [value]
 * */ 
export class BgImageEventHandler implements IStoryEventHandler {
  public composeEvent(line: string): StoryboardEvent[] {
    try {
      let varValue = line.split(':')[1].replace('[', '').replace(']', '').trim();

      let settings = {
        value: varValue
      };
      return [
        new StoryboardEvent(StoryboardCommand.BgImageHide, 0, {}),
        new StoryboardEvent(StoryboardCommand.BgImageShow, 0, settings)
      ];
    } catch {
      return [];
    }
  }
}