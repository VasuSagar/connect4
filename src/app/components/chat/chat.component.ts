import {ChangeDetectorRef, Component, OnInit} from '@angular/core';

interface Player {
  type:string;
  userName:string;
  offer?:any;
  candidate?:string;
  senderUserName?:string;
  answer?:any;
}

interface IncomingMessages {
  type:string;
  message:string;
  newUser:LoggedInUsers;
  allUsers:LoggedInUsers[];
  offer:any;
  senderUserName:string;
  answer:any;
  candidate:any;
}

interface LoggedInUsers {
  id:string;
  userName:string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  serverUrl = 'wss://api.vasusagar.com/socket';
  loggedInUsers:LoggedInUsers[]=[];
  userName='';
  conn:WebSocket=new WebSocket(this.serverUrl);
  error: boolean=false;
  errorMessage:string='';
  isLoggedIn=false;
  isDataChannelCreated=false;
  currentUser!: LoggedInUsers;
  recipentName:string='';
  peerConnection!: RTCPeerConnection;
  currentUserName='';
  messageText='';
  dataChannel!: RTCDataChannel;
  amIReceiver=true;
  constructor(private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.conn.onopen = ()=> {
      console.log("Connected to the signaling server");
    };

    this.conn.onmessage = (event)=> {
      const receviedMessage=JSON.parse(event.data);
      console.log("message:",receviedMessage);

      this.handleIncomingMessages(receviedMessage);

    };

  }

  private handleIncomingMessages(receviedMessage: IncomingMessages) {
    switch (receviedMessage.type){
      case "loggedIn":
        this.addUserToLoggedInList(receviedMessage);
        this.initializePeerConnection();
        break;

      case "error":
        this.handleErrorMessage(receviedMessage);
        break;

      case "offer":
        this.handleOffer(receviedMessage);
        break;

      case "answer":
        this.handleAnswer(receviedMessage);
        break;
      case "candidate":
        this.handleCandidate(receviedMessage);
        break;

      case "close":
        this.handleLogOut(receviedMessage);
    }
  }

  handleLogOut(receviedMessage: any){
    this.errorMessage='User left:'+receviedMessage.userName;
    this.recipentName='';
    this.error=true;
    this.isDataChannelCreated=false
  }

  private handleAnswer(receviedMessage: IncomingMessages) {
    this.amIReceiver=false;
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(receviedMessage.answer));
  }

  private handleCandidate(receviedMessage: IncomingMessages) {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(receviedMessage.candidate));
  }

  private handleOffer(receviedMessage: IncomingMessages) {

    this.currentUserName=receviedMessage.senderUserName;

    this.peerConnection.setRemoteDescription(new RTCSessionDescription(receviedMessage.offer));

    this.peerConnection.createAnswer((answer: any)=> {
      console.log("aa",answer)
      this.peerConnection.setLocalDescription(answer);
      const answerObj:Player={
        type:'answer',
        userName:this.currentUserName,
        answer:answer
      }
      console.log("answer obj",answerObj)
      this.sendMessageToWebsocketServer(answerObj);
    }, ()=> {
      alert("Error creating an answer");
    });

  }

  private initializePeerConnection() {
    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}

    this.peerConnection = new RTCPeerConnection(configuration);

    // Setup ice handling
    this.peerConnection.onicecandidate = (event: { candidate: any; })=> {
      console.log("event",event)

      if (event.candidate && this.currentUserName!=='') {
        console.log("candidate",event.candidate)
        const candidateObj:Player={
          type:'candidate',
          userName:this.currentUserName,
          candidate:event.candidate
        }
        this.sendMessageToWebsocketServer(candidateObj);
      }
    };

    // Setup dataChannel handle
    this.peerConnection.ondatachannel=(event)=>{
      console.log("Data channel is created");
      this.dataChannel= event.channel;
      this.dataChannel.onopen = () => {
        console.log("Received Data channel is open and ready to be used.");
        this.isDataChannelCreated=true;
        this.cdr.detectChanges();
        console.log("isDataChannelCreated",this.isDataChannelCreated)
      };
      this.dataChannel.onmessage = (event)=>{
        console.log("on message of channel",event.data);
      };
    };


  }

  private handleErrorMessage(receviedMessage: IncomingMessages) {
    this.errorMessage=receviedMessage.message;
    this.error=true;

  }

  private addUserToLoggedInList(receviedMessage: IncomingMessages) {
    this.currentUser=receviedMessage.newUser;
    this.isLoggedIn=true;

    this.loggedInUsers=receviedMessage.allUsers;
  }

  login() {
    const loginObj:Player={
      type:"login",
      userName:this.userName
    }

    this.sendMessageToWebsocketServer(loginObj);
  }

  sendMessageToWebsocketServer(payloadObject:Player){
    this.conn.send(JSON.stringify(payloadObject));
  }

  closeError() {
    this.error=false;
  }

  connectWithUser() {
    if(this.userName==this.recipentName){
      return;
    }
    this.currentUserName=this.recipentName;

    this.dataChannel = this.peerConnection.createDataChannel("messenger");

    this.dataChannel.onopen=(event)=>{
      console.log("Data channel opened",event)
      this.isDataChannelCreated=true;
      this.cdr.detectChanges();
      console.log("isDataChannelCreated",this.isDataChannelCreated)
    };

    this.dataChannel.onerror = (error)=> {
      console.log("Error occured on datachannel:", error);
    };

    this.dataChannel.onmessage=(event)=>{
      console.log("message:", event.data);
    };

    this.peerConnection.createOffer((offer: any)=> {
      console.log("create offer",offer);
      const offerObj:Player={
        type:'offer',
        userName:this.recipentName,
        senderUserName:this.userName,
        offer:offer
      }
      this.peerConnection.setLocalDescription(offer);
      this.sendMessageToWebsocketServer(offerObj);
    }, ()=> {
      alert("Error creating an offer");
    });

  }

  sendMessageToUser() {
    this.dataChannel.send(this.messageText);
  }
}
