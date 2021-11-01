type Message = {
  other_id: hash;
  enter: boolean;
};

interface props {
  speed: number;
  wall_count: number;
  walls: hash[];
  active_walls: hash[];
  dead_walls: hash[];
  triggered_walls: Set<url>;
}

go.property("speed", 60);
go.property("wall_count", 1);

export function init(this: props): void {
  this.walls = [];
  this.active_walls = [];
  this.dead_walls = [];
  this.triggered_walls = new Set();

  for (let i = 0; i < this.wall_count; i++) {
    const wall_id = `/${i + 1}`;
    const h = hash(wall_id);
    this.walls.push(h);
  }
}

export function update(this: props, dt: number): void {
  for (const wall of this.dead_walls.splice(0, this.dead_walls.length)) {
    this.triggered_walls.delete(wall);
    this.walls.push(wall);
  }

  if (this.active_walls.length <= 0) {
    const wall = this.walls.shift();
    if (wall) {
      this.active_walls.push(wall);
    }
  }

  for (let i = 0; i < this.active_walls.length; i++) {
    const wall = this.active_walls[i];
    const pos = go.get_position(wall);
    pos.y -= this.speed * dt;
    if (pos.y < -640 - 16) {
      this.active_walls.splice(i, 1);
      this.dead_walls.push(wall);
      go.set_position(vmath.vector3(0, 0, 0), wall);
    } else {
      go.set_position(pos, wall);
    }
  }
}

export function on_message(
  this: props,
  message_id: hash,
  message: Message
): void {
  if (message_id == hash("trigger_response")) {
    if (!message.enter && !this.triggered_walls.has(message.other_id)) {
      this.triggered_walls.add(message.other_id);
      msg.post("/gui#hud", "score", { score: 1 });
    }
  }
}
