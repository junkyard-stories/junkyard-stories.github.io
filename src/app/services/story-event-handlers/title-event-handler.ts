import { StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * # title (subtitle)
 * */ 
export class TitleEventHandler implements IStoryEventHandler {
  public composeEvent(line: string): StoryboardEvent[] {
    try {
      let hasSubTitle = line.indexOf('(') > 1 && line.indexOf(')') > line.indexOf('(');

      let title = line.substr(2, hasSubTitle ? line.indexOf('(') -2 : line.length - 2).trim();
      let settings = {
        title: title,
        subtitle: hasSubTitle ? line.substring(line.indexOf('(') + 1,  line.indexOf(')')).trim() : ''
      };
      return [
        new StoryboardEvent(StoryboardCommand.TitleShow, 4000, settings),
        new StoryboardEvent(StoryboardCommand.TitleHide, 0, {})
      ];
    } catch {
      return [];
    }
  }
}