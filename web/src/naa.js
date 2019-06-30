import AgoraRTC from 'agora-rtc-sdk';
import creds from './creds.json';

const client = initialize();

function initialize () {
  let agoraClient = AgoraRTC.createClient({
    mode: 'live',
    codec: 'h264'
  });

  agoraClient.init(creds.agora.appid, function () {
    console.log('AgoraRTC client initialized');
  }, function (err) {
    console.log('AgoraRTC client init failed', err);
  });

  return agoraClient;
}

function join (channelName) {
  client.join(null, channelName, 0, function (uid) {
    console.log('User ' + uid + ' join channel successfully');
  }, function (err) {
    console.log('Join channel failed', err);
  });
}
