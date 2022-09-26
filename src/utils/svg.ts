import { Buffer } from 'buffer';

export function loadSvgImage(svg: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    return img;
  });
}
