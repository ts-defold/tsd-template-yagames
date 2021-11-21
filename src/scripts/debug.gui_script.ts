interface props {
  dir_nodes: node[];
}

type Action = {
  pressed: boolean;
  released: boolean;
};

export function init(this: props): void {
  this.dir_nodes = [gui.get_node("dir-left"), gui.get_node("dir-right"), gui.get_node("dir-up"), gui.get_node("dir-down"), ];
  this.dir_nodes.forEach(node => gui.set_enabled(node, false));
}

export function on_message(this: props, message_id: hash, message: Action): void {
  if (message_id == hash("left")) {
    if (message.pressed) gui.set_enabled(this.dir_nodes[0], true);
    if (message.released) gui.set_enabled(this.dir_nodes[0], false);
  } else if (message_id == hash("right")) {
    if (message.pressed) gui.set_enabled(this.dir_nodes[1], true);
    if (message.released) gui.set_enabled(this.dir_nodes[1], false);
  } else if (message_id == hash("up")) {
    if (message.pressed) gui.set_enabled(this.dir_nodes[2], true);
    if (message.released) gui.set_enabled(this.dir_nodes[2], false);
  } else if (message_id == hash("down")) {
    if (message.pressed) gui.set_enabled(this.dir_nodes[3], true);
    if (message.released) gui.set_enabled(this.dir_nodes[3], false);
  }
}