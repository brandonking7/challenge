import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import { connect } from "socket.io-client";
import SendBird from "sendbird";
import $ from "jquery";
import { useImmer } from "use-immer";
const io = require("socket.io-client");

const ENDPOINT =
  process.env.NODE_ENV  === "development"
    ? "http://127.0.0.1:5000"
    : // ? "http //127.0.0.0:3005" :
      "http://produ-publi-jylc5cga6ck4-1148393999.us-east-1.elb.amazonaws.com/";
const socket1 = io(ENDPOINT);
console.log(ENDPOINT, "[CHECK!]", process.env.NODE_ENV);



const IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
const SessionDescription =
  window.mozRTCSessionDescription || window.RTCSessionDescription;
// const SendBird = window.SendBird;

var sb = new SendBird({ appId: "30C02556-B597-4E97-A84F-C4323FE9722F" });


// const socket = connect({
//   host: "http://localhost:3000",
//   path: '/'
// });


// //handle messages from the server 
// socket.onmessage = function (message) { 
//    console.log("Got message", message.data);
//    var data = JSON.parse(message.data); 
	
//    switch(data.type) { 
//       case "login": 
//         //  onLogin(data.success); 
//          break; 
//       case "offer": 
//         //  onOffer(data.offer, data.name); 
//          break; 
//       case "answer": 
//         //  onAnswer(data.answer); 
//          break; 
//       case "candidate": 
//         //  onCandidate(data.candidate); 
//          break; 
//       default: 
//          break; 
//    } 
// };
  
// socket.onopen = function () {
//   console.log("Connected");
// };

// socket.onerror = function (err) {
//   console.log("Got error", err);
// };


const gotLocalDescription = (description) => {
  // pc.setLocalDescription(description);
  6(description);
};

const createAnswer = (pc) => {
  pc.createAnswer(
    gotLocalDescription,
    function (error) {
      console.log(error);
    },
    { mandatory: { OfferToReceiveAudio: true, OfferToReceiveVideo: true } }
  );
};

// const socketEventVideo = (ps1) => {
//   socket.on("message", (message) => {
//     console.log("video message");
//     if (message.type === "offer") {
//       ps1.setRemoteDescription(new SessionDescription(message));
//       createAnswer(ps1);
//     } else if (message.type === "answer") {
//       ps1.setRemoteDescription(new SessionDescription(message));
//     } else if (message.type === "candidate") {
//       var candidate = new IceCandidate({
//         sdpMLineIndex: message.label,
//         candidate: message.candidate,
//       });
//       ps1.addIceCandidate(candidate);
//     }
//   });
// };
var scrolled = false;
function updateScroll() {
  if (!scrolled) {
    var element = document.getElementById("yourDivID");
    element.scrollTop = element.scrollHeight;
  }
}
$("#yourDivID").on("scroll", function () {
  scrolled = true;
});
  

function Video() {
  const [messageCount, setMessageCount] = useState(0);
  const [messages, setMessages] = useImmer([]);
  const prevMsgNumb = useRef();
  const prevMsg = useRef();
  useEffect(() => {
    socket1.on("chat message", (payload) => {
      const san = prevMsgNumb.current
        ? prevMsgNumb.current + 1
        : messageCount + 1;
      console.log("chat message", payload, san);
      setMessageCount(san);
      prevMsgNumb.current = san;
      document.title = `${san} new messages have been emitted`;
  
      console.log("chat message end first", prevMsg);
      const array = prevMsg.current ? prevMsg.current : [];
      array.push(payload);
      setMessages((draft) => {
        draft.push(["", array]);
      });
      updateScroll()
      
    });
  }, 0); //only re-run the effect if new message comes in

  const sendMessage = (message) => {
    socket1.emit("chat message", message);
  };
  const connect1 = () => {
    // console.log("YOOOO", socket);
    // socket.on("connect", () => {
    //   console.log("success connect");
    // });
  };

  const gotIceCandidate = (event) => {
    console.log(event, "gotIceCandidate");
    if (event.candidate) {
      6({
        type: "candidate",
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
      });
    }
  };
  const getMedia = async () => {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 },
      });
      const PeerConnection =
        window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
      const pc = new PeerConnection(null);
      var video = document.querySelector("video");
      // video.src = window.URL.createObjectURL(stream);
      video.srcObject = stream;
      video.onloadedmetadata = function (e) {
        video.play();
      };
      pc.addStream(stream);
      pc.onicecandidate = gotIceCandidate;
      console.log(pc, "[PeerConnection]");
      //  pc.onaddstream = gotRemoteStream;
      //insert stream into the video tag

      //creating our RTCPeerConnection object

      //  var configuration = {
      //    iceServers: [{ url: "stun:stun.1.google.com:19302" }],
      //  };

      //  const myConnection = new PeerConnection(configuration);
      //  console.log("RTCPeerConnection object was created");
      //  console.log(myConnection);

      //setup ice handling
      //when the browser finds an ice candidate we send it to another peer
      //  myConnection.onicecandidate = function (event) {
      //    if (event.candidate) {
      //      send({
      //        type: "candidate",
      //        candidate: event.candidate,
      //      });
      //    }
      //  };

      console.log(stream, video.src, "HERE");

      /* use the stream */
    } catch (err) {
      /* handle the error */
      console.log(err);
    }
  };
  const stopStream = () => {
    const videoElem = document.querySelector(`video`);
    const stream = videoElem.srcObject;
    console.log(stream);
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });

      videoElem.srcObject = null;
    }
  };

  const submit = (e) => {
    const value = document.getElementById("mySubmit");
    const message = document.getElementById("message");
    console.log("SUBMIT", message.value);
    sendMessage(message.value);
    e.preventDefault();

    //  sendMessage()
  };
  console.log(messageCount, 'messageCount')

  return (
    <div style={{ display: "flex", flexWrap: "wrap", padding: 16 }}>
      <div style={{ flex: "1 60%", background: "red" }} onClick={getMedia}>
        START STREAM
      </div>
      <div style={{ flex: "2 40%", background: "white" }}>
        <p>{messageCount} messages have been emitted</p>
        <div
          style={{
            color: "white",
            flex: "2 40%",
            display: "flex",
            height: "400px",
            justifyContent: "flex-end",
            flexDirection: "column",
            overflowY: "auto",
            background: "black",
          }}
        >
          {
            <div
              id="yourDivID"
              style={{
                overflowY: "auto",
                flexDirection: "column",
                paddingBottom: "10px",
              }}
            >
              {messages &&
                messages.map((msg, i) => (
                  <div
                    style={{
                      color: "white",
                      margin: "5px 15px 5px 15px",
                      width: "100%",
                    }}
                    key={i}
                  >
                    {msg}
                  </div>
                ))}
            </div>
          }
        </div>
        <form
          id="mySubmit"
          onSubmit={submit}
          style={{ display: "flex", height: "36px", padding: "8px" }}
        >
          <input
            id="message"
            type="text"
            name="message"
            placeholder="Send a message..."
            style={{
              border: "none",
              flex: "5",
              paddingLeft: "8px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            value="Send"
            style={{ cursor: 'pointer', borderRadius: "5px", flex: "1", outline: "none" }}
          >
            Send
          </button>
        </form>
      </div>

      <div
        style={{ background: "black", width: 100, height: 100 }}
        onClick={stopStream}
      >
        STOP STREAM!
      </div>
      <div
        style={{ background: "blue", width: 100, height: 100 }}
        onClick={() => {
          // createChannel().then((result) => {
          //   console.log(result, "createChannel");
          //   // joinChannel
          // });
        }}
      >
        Chat!
      </div>
      <video />

      {/* <video width="600" height="400" controls autoPlay>
        <source
          // src="https://63050ee307b58b8f.mediapackage.us-east-1.amazonaws.com/out/v1/0c968292d333413ca5fb244a79640689/index.m3u8"
          src="https://d226t4hplbrmu4.cloudfront.net/out/v1/ddc83a52740c467c97490ce9c20d66e4/index.m3u8"
          type="application/x-mpegURL"
        />
      </video> */}
      {/* <ReactPlayer
        url="https://d226t4hplbrmu4.cloudfront.net/out/v1/ddc83a52740c467c97490ce9c20d66e4/index.m3u8"
        playing
      /> */}
    </div>
  );
}

export default Video