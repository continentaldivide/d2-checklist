import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { PlayerComponent } from './player';
import { AuthComponent } from './auth';
import { HistoryComponent } from './history';
import { PGCRComponent } from './pgcr';
import { AboutComponent } from './about';
import { SettingsComponent } from './settings';
import { BungieSearchComponent } from './bungie-search';
import { ClanComponent } from './clan';
import { ClanLeaderboardComponent } from './clanleaderboard';
import { LeviathanComponent, LeviathanPrestigeComponent } from './leaderboard';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { DestinyCacheService} from './service/destiny-cache.service';
import { Subject } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  public loader$ = new Subject<boolean>();

  constructor(private destinyCacheService: DestinyCacheService) {
  }

  canActivate(): Promise<boolean> {
    this.loader$.next(true);
    // return Promise.resolve(false);
    return this.destinyCacheService.init().then(val => {
      this.loader$.next(false);
      return val;
    });
  }
}

@NgModule({
  imports: [RouterModule.forRoot(
    [{
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
      , {
        path: 'home',
        canActivate: [AuthGuard],
        component: HomeComponent
      },
      {
        path: 'auth',
        component: AuthComponent
      },

      {
        path: 'settings',
        component: SettingsComponent
      }, {
        path: 'about',
        component: AboutComponent
      }, {
        path: 'search',
        canActivate: [AuthGuard],
        component: BungieSearchComponent
      }
      , {
        path: 'search/:name',
        canActivate: [AuthGuard],
        component: BungieSearchComponent
      }
      , {
        path: 'clan/:id',
        canActivate: [AuthGuard],
        component: ClanComponent
      },
      {
        path: 'clan/:id/leaderboard',
        canActivate: [AuthGuard],
        component: ClanLeaderboardComponent
      },
      {
        path: 'leaderboard/leviathan',
        component: LeviathanComponent
      },
      {
        path: 'leaderboard/leviathan/:name',
        component: LeviathanComponent
      },
      {
        path: 'leaderboard/leviathan-prestige',
        component: LeviathanPrestigeComponent
      },
      {
        path: 'leaderboard/leviathan-prestige/:name',
        component: LeviathanPrestigeComponent
      },
      {
        path: 'leaderboard',
        redirectTo: 'leaderboard/leviathan-prestige'
      },
      {
        path: 'pgcr/:instanceId',
        canActivate: [AuthGuard],
        component: PGCRComponent
      },
      {
        path: ':platform/:gt',
        canActivate: [AuthGuard],
        redirectTo: ':platform/:gt/checklist'
      },
      {
        path: ':platform/:gt/:tab',
        canActivate: [AuthGuard],
        component: PlayerComponent
      },
      {
        path: 'history/:platform/:memberId/:characterId',
        canActivate: [AuthGuard],
        component: HistoryComponent
      }
      , {
        path: '**',
        redirectTo: 'home'
      }
    ], { useHash: false })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
