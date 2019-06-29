import AgoraRTC from 'agora-rtc-sdk';
import creds from './creds.json';

vidStream = async() => {
  const client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });
  let stream = "";
  let localStream = "";
  
  let start = true;
  let id = 69;

  if (start) {
    console.log("starting stream!");
    await client.init(
      // initialize Agora
      creds.agora.appid,
      () => {
        console.log("AgoraRTC client initialized");
      },
      err => {
        console.log("AgoraRTC client init failed", err);
      }
    );

    client.join(
      // join to channel
      null,
      id,
      0,
      function(uid) {
        console.log("User " + uid + " join channel successfully");
      },
      function(err) {
        console.log("Join channel failed", err);
      }
    );

    localStream = AgoraRTC.createStream({
      // create video/audio stream
      streamID: 1,
      audio: true,
      video: true,
      screen: false
    });

    localStream.init(
      // initalize audio/video stream and play local stream on DOM
      function() {
        console.log("getUserMedia successfully");
        // Use agora_local as ID of the dom element
        localStream.play("agora_local");

        client.publish(localStream, function(err) {
          // publish stream to channel
          console.log("Publish local stream error: " + err);
        });
      },
      function(err) {
        console.log("getUserMedia failed", err);
      }
    );

    client.on("stream-published", function(evt) {
      // occurs after stream publishes
      console.log("Published local stream successfully");
    });

    client.on("stream-added", function(evt) {
      // subscribes to stream when new stream added to channel
      stream = evt.stream;
      console.log("New stream added: " + stream.getId());

      client.subscribe(stream, function(err) {
        console.log("Subscribe stream failed", err);
      });
    });

    client.on("stream-subscribed", function(evt) {
      // plays stream once subscribed
      let remoteStream = evt.stream;
      console.log(
        "Subscribe remote stream successfully: " + remoteStream.getId()
      );
      remoteStream.play("agora_remote");
    });
  } else {
    console.log("not ready");
    client.unpublish(stream, function(err) {
      console.log("stream unpublished");
    });
    client.unsubscribe(stream, function(err) {
      console.log("stream unsubscribed");
    });
    client.leave(
      function() {
        console.log("Left channel successfully");
      },
      function(err) {
        console.log("Leave channel failed");
      }
    );
  }
}