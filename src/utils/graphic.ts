interface ISize {
  width: number;
  height: number;
}

interface IPosition {
  x: number;
  y: number;
}

export function scaleInside(container: ISize, target: ISize, padding = 0): ISize & IPosition {
  const ratio = target.width / target.height;
  const canvas = <ISize>{ width: container.width - padding * 2, height: container.height - padding * 2 };
  const matchWidth = <ISize>{ width: canvas.width, height: canvas.width / ratio };
  const matchHeight = <ISize>{ width: ratio * canvas.height, height: canvas.height };
  if (matchWidth.height <= canvas.height) {
    return {
      ...matchWidth,
      x: padding,
      y: padding + (canvas.height - matchWidth.height) / 2,
    };
  } else {
    return {
      ...matchHeight,
      x: padding + (canvas.width - matchHeight.width) / 2,
      y: padding,
    };
  }
}
