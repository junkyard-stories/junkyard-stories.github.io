import { CharPosition, dialogTypeList, DialogueType, StoryboardCommand, StoryboardEvent } from "src/app/models";
import { IStoryEventHandler } from "../story-event.interface";

/*** 
 * Assumes format of:
 * > L??|Name: value
 * > L?|Name: value
 * > L|Name: value
 * */ 
export class CharAddEventHandler implements IStoryEventHandler {

  public composeEvent(line: string): StoryboardEvent[] {
    try {
      let data = line.split(':');
      let info = data[0].split('|')[0];
      let position = info.toUpperCase().includes('R') ? CharPosition.Right : CharPosition.Left;
      let anonLevel = info.split('?').length;
      let id = data[0].split('|')[1]; 
      let sentences = data[1]?.match( /[^\.!\?]+[\.!\?]+/g );;

      let settings = {
        name: anonLevel === 4 || anonLevel === 2 ? '?????:' : `${id}:`,
        position: position,
        anonLevel: anonLevel,
        id: id,
        dialogue: '',
      };

      let events: StoryboardEvent[] = [new StoryboardEvent(StoryboardCommand.CharAdd, 0, settings)];

      sentences?.forEach((sentence) => {
        sentence = sentence.trim();

        let type: DialogueType = 'normal';
      
        // resolve dialog type
        dialogTypeList.forEach((dt) => {
          if (sentence.includes(`$${dt}$`)) {
            type = dt as DialogueType;
            sentence = sentence.replace(`$${dt}$`, '').trim();
          }
        });

        let settings = {
          name: anonLevel === 4 || anonLevel === 2 ? '?????:' : `${id}:`,
          position: position,
          anonLevel: anonLevel,
          id: id,
          dialogueType: type,
          dialogue: sentence.trim()
        };
        if (sentence.trim()) {
          events.push(new StoryboardEvent(StoryboardCommand.CharSpeak, 1000, settings));
        }
      });
      return events;
    } catch {
      return [];
    }
  }
}