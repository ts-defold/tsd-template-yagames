import * as fx from "../modules/fx";
import loc from "../modules/localization";

type Action = {
  pressed: boolean;
  released: boolean;
};

enum MenuActions {
  Start = 0,
  Scores = 1,
}

interface props {
  index: number;
  menu: Array<node[]>;
}

export function init(this: props): void {
  msg.post(".", "acquire_input_focus");

  this.index = 0;
  this.menu = [[gui.get_node("menu-pip-1")], [gui.get_node("menu-pip-2")]];

  this.menu.forEach((nodes, i) => {
    nodes.forEach((node) => gui.set_enabled(node, this.index == i));
  });

  let lang = "en";
  if (globalThis["html5"] !== undefined) {
    lang = html5.run("window.navigator.language").split('-')[0];
    lang = Object.keys(loc).find((key) => key === lang) ?? "en";
  }

  gui.set_text(gui.get_node("menu-item-1"), loc[lang].start);
  gui.set_text(gui.get_node("menu-item-2"), loc[lang].scores);
  
  //! HACK: Menu for ru
  if (lang === "ru") {
    gui.set_scale(gui.get_node("menu-item-1"), vmath.vector3(0.125, 0.15, 0.125));
    gui.set_scale(gui.get_node("menu-item-2"), vmath.vector3(0.125, 0.15, 0.125));
    gui.set_position(gui.get_node("menu-pip-1"), vmath.vector3(90, 80, 0.0));
    gui.set_position(gui.get_node("menu-pip-2"), vmath.vector3(90, 50, 0.0));
  }
}

export function on_input(this: props, action_id: hash, action: Action): void {
  const previous = this.index;
  if (action_id == hash("up") && action.pressed) {
    fx.menu_item();
    this.index = (this.index == 0 ? this.menu.length : this.index) - 1;
  } else if (action_id == hash("down") && action.pressed) {
    fx.menu_item();
    this.index = (this.index + 1) % this.menu.length;
  } else if (action_id == hash("accept") || action_id == hash("start") && action.pressed) {
    fx.press();
    switch (this.index) {
      case MenuActions.Start:
        msg.post("main:/main#script", "start_game");
        break;
      case MenuActions.Scores:
        msg.post("main:/main#script", "show_highscores");
        break;
    }
  }

  this.menu[previous].forEach((node) => gui.set_enabled(node, false));
  this.menu[this.index].forEach((node) => gui.set_enabled(node, true));
}

export function on_message(this: props, message_id: hash, message: unknown): void {
  // Virtual Input
  print(message_id, message);
  if (message_id == hash("on_virtual_input")) {
    const { action_id, action } = message as { action_id: hash; action: Action };
    on_input.call(this, action_id, action);
  }
}