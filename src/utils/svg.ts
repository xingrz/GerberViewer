import type { ISize } from './graphic';
import { Buffer } from 'buffer';

export function loadSvgImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    return img;
  });
}

export async function toSVG(svg: string): Promise<Uint8Array> {
  return new TextEncoder().encode(svg);
}

export async function toPNG(svg: string, background?: string): Promise<Uint8Array> {
  const img = await loadSvgImage(svg);
  const { width, height } = getSizeInMM(svg);

  const canvas = document.createElement('canvas');
  canvas.width = width * 100;
  canvas.height = height * 100;

  const ctx = canvas.getContext('2d')!;

  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const req = await fetch(canvas.toDataURL('image/png'));
  return new Uint8Array(await req.arrayBuffer());
}

// TODO: A better way
function getSizeInMM(svg: string): ISize {
  const match = svg.match(/<svg [^>]*width="([^"]+)mm"\sheight="([^"]+)mm"[^>]*>/);
  return {
    width: parseFloat(match?.[1] || '0'),
    height: parseFloat(match?.[2] || '0'),
  };
}
