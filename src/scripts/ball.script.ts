import * as fx from "../modules/fx";

type Action = {
  pressed: boolean;
  released: boolean;
};

type Message = {
  normal: vmath.vector3;
  distance: number;
  group: hash;
  other_group: hash;
  other_id: hash;
  enter?: boolean;
};

enum Buttons {
  left = 0,
  right = 1,
  up = 2,
  down = 3,
  action = 4,
}

interface props {
  speed: number;
  lives: number;
  button_state: boolean[];
  dir: vmath.vector3;
  correction: vmath.vector3;
  bounds: vmath.vector3;
  respawn_timer: number;
  is_HTML5: boolean;
  use_input_debugger: boolean;
  boost: 'recharge' | 'hold' | 'ready' | 'active';
  boost_dir: vmath.vector3;
  boost_strength: number;
  boost_time: number;
  boost_arrows: hash[];
}

go.property("speed", 90);
go.property("lives", 3);

const RESPAWN_TIME = 3;
const BOOST_STRENGTH = 400;
const BOOST_TIME = 0.5;

export function init(this: props): void {
  msg.post(".", "acquire_input_focus");

  this.use_input_debugger = false; //! Input debugger

  const info = sys.get_sys_info() as { system_name: string };
  this.is_HTML5 = info.system_name !== "HTML5";
  const engine = sys.get_engine_info() as { is_debug: boolean };
  if (!engine.is_debug) this.use_input_debugger = false;

  this.button_state = [false, false, false, false];
  this.dir = vmath.vector3(0, 0, 0);
  this.correction = vmath.vector3(0, 0, 0);
  this.respawn_timer = 0;

  this.boost = 'ready';
  this.boost_dir = vmath.vector3(0, 0, 0);
  this.boost_strength = 0;
  this.boost_time = 0;
  this.boost_arrows = [hash("/boost-e"), hash("/boost-se"), hash("/boost-s"), hash("/boost-sw"), hash("/boost-w"), hash("/boost-nw"), hash("/boost-n"), hash("/boost-ne")];
  this.boost_arrows.forEach(arrow => msg.post(arrow, "disable")); 

  this.bounds = vmath.vector3(
    tonumber(sys.get_config("display.width")) ?? 0,
    tonumber(sys.get_config("display.height")) ?? 0,
    0
  );

  //! Input debugger
  msg.post("/gui#debug", this.use_input_debugger ? "enable" : "disable");
}

export function update(this: props, dt: number): void {
  this.correction = vmath.vector3(0, 0, 0);
  let pos = go.get_position();

  // Update dir vector
  const [left, right, up, down, action] = this.button_state;
  this.dir.x = left ? -1 : right ? 1 : 0;
  this.dir.y = down ? -1 : up ? 1 : 0;
  this.dir = this.dir.x == 0 && this.dir.y == 0 ? this.dir : vmath.normalize(this.dir);

  // Handle boost states
  if (this.boost === "ready" && action) {
    this.boost = "hold";
  }
  else if (this.boost === "hold" && !action) {
    this.boost = "active";
    this.boost_arrows.forEach(arrow => msg.post(arrow, "disable"));
    this.boost_strength = BOOST_STRENGTH;
    this.boost_time = 0;
  }
  else if (this.boost === "active" && this.boost_strength <= 0) {
    this.boost = "recharge";
    this.boost_dir = vmath.vector3(0, 0, 0);
    this.boost_strength = 0;
  }
  else if (this.boost === "recharge" && true /* cooldown > 0 */) {
    this.boost = "ready";
  }

  // Show boost dir indicator
  if (this.boost === "hold") {
    const angle = math.atan2(-this.dir.y, this.dir.x);
    const octant = math.floor(8 * angle / (2 * Math.PI) + 8.5) % 8;
    this.boost_arrows.forEach(arrow => msg.post(arrow, "disable"));
    msg.post(this.boost_arrows[octant], "enable");
    this.boost_dir = this.dir;
    this.dir = vmath.vector3(0, 0, 0);
  }
  
  // Update position
  const dir = this.boost_strength > 0 ? vmath.normalize((this.boost_dir + (this.dir / 2)) as vmath.vector3) : this.dir;
  pos = (pos + dir * (this.speed + this.boost_strength) * dt) as vmath.vector3;
  if (this.lives > 0) go.set_position(pos);

  // Update boost strength
  if (this.boost === "active") {
    this.boost_time += dt;
    this.boost_strength = vmath.lerp(this.boost_time / BOOST_TIME, BOOST_STRENGTH, 0);
  }

  // Check dead
  if (pos.y < -18 && this.respawn_timer == 0) {
    dead.call(this);
  }

  if (this.respawn_timer > 0) {
    this.respawn_timer -= dt;
    const alpha = go.get("/ball#sprite", "tint.w") as number;
    go.set("/ball#sprite", "tint.w", alpha === 0 ? 1 : 0);
  } else if (this.respawn_timer < 0) {
    go.set("/ball#sprite", "tint.w", 1);
    this.respawn_timer = 0;
  }
}

export function on_input(this: props, action_id: hash, action: Action): void {
  if (action_id == hash("left")) {
    if (action.pressed) this.button_state[Buttons.left] = true;
    if (action.released) this.button_state[Buttons.left] = false;
  }
  if (action_id == hash("right")) {
    if (action.pressed) this.button_state[Buttons.right] = true;
    if (action.released) this.button_state[Buttons.right] = false;
  }
  if (action_id == hash("down")) {
    if (action.pressed) this.button_state[Buttons.down] = true;
    if (action.released) this.button_state[Buttons.down] = false;
  }
  if (action_id == hash("up")) {
    if (action.pressed) this.button_state[Buttons.up] = true;
    if (action.released) this.button_state[Buttons.up] = false;
  }
  if (action_id == hash("accept")) {
    if (action.pressed) this.button_state[Buttons.action] = true;
    if (action.released) this.button_state[Buttons.action] = false;
  }

  if (this.use_input_debugger) msg.post("/gui#debug", action_id, action); //! Input debugger
}

export function on_message(
  this: props,
  message_id: hash,
  message: Message
): void {
  if (
    message_id === hash("contact_point_response") &&
    message.group == hash("wall") &&
    (message.other_id === hash("/arena") || this.respawn_timer <= 0)
  ) {
    if (message.distance > 0) {
      const proj = vmath.project(
        this.correction,
        (message.normal * message.distance) as vmath.vector3
      );
      if (proj < 1) {
        const comp = ((message.distance - message.distance * proj) *
          message.normal) as vmath.vector3;
        go.set_position((go.get_position() + comp) as vmath.vector3);
        this.correction = (this.correction + comp) as vmath.vector3;
        
        // Bounce on boost
        if (this.boost_strength > 0) {
          this.boost_dir = message.normal;
        }
      }
    }
  } else if (message_id === hash("trigger_response") && this.respawn_timer <= 0) {
    if (message.other_group == hash("spike") && message.enter === true) {
      dead.call(this);
    }
    else if (message.other_group == hash("coin") && message.enter === true) {
      fx.coin();
      msg.post("/gui#hud", "score", { score: 1 });
      msg.post(message.other_id, "disable");
    }
    else {
      msg.post("/walls#script", "trigger_response", message);
    }
  }

  // Virtual Input
  if (message_id === hash("on_virtual_input")) {
    const { action_id, action } = message as unknown as { action_id: hash; action: Action };
    on_input.call(this, action_id, action);
  }
}

function dead(this: props) {
  fx.dead();
  this.boost_strength = 0;
  this.lives -= 1;
  msg.post("/gui#hud", "lives", { lives: this.lives });
  
  if (this.lives > 0) {
    this.respawn_timer = RESPAWN_TIME;
    go.set_position(vmath.vector3(160, 24, 0));
  } else {
    this.respawn_timer = math.huge;
  }
}