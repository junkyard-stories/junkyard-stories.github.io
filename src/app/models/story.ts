export type storyState = 'draft' | 'reviewing' | 'published';
export class Story {
  public id: string = '';
  public seriesId: string = '';
  public seriesName: string = '';
  public title: string = '';
  public subtitle: string = '';
  public description: string = '';
  public cover: string = '';
  public author: string = '';
  public content: string = '';
  public casts: string[] = [];
  public tags: string[] = [];
  public likes: string = '';
  public createdOn: string = '';
  public modifiedOn: string = '';
  public state: storyState = 'draft';
}