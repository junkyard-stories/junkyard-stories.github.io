export enum StoryboardCommand {
  None,
  Wait,
  AddVariable,
  SplashShow,
  TitleShow,
  TitleHide,
  ClosedCaptionShow,
  ClosedCaptionHide,
  NewScene,
  SceneTitleHide,
  BgImageShow,
  BgImageHide,
  BgEffectsPlay,
  BgEffectsStop,
  BgMusicPlay,
  BgMusicPause,
  BgMusicStop,
  SoundEffectsShow,
  SoundEffectsHide,
  SoundEffectsPlay,
  SoundEffectsPause,
  SoundEffectsStop,
  CharAdd,
  CharRemove,
  CharSpeak,
  CharShutup,
  CharEffectsPlay,
  CharEffectsStop,
  NarratorSpeak,
  ImageSnippetShow,
  ImageSnippetHide,
  TextEffectShow,
  TextEffectHide,
  DubbingPlay
}

export class StoryboardEvent {

  public constructor(_commandType: StoryboardCommand, _waitAfterInMs: number, _settings: object) {
    this.commandType = _commandType;
    this.settings = _settings;
    this.waitAfterInMs = _waitAfterInMs;
  }

  public commandType: StoryboardCommand = StoryboardCommand.None;
  public waitAfterInMs: number = 1000;
  public settings: any;
}