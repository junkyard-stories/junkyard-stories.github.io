import { StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * `imgpop`: [value]
 * */ 
export class ImgSnippetEventHandler implements IStoryEventHandler {
  public composeEvent(line: string): StoryboardEvent[] {
    try {
      let varValue = line.split(':')[1].replace('[', '').replace(']', '').trim();

      let settings = {
        value: varValue
      };
      if (varValue) {
        return [new StoryboardEvent(StoryboardCommand.ImageSnippetShow, 1000, settings)];
      } else {
        return [new StoryboardEvent(StoryboardCommand.ImageSnippetHide, 0, settings)];
      }
      
    } catch {
      return [];
    }
  }
}