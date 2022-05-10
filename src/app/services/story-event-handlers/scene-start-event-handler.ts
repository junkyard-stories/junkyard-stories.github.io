import { StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * CC: some value
 * */ 
export class SceneStartEventHandler implements IStoryEventHandler {
  public composeEvent(line: string): StoryboardEvent[] {
    try {
      let title = line.substr(4, line.length).trim();
      let settings = {
        title: title
      };
      return [
        new StoryboardEvent(StoryboardCommand.NewScene, 3000, settings),
        new StoryboardEvent(StoryboardCommand.SceneTitleHide, 0, {})
      ];
    } catch {
      return [];
    }
  }
}