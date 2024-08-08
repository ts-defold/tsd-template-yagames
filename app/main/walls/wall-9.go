embedded_components {
  id: "fill"
  type: "sprite"
  data: "default_animation: \"wall-c\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 48.0
  }
}
embedded_components {
  id: "fill1"
  type: "sprite"
  data: "default_animation: \"wall-c\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 96.0
  }
}
embedded_components {
  id: "fill2"
  type: "sprite"
  data: "default_animation: \"wall-c\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 144.0
  }
}
embedded_components {
  id: "fill3"
  type: "sprite"
  data: "default_animation: \"wall-r\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 192.0
  }
}
embedded_components {
  id: "fill8"
  type: "sprite"
  data: "default_animation: \"wall-l\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 432.0
  }
}
embedded_components {
  id: "fill9"
  type: "sprite"
  data: "default_animation: \"wall-c\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 480.0
  }
}
embedded_components {
  id: "fill10"
  type: "sprite"
  data: "default_animation: \"wall-c\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 528.0
  }
}
embedded_components {
  id: "fill11"
  type: "sprite"
  data: "default_animation: \"wall-c\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 576.0
  }
}
embedded_components {
  id: "fill12"
  type: "sprite"
  data: "default_animation: \"wall-c\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 624.0
  }
}
embedded_components {
  id: "fill13"
  type: "sprite"
  data: "default_animation: \"wall-c\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
}
embedded_components {
  id: "wall-collision"
  type: "collisionobject"
  data: "type: COLLISION_OBJECT_TYPE_KINEMATIC\n"
  "mass: 0.0\n"
  "friction: 0.1\n"
  "restitution: 0.5\n"
  "group: \"wall\"\n"
  "mask: \"player\"\n"
  "embedded_collision_shape {\n"
  "  shapes {\n"
  "    shape_type: TYPE_BOX\n"
  "    position {\n"
  "      x: 94.0\n"
  "    }\n"
  "    rotation {\n"
  "    }\n"
  "    index: 0\n"
  "    count: 3\n"
  "  }\n"
  "  shapes {\n"
  "    shape_type: TYPE_BOX\n"
  "    position {\n"
  "      x: 530.0\n"
  "    }\n"
  "    rotation {\n"
  "    }\n"
  "    index: 3\n"
  "    count: 3\n"
  "  }\n"
  "  data: 118.0\n"
  "  data: 36.0\n"
  "  data: 10.0\n"
  "  data: 118.0\n"
  "  data: 36.0\n"
  "  data: 10.0\n"
  "}\n"
  ""
}
embedded_components {
  id: "pass-trigger"
  type: "collisionobject"
  data: "type: COLLISION_OBJECT_TYPE_TRIGGER\n"
  "mass: 0.0\n"
  "friction: 0.1\n"
  "restitution: 0.5\n"
  "group: \"pass\"\n"
  "mask: \"player\"\n"
  "embedded_collision_shape {\n"
  "  shapes {\n"
  "    shape_type: TYPE_BOX\n"
  "    position {\n"
  "      x: 313.0\n"
  "      y: 32.0\n"
  "    }\n"
  "    rotation {\n"
  "    }\n"
  "    index: 0\n"
  "    count: 3\n"
  "  }\n"
  "  data: 147.8625\n"
  "  data: 4.0\n"
  "  data: 10.0\n"
  "}\n"
  ""
}
embedded_components {
  id: "spikes"
  type: "sprite"
  data: "default_animation: \"spikes\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    y: -48.0
  }
}
embedded_components {
  id: "spikes1"
  type: "sprite"
  data: "default_animation: \"spikes\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 48.0
    y: -48.0
  }
}
embedded_components {
  id: "spikes2"
  type: "sprite"
  data: "default_animation: \"spikes\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 96.0
    y: -48.0
  }
}
embedded_components {
  id: "spikes3"
  type: "sprite"
  data: "default_animation: \"spikes\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 144.0
    y: -48.0
  }
}
embedded_components {
  id: "spikes5"
  type: "sprite"
  data: "default_animation: \"spikes\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 480.0
    y: -48.0
  }
}
embedded_components {
  id: "spikes4"
  type: "sprite"
  data: "default_animation: \"spikes\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 528.0
    y: -48.0
  }
}
embedded_components {
  id: "spikes6"
  type: "sprite"
  data: "default_animation: \"spikes\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 576.0
    y: -48.0
  }
}
embedded_components {
  id: "spikes7"
  type: "sprite"
  data: "default_animation: \"spikes\"\n"
  "material: \"/builtins/materials/sprite.material\"\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/main/sprites.atlas\"\n"
  "}\n"
  ""
  position {
    x: 624.0
    y: -48.0
  }
}
embedded_components {
  id: "spike-trigger"
  type: "collisionobject"
  data: "type: COLLISION_OBJECT_TYPE_TRIGGER\n"
  "mass: 0.0\n"
  "friction: 0.1\n"
  "restitution: 0.5\n"
  "group: \"spike\"\n"
  "mask: \"player\"\n"
  "embedded_collision_shape {\n"
  "  shapes {\n"
  "    shape_type: TYPE_BOX\n"
  "    position {\n"
  "      x: 72.0\n"
  "      y: -48.0\n"
  "    }\n"
  "    rotation {\n"
  "    }\n"
  "    index: 0\n"
  "    count: 3\n"
  "  }\n"
  "  data: 96.0\n"
  "  data: 8.0305\n"
  "  data: 10.0\n"
  "}\n"
  ""
}
embedded_components {
  id: "spike-trigger1"
  type: "collisionobject"
  data: "type: COLLISION_OBJECT_TYPE_TRIGGER\n"
  "mass: 0.0\n"
  "friction: 0.1\n"
  "restitution: 0.5\n"
  "group: \"spike\"\n"
  "mask: \"player\"\n"
  "embedded_collision_shape {\n"
  "  shapes {\n"
  "    shape_type: TYPE_BOX\n"
  "    position {\n"
  "      x: 552.0\n"
  "      y: -48.0\n"
  "    }\n"
  "    rotation {\n"
  "    }\n"
  "    index: 0\n"
  "    count: 3\n"
  "  }\n"
  "  data: 96.0\n"
  "  data: 8.0305\n"
  "  data: 10.0\n"
  "}\n"
  ""
}
