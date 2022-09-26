export interface ISize {
  width: number;
  height: number;
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
