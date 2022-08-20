import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MultiplayerComponent } from './components/multiplayer/multiplayer.component';
import {AppRoutingModule} from "./app-routing.module";
import {SingleplayerComponent} from "./components/singleplayer/singleplayer.component";
import { BoardComponent } from './components/board/board.component';

@NgModule({
  declarations: [
    AppComponent,
    SingleplayerComponent,
    MultiplayerComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
