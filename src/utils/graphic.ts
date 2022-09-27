export interface ISize {
  width: number;
  height: number;
}

export interface IPosition {
  x: number;
  y: number;
}

export interface IScale {
  scale: number;
}

export function scaleInside(container: ISize, target: ISize, padding = 0): ISize {
  const ratio = target.width / target.height;
  const canvas = <ISize>{ width: container.width - padding * 2, height: container.height - padding * 2 };
  const matchWidth = <ISize>{ width: canvas.width, height: canvas.width / ratio };
  const matchHeight = <ISize>{ width: ratio * canvas.height, height: canvas.height };
  if (matchWidth.height <= canvas.height) {
    return matchWidth;
  } else {
    return matchHeight;
  }
}

export function centerOf(container: ISize): IPosition {
  return { x: container.width / 2, y: container.height / 2 };
}

export function withIn(value: number, max: number) {
  return Math.min(max, Math.max(-max, value));
}
