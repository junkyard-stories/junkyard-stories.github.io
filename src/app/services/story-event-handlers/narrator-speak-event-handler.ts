import { StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * > N: value
 * */ 
export class NarratorSpeakEventHandler implements IStoryEventHandler {
  public composeEvent(line: string): StoryboardEvent[] {
    try {
      let data = line.split(':');
      let sentences = data[1]?.match( /[^\.!\?]+[\.!\?]+/g );
      
      let events: StoryboardEvent[] = [];

      sentences?.forEach((sentence) => {
        let settings = {
          dialogue: sentence.trim()
        };
        if (sentence.trim()) {
          events.push(new StoryboardEvent(StoryboardCommand.NarratorSpeak, 1000, settings));
        }
      });

      let settings = {
        dialogue: ''
      };

      events.push(new StoryboardEvent(StoryboardCommand.NarratorSpeak, 0, settings));

      return events;
    } catch {
      return [];
    }
  }
}