import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Junky } from "../models";
import { StoryboardService } from "../services/storyboard.service";

@Component({
  selector: 'storyboard',
  templateUrl: './storyboard.component.html',
  styleUrls: ['./storyboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StoryboardPageComponent implements OnInit {
  public storyId: string = '';
  public rawStory$: Subject<string> = new Subject<string>();
  public junkies$: Subject<Junky[]> = new Subject<Junky[]>();
  private isLocalData: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private storyboardService: StoryboardService) {
  }

  public ngOnInit(): void {
    this.storyboardService.getJunkies().subscribe(data => {
      this.junkies$.next(JSON.parse(JSON.stringify(data)));
    });

    this.route.params.subscribe(param => {
      this.storyId = param['id'];
      this.loadStory(this.storyId);
    });
  }

  private loadStory(id: string): void {
    this.isLocalData = false;
    this.storyboardService.getRawStory(id)
    .pipe(
      catchError((e: any) =>{
        this.tryLoadFromLocal(id);
        return throwError(e);
      }),
    )
    .subscribe(data => {
      this.rawStory$.next(data.toString());
    });
  }

  private tryLoadFromLocal(id: string): void {
    let content = localStorage.getItem(`junkyardStories.local.${id}`) || '';
    if (content === '') {
      this.storyEnded();
      return;
    }
    this.isLocalData = true;
    this.rawStory$.next(content);
  }

  public storyEnded(): void {
    if (this.isLocalData) {
      window.close();
    } else {
      this.router.navigateByUrl('/');
    }
  }
}