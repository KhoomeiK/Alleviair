import AgoraRTC from 'agora-rtc-sdk';

console.log('agora sdk version: ' + AgoraRTC.VERSION + ' compatible: ' + AgoraRTC.checkSystemRequirements());

/*
function getDevices (next) {
  AgoraRTC.getDevices(function (items) {
    items.filter(function (item) {
      return ['audioinput', 'videoinput'].indexOf(item.kind) !== -1;
    })
      .map(function (item) {
        return {
          name: item.label,
          value: item.deviceId,
          kind: item.kind
        };
      });
    let videos = [];
    let audios = [];
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      if (item.kind === 'videoinput') {
        let name = item.label;
        let value = item.deviceId;
        if (!name) {
          name = 'camera-' + videos.length;
        }
        videos.push({
          name: name,
          value: value,
          kidn: item.kind
        });
      }
      if (item.kind === 'audioinput') {
        let name = item.label;
        let value = item.deviceId;
        if (!name) {
          name = 'microphone-' + audios.length;
        }
        audios.push({
          name: name,
          value: value,
          kidn: item.kind
        });
      }
    }
    next({ videos: videos, audios: audios });
  });
}
*/

let rtc = {
  client: null,
  joined: false,
  published: false,
  localStream: null,
  remoteStreams: [],
  params: {}
};

function handleEvents (rtc) {
  // Occurs when an error message is reported and requires error handling.
  rtc.client.on('error', (err) => {
    console.log(err);
  });
  // Occurs when the peer user leaves the channel; for example, the peer user calls Client.leave.
  rtc.client.on('peer-leave', function (evt) {
    let id = evt.uid;
    console.log('id', evt);
    if (id !== rtc.params.uid) {
      removeView(id);
    }
    console.log('peer-leave', id);
  });
  // Occurs when the local stream is published.
  rtc.client.on('stream-published', function (evt) {
    console.log('stream-published success');
  });
  // Occurs when the remote stream is added.
  rtc.client.on('stream-added', function (evt) {
    let remoteStream = evt.stream;
    let id = remoteStream.getId();
    if (id !== rtc.params.uid) {
      rtc.client.subscribe(remoteStream, function (err) {
        console.log('stream subscribe failed', err);
      });
    }
    console.log('stream-added remote-uid: ', id);
  });
  // Occurs when a user subscribes to a remote stream.
  rtc.client.on('stream-subscribed', function (evt) {
    let remoteStream = evt.stream;
    let id = remoteStream.getId();
    rtc.remoteStreams.push(remoteStream);
    addView(id);
    remoteStream.play('remote_video_' + id);
    console.log('stream-subscribed remote-uid: ', id);
  });
  // Occurs when the remote stream is removed; for example, a peer user calls Client.unpublish.
  rtc.client.on('stream-removed', function (evt) {
    let remoteStream = evt.stream;
    let id = remoteStream.getId();
    remoteStream.stop('remote_video_' + id);
    rtc.remoteStreams = rtc.remoteStreams.filter(function (stream) {
      return stream.getId() !== id;
    });
    removeView(id);
    console.log('stream-removed remote-uid: ', id);
  });
  rtc.client.on('onTokenPrivilegeWillExpire', function () {
    // After requesting a new token
    // rtc.client.renewToken(token);
    console.log('onTokenPrivilegeWillExpire');
  });
  rtc.client.on('onTokenPrivilegeDidExpire', function () {
    // After requesting a new token
    // client.renewToken(token);
    console.log('onTokenPrivilegeDidExpire');
  });
}

function join (rtc, data) {
  if (rtc.joined) {
    console.error('Your already joined');
    return;
  }

  /**
         * A class defining the properties of the config parameter in the createClient method.
         * Note:
         *    Ensure that you do not leave mode and codec as empty.
         *    Ensure that you set these properties before calling Client.join.
         *  You could find more detail here. https://docs.agora.io/en/Video/API%20Reference/web/interfaces/agorartc.clientconfig.html
        **/
  rtc.client = AgoraRTC.createClient({ mode: data.mode, codec: data.codec });

  rtc.params = data;

  // handle AgoraRTC client event
  handleEvents(rtc);

  // init client
  rtc.client.init(data.appID, function () {
    console.log('init success');

    /**
           * Joins an AgoraRTC Channel
           * This method joins an AgoraRTC channel.
           * Parameters
           * tokenOrKey: string | null
           *    Low security requirements: Pass null as the parameter value.
           *    High security requirements: Pass the string of the Token or Channel Key as the parameter value. See Use Security Keys for details.
           *  channel: string
           *    A string that provides a unique channel name for the Agora session. The length must be within 64 bytes. Supported character scopes:
           *    26 lowercase English letters a-z
           *    26 uppercase English letters A-Z
           *    10 numbers 0-9
           *    Space
           *    "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", "{", "}", "|", "~", ","
           *  uid: number | string | null
           *    The user ID, an integer or a string, ASCII characters only. Ensure this ID is unique. If you set the uid to null, the server assigns one and returns it in the onSuccess callback.
           *   Note:
           *      All users in the same channel should have the same type (number or string) of uid.
           *      If you use a number as the user ID, it should be a 32-bit unsigned integer with a value ranging from 0 to (232-1).
           *      If you use a string as the user ID, the maximum length is 255 characters.
          **/
    rtc.client.join(data.token ? data.token : null, data.channel, data.uid ? data.uid : null, function (uid) {
      console.log('join channel: ' + data.channel + ' success, uid: ' + uid);
      rtc.joined = true;

      rtc.params.uid = uid;

      // create local stream
      rtc.localStream = AgoraRTC.createStream({
        streamID: rtc.params.uid,
        audio: true,
        video: true,
        screen: false,
        microphoneId: data.microphoneId,
        cameraId: data.cameraId
      });

      // init local stream
      rtc.localStream.init(function () {
        console.log('init local stream success');
        // play stream with html element id "local_stream"
        rtc.localStream.play('local_stream');

        // publish local stream
        publish(rtc);
      }, function (err) {
        console.error('init local stream failed ', err);
      });
    }, function (err) {
      console.error('client join failed', err);
    });
  }, (err) => {
    console.error(err);
  });
}

function publish (rtc) {
  if (!rtc.client) {
    console.error('Please Join Room First');
    return;
  }
  if (rtc.published) {
    console.error('Your already published');
    return;
  }
  let oldState = rtc.published;

  // publish localStream
  rtc.client.publish(rtc.localStream, function (err) {
    rtc.published = oldState;
    console.log('publish failed');
    console.error(err);
  });
  console.log('publish');
  rtc.published = true;
}

function unpublish (rtc) {
  if (!rtc.client) {
    console.error('Please Join Room First');
    return;
  }
  if (!rtc.published) {
    console.error("Your didn't publish");
    return;
  }
  let oldState = rtc.published;
  rtc.client.unpublish(rtc.localStream, function (err) {
    rtc.published = oldState;
    console.log('unpublish failed');
    console.error('unpublish failed');
    console.error(err);
  });
  console.log('unpublish');
  rtc.published = false;
}

function leave (rtc) {
  if (!rtc.client) {
    console.error('Please Join First!');
    return;
  }
  if (!rtc.joined) {
    console.error('You are not in channel');
    return;
  }
  /**
         * Leaves an AgoraRTC Channel
         * This method enables a user to leave a channel.
         **/
  rtc.client.leave(function () {
    // stop stream
    rtc.localStream.stop();
    // close stream
    rtc.localStream.close();
    while (rtc.remoteStreams.length > 0) {
      let stream = rtc.remoteStreams.shift();
      let id = stream.getId();
      stream.stop();
      removeView(id);
    }
    rtc.localStream = null;
    rtc.remoteStreams = [];
    rtc.client = null;
    console.log('client leaves channel success');
    rtc.published = false;
    rtc.joined = false;
  }, function (err) {
    console.log('channel leave failed');
    console.error(err);
  });
}

function addView (id) {
  if (document.getElementById(id)) {
    const main = document.createElement('div');
    main.id = 'remove_video_' + id;
    main.className += ' video-view ';
    document.getElementById('video').appendChild(main);
  }
}

function removeView (id) {
  let el = document.getElementById('remote_video_' + id);
  if (el) {
    el[0].remove();
  }
}

document.getElementById('join-leave').addEventListener('click', (e) => {
  if (rtc.joined) {
    leave(rtc);
    e.target.textContent = 'Join';
  } else {
    join(rtc);
    e.target.textContent = 'Leave';
  }
});

document.getElementById('publish-unpublish').addEventListener('click', (e) => {
  if (rtc.published) {
    unpublish(rtc);
    e.target.textContent = 'Publish';
  } else {
    publish(rtc);
    e.target.textContent = 'Unpublish';
  }
});
