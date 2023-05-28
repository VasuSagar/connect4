import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SingleplayerComponent} from "./components/singleplayer/singleplayer.component";
import {MultiplayerComponent} from "./components/multiplayer/multiplayer.component";
import {ChatComponent} from "./components/chat/chat.component";
import {HomeComponent} from "./components/home/home.component";

const routes: Routes = [
  {
    path: 'home',
    component:HomeComponent
  },
  {
    path: 'singleplayer',
    component:SingleplayerComponent
  },
  {
    path: 'multiplayer',
    component:ChatComponent
  },
  {
    path:'chat',
    component:ChatComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
