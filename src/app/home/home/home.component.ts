import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { ANIMATE_ON_ROUTE_ENTER } from '../../animations/router.transition';
import { SearchResult, BungieService, Platform } from "../../service/bungie.service";
import { Player } from "../../service/parse.service";
import { StorageService } from '../../service/storage.service';

@Component({
  selector: 'anms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  animateOnRouteEnter = ANIMATE_ON_ROUTE_ENTER;

  private unsubscribe$: Subject<void> = new Subject<void>();

  platforms: Platform[];
  selectedPlatform: Platform;
  gamerTag: string;
  loading: boolean = false;

  player: Player;

  constructor(private bungieService: BungieService, private storageService: StorageService) {
    this.platforms = bungieService.getPlatforms();
    this.selectedPlatform = this.platforms[0];


    this.storageService.settingFeed
      .takeUntil(this.unsubscribe$)
      .subscribe(
      x => {
        if (x.defaultplatform != null) {
          this.setPlatform(x.defaultplatform);
        }
      });
    this.storageService.refresh();

  }

  private setPlatform(type: number) {
    //already set
    if (this.selectedPlatform != null && this.selectedPlatform.type === type) return;

    this.platforms.forEach((p: Platform) => {
      if (p.type === type) {
        this.selectedPlatform = p;
      }
    });
  }

  public searchPlayer(): void {
    if (this.selectedPlatform == null) {
      console.log("1");
      return;
    }
    if (this.gamerTag == null || this.gamerTag.trim().length < 1) {
      console.log("2");
      return;
    }
    this.loading = true;
    this.bungieService.searchPlayer(this.selectedPlatform.type, this.gamerTag)
      .then((p: SearchResult) => {
        if (p != null) {
          this.bungieService.getChars(p).then((x: Player) => {
            this.player = x;
            console.log("Loaded chars");
            this.loading = false;
          })
        }
      })
      .catch((x) => {
        this.loading = false;
      });
  }

  onPlatformChange() {
    this.storageService.setItem("defaultplatform", this.selectedPlatform.type);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
