import * as yagames from "yagames.yagames";
import * as lldebugger from "lldebugger.debug";

// Enable lldebugger
lldebugger.start();

interface props {
  next?: string;
  loaded?: url;
  params?: { 
    target?: string;
    id?: string; 
    params?: unknown;
  };
  prev_down: string[];
}

const GAME = "main:/game#proxy";
const TITLE = "main:/title#proxy";
const HIGHSCORES = "main:/highscores#proxy";
const SCORE = "main:/score#proxy";

const ROUTE_KEYS: { [key: string]: url } = {
  [GAME]: msg.url(GAME),
  [TITLE]: msg.url(TITLE),
  [HIGHSCORES]: msg.url(HIGHSCORES),
  [SCORE]: msg.url(SCORE),
};

const ROUTES: { [key: string]: url } = {
  [GAME]: msg.url("game:/ball#script"),
  [TITLE]: msg.url("title:/title#gui"),
  [HIGHSCORES]: msg.url("highscores:/highscores#gui"),
  [SCORE]: msg.url("score:/scores#score"),
};

export function init(this: props): void {
  this.prev_down = [];

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

  if (globalThis["html5"] !== undefined) {
    html5.run("console.log('Initializing Virtual Input Driver...')");
  }
}

export function update(this: props): void {
  if (this.next !== undefined) {
    msg.post(this.next, "load");
    this.next = undefined;
  }

  if (globalThis["html5"] !== undefined) {
    const down = html5.run("window.VirtualInputDriver.down");
    if (down !== undefined) {
      const keys_down = down.split(",").filter(b => b !== "");
      keys_down.forEach((key) => {
        if (key === "") return;
        const pressed = !this.prev_down.includes(key);

        if (this.loaded && pressed) {
          const route = Object.keys(ROUTES).find((route) => ROUTE_KEYS[route] === this.loaded);
          if (route !== undefined) msg.post(ROUTES[route], "on_virtual_input", { action_id: hash(key.trim()), action: { pressed: true, released: false } });
        }
      });
      
      ['up', 'right', 'down', 'left', 'accept', 'back'].forEach((key) => {
        const released = this.prev_down.includes(key) && !keys_down.includes(key);
        if (this.loaded && released) {
          const route = Object.keys(ROUTES).find((route) => ROUTE_KEYS[route] === this.loaded);
          if (route !== undefined) msg.post(ROUTES[route], "on_virtual_input", { action_id: hash(key.trim()), action: { pressed: false, released: true } });
          
        }
      });
      this.prev_down = keys_down;
    }
  }
}

export function on_message(
  this: props,
  message_id: hash,
  message: unknown,
  sender: hash,
): void {
  if (message_id === hash("start_game")) {
    this.next = GAME;
  }
  else if (message_id === hash("show_title")) {
    this.next = TITLE;
  }
  else if (message_id === hash("show_score")) {
    this.next = SCORE;
    this.params = message as { target?: string; id?: string; params?: unknown; };
  }
  else if (message_id === hash("show_highscores")) {
    this.next = HIGHSCORES;
  }
  else if (message_id == hash("show_fullscreen_adv")) {
    const { then } = message as { then: string };
    yagames.adv_show_fullscreen_adv({
      open: () => {
        print("Show Ad");
        msg.post("main:/audio#fx", "mute");
      },
      close: () => {
        msg.post("main:/audio#fx", "unmute");
        msg.post("main:/main#script", then);
      },
      offline: () => {
        msg.post("main:/audio#fx", "unmute");
        msg.post("main:/main#script", then);
      },
      error: () => {
        msg.post("main:/audio#fx", "unmute");
        msg.post("main:/main#script", then);
      },
    });
  }
  else if (message_id == hash("proxy_loaded")) {
    if (this.loaded) msg.post(this.loaded, "unload");
    
    this.loaded = sender;
    print("Loaded: ", sender);

    msg.post(sender, "acquire_input_focus");
    msg.post(sender, "init");
    msg.post(sender, "enable");

    // Foreward params if any available
    if (this.params !== undefined && this.params.target !== undefined && this.params.id !== undefined) {
      print("Forwarding params:", sender, this.params.target, this.params.id, this.params.params);
      msg.post(this.params.target, this.params.id, this.params.params);
      this.params = undefined;
    }
  }
}