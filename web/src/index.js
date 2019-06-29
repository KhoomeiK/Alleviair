import AgoraRTC from 'agora-rtc-sdk';
import creds from './creds.json';

const client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });

client.init(creds.agora.appid, function () {
  console.log('AgoraRTC client initialized');
}, function (err) {
  console.log('AgoraRTC client init failed', err);
});
