import {Component, Input, OnInit} from '@angular/core';
import {GameService} from "../../services/game.service";

@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.css']
})
export class MultiplayerComponent implements OnInit {
  @Input() dataChannel!:RTCDataChannel;
  @Input() peerConnection!: RTCPeerConnection;
  @Input() currentUserName!:string;
  @Input() userName!:string;
  @Input() amIReceiver!:boolean;

  myName!:string;

  messageText='';

  constructor() { }


  ngOnInit(): void {
    console.log("userName",this.userName);
    console.log("currentUserName",this.currentUserName);
    console.log("amIReceiver",this.amIReceiver);

    this.myName=this.userName;
    console.log("myName",this.myName);

    if(this.amIReceiver){
      let temp=this.userName;
      this.userName=this.currentUserName;
      this.currentUserName=temp;
    }
    // else{
    //   this.myName=this.userName;
    // }
    this.dataChannel.onerror = (error)=> {
      console.log("Error occured on datachannel:", error);
    };

    this.dataChannel.onmessage=(event)=>{

      console.log("multipler message:", event.data);
    };

  }

  sendMessageToUser() {
    console.log("message sent from", this.userName);
    this.dataChannel.send(this.messageText);
  }
}
