import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MultiplayerComponent } from './components/multiplayer/multiplayer.component';
import {AppRoutingModule} from "./app-routing.module";
import {SingleplayerComponent} from "./components/singleplayer/singleplayer.component";
import { BoardComponent } from './components/board/board.component';
import {FormsModule} from "@angular/forms";
import { ChatComponent } from './components/chat/chat.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    SingleplayerComponent,
    MultiplayerComponent,
    BoardComponent,
    ChatComponent,
    HomeComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
