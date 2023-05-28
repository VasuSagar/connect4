import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Token} from "../../enums/token";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  board = [[2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2]];
  playerColour: number = Token.Red;
  @Input() player1Name!: string;
  @Input() player2Name!: string;
  @Input() myName!: string;
  @Input() dataChannel!:RTCDataChannel;
  @Input() peerConnection!: RTCPeerConnection;

  currentPlayer!: string;
  gameWin = false;

  constructor(private cdr:ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.currentPlayer=this.player1Name;
    console.log("current player",this.currentPlayer);
    console.log("player 1 player",this.player1Name);
    console.log("player 2 player",this.player2Name);
    console.log("what is my name",this.myName);


    this.dataChannel.onerror = (error)=> {
      console.log("Error occured on datachannel:", error);
    };

    this.dataChannel.onmessage=(event)=>{
      console.log("board message", event.data);
      const y=event.data;
      for (let i = 5; i >= 0 && y < 7; i--) {
        const x = i;
        if (this.board[x][y] === Token.White) {
          this.board[x][y] = this.playerColour;
          this.cdr.detectChanges();
          this.checkWin(x, y);
          if (!this.gameWin) {
            this.togglePlayer();
          }
          this.cdr.detectChanges();
          break;
        }
      }
    };

  }

  placeToken(y: number):void {
    if(this.currentPlayer!=this.myName)
      return;
    if (this.gameWin) {
      return;
    }
    //send data to other party
    this.dataChannel.send(String(y));
    for (let i = 5; i >= 0 && y < 7; i--) {
      const x = i;
      if (this.board[x][y] === Token.White) {
        this.board[x][y] = this.playerColour;
        this.cdr.detectChanges();
        this.checkWin(x, y);
        if (!this.gameWin) {
          this.togglePlayer();
        }
        this.cdr.detectChanges();
        break;
      }
    }

  }

  togglePlayer() {
    this.playerColour = 1 - this.playerColour;
    this.currentPlayer = this.currentPlayer === this.player1Name ? this.player2Name : this.player1Name;
  }

  setTokenColour(x: number, y: number): string {
    if (this.board[x][y] === Token.Red) {
      return "red";
    } else if (this.board[x][y] === Token.Yellow) {
      return "yellow";
    } else {
      return "white";
    }
  }

  private checkWin(x: number, y: number) {
    if (!this.checkWinAadi(x)) {
      if (!this.checkWinUbhi(y)) {
        this.checkWinTrasi()
      }
    }
  }

  private checkWinAadi(x: number):boolean {
    let curr = '';
    for (let j = 0; j < 7; j++) {
      curr = curr + this.board[x][j].toString();
    }
    if (curr.includes("1111") || curr.includes("0000")) {
      this.gameWin = true;
    }
    return this.gameWin;
  }

  private checkWinUbhi(y: number):boolean {
    let curr = '';
    for (let i = 0; i < 6; i++) {
      curr = curr + this.board[i][y].toString();
    }
    if (curr.includes("0000") || curr.includes("1111")) {
      this.gameWin = true;
    }
    return this.gameWin;
  }

  private checkWinTrasi():void {
    if (!this.checkWinLeftToRightTrasi()) {
      this.checkWinRightToLeftTrasi();
    }
  }

  private checkWinLeftToRightTrasi():boolean {
    let Ylength = 6;
    let Xlength = 7;
    let maxLength = Math.max(Xlength, Ylength);
    let curr = '';
    for (var k = 0; k <= 2 * (maxLength - 1) && !this.gameWin; ++k) {
      curr = '';
      for (var y = Ylength - 1; y >= 0; --y) {
        var x = k - y;
        if (x >= 0 && x < Xlength) {
          curr = curr + this.board[y][x].toString();
        }
      }
      if (curr.includes("0000") || curr.includes("1111")) {
        this.gameWin = true;
      }
    }
    return this.gameWin;
  }

  private checkWinRightToLeftTrasi():boolean {
    var Ylength = 6;
    var Xlength = 7;
    var maxLength = Math.max(Xlength, Ylength);
    let curr = '';
    for (var k = 0; k <= 2 * (maxLength - 1) && !this.gameWin; ++k) {
      curr = '';
      for (var y = Ylength - 1; y >= 0; --y) {
        var x = k - (Ylength - y);
        if (x >= 0 && x < Xlength) {
          curr = curr + this.board[y][x].toString();
        }
      }
      if (curr.includes("0000") || curr.includes("1111")) {
        this.gameWin = true;
      }
    }
    return this.gameWin;
  }

  resetGame() {
    this.board = [[2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2]];
    this.gameWin = false;
  }
}
