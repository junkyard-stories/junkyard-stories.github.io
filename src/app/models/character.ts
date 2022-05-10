export enum CharPosition {
  None,
  Left,
  Right
}

export type DialogueType = 
    'normal' 
  | 'serious' 
  | 'angry' 
  | 'scared' 
  | 'whisper' 
  | 'creepy'
  | 'redacted';

export const dialogTypeList: string[] = 
  [ 'serious', 
    'angry',
    'scared',
    'whisper', 
    'creepy',
    'redacted'
  ];

export class Character {
  public constructor(char: {
    id: string;
    name: string;
    tokenId: number;
    imageUrl: string;
    position: CharPosition;
    dialogue: string;
    dialogueType: DialogueType;
    anonLevel: number;
  }) {
    this.id = char.id;
    this.name = char.name;
    this.tokenId = char.tokenId;
    this.imageUrl = char.imageUrl;
    this.position = char.position;
    this.dialogue = char.dialogue;
    this.anonLevel = char.anonLevel;
  }

  public id: string = '';
  public name: string = '';
  public tokenId: number = 0;
  public imageUrl: string = '';
  public position: CharPosition = CharPosition.None;
  public dialogue: string = '';
  public dialogueType: DialogueType = 'normal';
  public anonLevel: number = 0;

}