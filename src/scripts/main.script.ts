import * as yagames from "yagames.yagames";
import * as lldebugger from "lldebugger.debug";

// Enable lldebugger
lldebugger.start();

interface props {
  loaded?: hash;
}

const GAME = "/game#proxy";
const TITLE = "/title#proxy";
const SCORES = "/highscores#proxy";

export function init(this: props): void {
  yagames.init((_ctx, err) => {
    if (err != undefined) {
      print("Error initializing yagames:", err);
      return;
    }

    //* YaGames Authenticate
    yagames.auth_open_auth_dialog((_ctx, err) => {
      if (err != undefined) {
        print("Error opening auth dialog:", err);
      }

      //* YaGames Initialize Leaderboards
      yagames.leaderboards_init((_ctx, err) => {
        if (err != undefined) {
          print("Error initializing leaderboards:", err);
          return;
        }
        print("Leaderboards initialized");
      });
    });

    msg.post(TITLE, "load");
  });
}

export function on_message(
  this: props,
  message_id: hash,
  _message: unknown,
  sender: hash,
): void {
  if (message_id === hash("start_game")) {
    print("Starting game");
    msg.post(GAME, "load");
  }
  else if (message_id === hash("show_title")) {
    print("Show title");
    msg.post(TITLE, "load");
  }
  else if (message_id === hash("show_scores")) {
    print("Show scores");
    msg.post(SCORES, "load");
  }
  else if (message_id == hash("proxy_loaded")) {
    if (this.loaded) msg.post(this.loaded, "unload");
    
    this.loaded = sender;
    msg.post(sender, "acquire_input_focus");
    msg.post(sender, "init");
    msg.post(sender, "enable");
  }
}