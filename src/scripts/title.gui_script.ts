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
}

export function on_input(this: props, action_id: hash, action: Action): void {
  const previous = this.index;
  if (action_id == hash("up") && action.pressed) {
    this.index = (this.index == 0 ? this.menu.length : this.index) - 1;
  } else if (action_id == hash("down") && action.pressed) {
    this.index = (this.index + 1) % this.menu.length;
  } else if (action_id == hash("start") && action.pressed) {
    msg.post("main:/main#script", "start_game");
  } else if (action_id == hash("accept") && action.pressed) {
    switch (this.index) {
      case MenuActions.Start:
        msg.post("main:/main#script", "start_game");
        break;
      case MenuActions.Scores:
        msg.post("main:/main#script", "show_scores");
        break;
    }
  }

  this.menu[previous].forEach((node) => gui.set_enabled(node, false));
  this.menu[this.index].forEach((node) => gui.set_enabled(node, true));
}
