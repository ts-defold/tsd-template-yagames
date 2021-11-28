// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface props {}

interface Message {
  sound: string;
}

export function on_message(this: props, message_id: hash, message: Message): void {
  if (message_id === hash("play")) {
    sound.play(message.sound);
  }
  else if (message_id === hash("mute")) {
    sound.set_group_gain(hash("master"), 0);
  }
  else if (message_id === hash("unmute")) {
    sound.set_group_gain(hash("master"), 1.0);
  }
}