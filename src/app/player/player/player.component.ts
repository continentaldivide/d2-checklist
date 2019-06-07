
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatTabChangeEvent, MatTabGroup, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BungieService } from '../../service/bungie.service';
import { Character, Const, NameDesc, Platform, Player } from '../../service/model';
import { StorageService } from '../../service/storage.service';
import { ChildComponent } from '../../shared/child.component';

@Component({
  selector: 'anms-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent extends ChildComponent implements OnInit, OnDestroy {
  currentGt: string;
  currentPlatform: string;
  readonly TAB_URI = [
    'milestones',
    'bounties',
    'checklist',
    'progress',
    'triumphs',
    'collections',
    'chars'
  ];

  @ViewChild('maintabs') tabs: MatTabGroup;

  public const: Const = Const;
  platforms: Platform[];
  selectedPlatform: Platform;
  msg: string;
  selectedTab: string;
  gamerTag: string;
  player: Player;
  selectedTreeNodeHash: string = null;

  burns: NameDesc[] = [];
  reckBurns: NameDesc[] = [];

  constructor(public bungieService: BungieService,
    storageService: StorageService,
    private route: ActivatedRoute, private router: Router,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef) {
    super(storageService, ref);
    this.platforms = Const.PLATFORMS_ARRAY;
    this.selectedPlatform = this.platforms[0];
  }

  private setPlayer(x: Player): void {
    this.player = x;
    // too much trouble to make player an observable, just force change detection
    this.ref.markForCheck();
  }

  public branchNodeClick(hash: string): void {
    this.router.navigate([this.selectedPlatform.type, this.gamerTag, this.selectedTab, { id: hash }]);
  }

  public showBurns() {
    const dc = new MatDialogConfig();
    dc.disableClose = false;
    dc.autoFocus = true;
    dc.data = {
      burns: this.burns,
      reckBurns: this.reckBurns
    };
    const dialogRef = this.dialog.open(BurnDialogComponent, dc);
  }

  public getRaidLink(p: Player) {
    let platformstr: string;
    let memberid: string;
    if (p.profile.userInfo.membershipType === 1) {
      platformstr = 'xb';
      memberid = p.profile.userInfo.displayName;
    } else if (p.profile.userInfo.membershipType === 2) {
      platformstr = 'ps';
      memberid = p.profile.userInfo.displayName;
    } else if (p.profile.userInfo.membershipType === 4) {
      platformstr = 'pc';
      memberid = p.profile.userInfo.membershipId;
    }
    return 'http://raid.report/' + platformstr + '/' + memberid;
  }

  public getTrialsLink(p: Player) {
    let platformstr: string;
    if (p.profile.userInfo.membershipType === 1) {
      platformstr = 'xbox';
    } else if (p.profile.userInfo.membershipType === 2) {
      platformstr = 'ps';
    } else if (p.profile.userInfo.membershipType === 4) {
      platformstr = 'pc';
    }
    return 'https://trials.report/report/' + platformstr + '/' + encodeURI(this.gamerTag);
  }


  public history(c: Character) {
    this.router.navigate(['/history', c.membershipType, c.membershipId, c.characterId]);
  }

  public routeSearch(): void {

    // if route hasn't changed it won't refresh, so we have to force it
    if (this.selectedPlatform.type === +this.route.snapshot.params.platform &&
      this.gamerTag === this.route.snapshot.params.gt) {
      this.performSearch(true);
      return;
    }

    // otherwise just re-route
    if (this.gamerTag == null || this.gamerTag.trim().length < 1) {
      return;
    }
    this.router.navigate([this.selectedPlatform.type, this.gamerTag, this.selectedTab]);
  }

  public changeTab(event: MatTabChangeEvent) {
    const tabName: string = this.getTabLabel(event.index);

    if (this.selectedTab !== tabName) {

      if (this.debugmode) {
      }
      this.selectedTab = tabName;
      this.router.navigate([this.selectedPlatform.type, this.gamerTag, tabName]);
    }
  }

  private getTabLabel(index: number): string {
    if (index >= this.TAB_URI.length) { return null; }
    return this.TAB_URI[index];
  }

  private setTab(): void {
    if (this.tabs == null) {
      return;
    }
    const tab: string = this.selectedTab;
    if (tab == null) {
      return;
    }
    let cntr = 0;
    for (const label of this.TAB_URI) {
      if (tab === label) {
        this.tabs.selectedIndex = cntr;
        break;
      }
      cntr++;
    }
  }

  async loadSpider() {
    await this.bungieService.loadSpiderWeekly(this.player);
    this.ref.markForCheck();
  }

  async loadClan() {
    await this.bungieService.loadClans(this.player.profile.userInfo);
    this.ref.markForCheck();
  }

  public async performSearch(forceRefresh?: boolean): Promise<void> {
    if (this.gamerTag == null || this.gamerTag.trim().length === 0) {
      return;
    }
    this.loading.next(true);
    // set player to empty unless we're refreshing in place
    if (forceRefresh !== true) {
      this.setPlayer(null);
    }
    const p = await this.bungieService.searchPlayer(this.selectedPlatform.type, this.gamerTag);

    try {
      if (p != null) {
        const showZeroPtTriumphs = localStorage.getItem('show-zero-pt-triumphs') === 'true';
        const showInvisTriumphs = localStorage.getItem('show-invis-triumphs') === 'true';
        const x = await this.bungieService.getChars(p.membershipType, p.membershipId,
          ['Profiles', 'Characters', 'CharacterProgressions', 'CharacterActivities',
            'CharacterEquipment', 'CharacterInventories',
            'ProfileProgression', 'ItemObjectives', 'PresentationNodes', 'Records', 'Collectibles'
            // 'ItemSockets', 'ItemPlugStates',
            //  'ItemInstances'
             //'ItemPerks','ItemStats',
             //'ItemTalentGrids','ItemCommonData'
            // ,'ProfileInventories'
          ], false, false, showZeroPtTriumphs, showInvisTriumphs);
        this.setPlayer(x);
        this.loadSpider();
        this.loadClan();

        // need to get out of this change detection cycle to have tabs set
        setTimeout(() => {
          this.setTab();
        }, 0);

        this.loading.next(false);
      } else {
        this.loading.next(false);
        this.setPlayer(null);
      }
    } catch (x) {
      this.loading.next(false);

    }
  }

  async setBurns() {
    this.burns = await this.bungieService.getBurns();
    this.reckBurns = await this.bungieService.getReckBurns();
  }

  ngOnInit() {
    this.setBurns();
    this.route.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      const newPlatform: string = params['platform'];
      const newGt: string = params['gt'];
      const tab: string = params['tab'];
      this.selectedTreeNodeHash = params['id'];

      // nothing changed
      if (this.currentGt === newGt && this.currentPlatform === newPlatform) {
        return;
      }

      let oNewPlatform: Platform = null;
      let redirected = false;
      this.platforms.forEach((p: Platform) => {
        if ((p.type + '') === newPlatform) {
          oNewPlatform = p;
        } else if (p.name.toLowerCase() === newPlatform.toLowerCase()) {
          this.router.navigate([p.type, newGt, tab]);
          redirected = true;
        }
      });

      // we already redirected
      if (redirected) { return; }

      // invalid platform
      if (oNewPlatform == null) {
        this.router.navigate(['home']);
        return;
      }

      // we have a valid numeric platform, and a gamer tag, and a tab
      this.currentGt = newGt;
      this.currentPlatform = newPlatform;

      this.selectedPlatform = oNewPlatform;

      this.gamerTag = newGt;
      this.selectedTab = tab.trim().toLowerCase();

      this.performSearch();
    });



  }

  onPlatformChange() {
    this.storageService.setItem('defaultplatform', this.selectedPlatform.type);
  }
  onGtChange() {
    this.storageService.setItem('defaultgt', this.gamerTag);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

@Component({
  selector: 'anms-burn-dialog',
  templateUrl: './burn-dialog.component.html',
  styleUrls: ['./burn-dialog.component.scss']
})
export class BurnDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BurnDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
}
