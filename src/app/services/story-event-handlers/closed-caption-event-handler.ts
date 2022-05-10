import { StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * > CC: value
 * */ 
export class ClosedCaptionEventHandler implements IStoryEventHandler {
  public composeEvent(line: string): StoryboardEvent[] {
    try {
      let cc = line.substr(6, line.length).trim();
      let settings = {
        cc: cc
      };
      return [
        new StoryboardEvent(StoryboardCommand.ClosedCaptionShow, 3000, settings),
        new StoryboardEvent(StoryboardCommand.ClosedCaptionHide, 0, {})
      ];
    } catch {
      return [];
    }
  }
}