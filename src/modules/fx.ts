export const coin      = (): void => msg.post("main:/audio#fx", "play", { sound: "#coin" });
export const dead      = (): void => msg.post("main:/audio#fx", "play", { sound: "#dead" });
export const hit       = (): void => msg.post("main:/audio#fx", "play", { sound: "#hit" });
export const press     = (): void => msg.post("main:/audio#fx", "play", { sound: "#press" });
export const menu_item = (): void => msg.post("main:/audio#fx", "play", { sound: "#menu-item" });
