import type { IPosition } from '@/utils/graphic';
import type { Ref } from 'vue';
import { useEventListener } from './useEventListener';

export function useMouseEvents(ref: Ref<HTMLElement | undefined>, translate: IPosition, dragging: Ref<boolean>): void {
  useEventListener(ref, 'mousedown', () => dragging.value = true);
  useEventListener(window, 'mouseup', () => dragging.value = false);
  useEventListener(window, 'mousemove', (evt) => {
    if (dragging.value) {
      evt.preventDefault();
      translate.x += evt.movementX;
      translate.y += evt.movementY;
    }
  });
}
