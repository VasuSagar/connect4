import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  serverUrl = 'ws://localhost:8080/sockets';
  ws = new WebSocket(this.serverUrl);
  peerConnection!: RTCPeerConnection;
  dataChannel!: RTCDataChannel;

  constructor() {

    this.ws.onopen = () => {
      console.log("Connected to the signaling server");
      this.initializeWebSocketConnection();
    };

    this.ws.onmessage =  (msg)=> {
      console.log("Got message", msg.data);
      let content = JSON.parse(msg.data);
      let data = content.data;
      switch (content.event) {
        // when somebody wants to call us
        case "offer":
          this.handleOffer(data);
          break;
        case "answer":
          this.handleAnswer(data);
          break;
        // when a remote peer sends an ice candidate to us
        case "candidate":
          this.handleCandidate(data);
          break;
        default:
          break;
      }
    };
  }

  initializeWebSocketConnection() {
    let configuration = null;

    this.peerConnection = new RTCPeerConnection();

    // Setup ice handling
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendObj({
          event: "candidate",
          data: event.candidate
        });
      }
    };

    // creating data channel
    this.dataChannel = this.peerConnection.createDataChannel("dataChannel",);

    this.dataChannel.onerror = (error) => {
      console.log("Error occured on datachannel:", error);
    };

    // when we receive a message from the other peer, printing it on the console
    this.dataChannel.onmessage = (event) => {
      console.log("message:", event.data);
    };

    this.dataChannel.onclose = () => {
      console.log("data channel is closed");
    };

    this.peerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
    };
  }

   createOffer() {
    this.peerConnection.createOffer((offer) =>{
      console.log("createOff")
      this.sendObj({
        event : "offer",
        data : offer
      });
      this.peerConnection.setLocalDescription(offer);
    }, (error)=> {
      alert("Error creating an offer");
    });
  }

   handleOffer(offer: RTCSessionDescriptionInit) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // create and send an answer to an offer
    this.peerConnection.createAnswer((answer)=> {
      this.peerConnection.setLocalDescription(answer);
      this.sendObj({
        event : "answer",
        data : answer
      });
    }, (error)=> {
      alert("Error creating an answer");
    });

  };

   handleCandidate(candidate: RTCIceCandidateInit | undefined) {
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  };

  handleAnswer(answer: RTCSessionDescriptionInit) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("connection established successfully!!");
  };

  sendObj(obj: any) {
    this.ws.send(JSON.stringify(obj));
  }

   sendMessage(input: string) {
    this.dataChannel.send(input);
  }
}
