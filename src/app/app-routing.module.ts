import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SingleplayerComponent} from "./components/singleplayer/singleplayer.component";
import {MultiplayerComponent} from "./components/multiplayer/multiplayer.component";

const routes: Routes = [
  {
    path: 'singleplayer',
    component:SingleplayerComponent
  },
  {
    path: 'multiplayer',
    component:MultiplayerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
