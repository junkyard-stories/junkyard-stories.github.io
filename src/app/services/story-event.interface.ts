import { StoryboardEvent } from "../models";

export interface IStoryEventHandler {
  composeEvent(value: string): StoryboardEvent[];
}