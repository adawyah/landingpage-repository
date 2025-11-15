import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "local",           // use 'local' for dev with laravel-websockets
  wsHost: window.location.hostname,
  wsPort: 6001,           // the port your WebSocket server runs on
  forceTLS: false,
  disableStats: true,
});

export default echo;
