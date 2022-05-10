import { StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * [variableName]: value
 * */ 
export class AddVariableEventHandler implements IStoryEventHandler {
  public composeEvent(line: string): StoryboardEvent[] {
    try {
      let splitterIndex = line.indexOf(':');

      let varName = line.substr(1, splitterIndex - 2);
      let varValue = line.substr(splitterIndex + 1, line.length).replace('<', '').replace('>', '');
  
      let settings = {
        name: varName,
        value: varValue
      };
      return [
        new StoryboardEvent(StoryboardCommand.AddVariable, 0, settings)
      ];
    } catch {
      return [];
    }
  }
}