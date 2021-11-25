import * as zzfx_api from 'zzfx.api';

export const dead      = (): void => play("Hit 11", 2.46,.05,367,.01,.09,.05,2,2.39,-6.4,0,0,0,.09,1.3,0,.3,.11,.61,.07,.12);
export const hit       = (): void => play("Hit 9", 1.01,.05,312,.02,.01,.17,0,1.11,0,0,0,0,0,1.8,-57,0,0,.59,.01,0);
export const press     = (): void => play("Blip 20", 1.99,.05,1898,0,.01,.01,2,2.6,2.7,-67,0,0,.1,0,-1,0,.1,1,.02,0);
export const menu_item = (): void => play("Blip 17", 1.06,.05,142,.02,.01,.01,1,2.03,2.8,0,473,.04,0,0,-2.2,0,0,.32,.01,0);

const fx = new Map<string, ZzFXSample>();
function play(sound: string, ...args: number[]): void {
  print(fx.has(sound), ...args);
  if (!fx.has(sound)) fx.set(sound, zzfx_api.build_sample(...args));

  const sample = fx.get(sound);
  if (sample !== undefined) zzfx_api.play_sample(sample);
}
