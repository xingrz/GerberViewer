import type { IPosition, IScale } from '@/utils/graphic';
import type { Ref } from 'vue';
import { useEventListener } from './useEventListener';

export function useWheelEvents(ref: Ref<HTMLElement | null | undefined>, translate: IPosition & IScale): void {
  useEventListener(ref, 'wheel', (evt) => {
    evt.preventDefault();
    if (evt.ctrlKey) {
      const el = ref.value;
      if (!el) return;

      const oldScale = translate.scale;
      const newScale = oldScale - evt.deltaY / 100;

      const centerX = el.clientWidth / 2;
      const centerY = el.clientHeight / 2;
      const pointerX = evt.offsetX - centerX;
      const pointerY = evt.offsetY - centerY;

      const ratio = Math.pow(2, newScale) / Math.pow(2, oldScale);
      translate.x = pointerX - ratio * (pointerX - translate.x);
      translate.y = pointerY - ratio * (pointerY - translate.y);
      translate.scale = newScale;
    } else {
      translate.x -= evt.deltaX;
      translate.y -= evt.deltaY;
    }
  });
}
