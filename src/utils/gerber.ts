import type { InputLayer } from 'pcb-stackup';
import type { GerberProps, GerberSide, GerberType } from 'whats-that-gerber';
import { Buffer } from 'buffer';

export async function readLayers(entries: Record<string, Uint8Array>): Promise<InputLayer[]> {
  const layers = <InputLayer[]>[];
  for (const name of Object.keys(entries)) {
    const { type, side } = mapLayerType(name) || {};
    if (type && side) {
      layers.push({ type, side, gerber: Buffer.from(entries[name]), filename: name });
    }
  }
  return layers;
}

function mapLayerType(name: string): GerberProps | undefined {
  let type: GerberType | undefined;
  let side: GerberSide | undefined;

  const segments = name.toLowerCase().split(/_|-|\./);

  if (segments[segments.length - 1] == 'drl') {
    return { type: 'drill', side: 'all' };
  }

  if (segments.find(s => s.startsWith('edge'))) {
    return { type: 'outline', side: 'all' };
  }

  if (segments.includes('sm') || segments.find(s => s.includes('mask'))) {
    type = 'soldermask';
  } else if (segments.includes('sp') || segments.find(s => s.includes('paste'))) {
    type = 'solderpaste';
  } else if (segments.includes('ss') || segments.find(s => s.includes('silk'))) {
    type = 'silkscreen';
  } else if (segments.includes('cu')) {
    type = 'copper';
  }

  if (segments.find(s => s.startsWith('in'))) {
    side == 'inner';
  } else if (segments.includes('f') || segments.includes('top')) {
    side = 'top';
  } else if (segments.includes('b') || segments.includes('bottom')) {
    side = 'bottom';
  }

  if (type && side) {
    return { type, side };
  }
}
