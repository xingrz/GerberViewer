import type { IPosition, IScale } from '@/utils/graphic';
import type { Ref } from 'vue';
import { useEventListener } from './useEventListener';

export function useWheelEvents(ref: Ref<HTMLElement | undefined>, translate: IPosition & IScale): void {
  useEventListener(ref, 'wheel', (evt) => {
    evt.preventDefault();
    if (evt.ctrlKey) {
      const value = translate.scale - evt.deltaY / 100;
      translate.scale = value;
    } else {
      translate.x -= evt.deltaX;
      translate.y -= evt.deltaY;
    }
  });
}
