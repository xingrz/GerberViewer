import type { IPosition } from '@/utils/graphic';
import { watch, type Ref } from 'vue';

export function useMouseEvents(ref: Ref<HTMLElement | undefined>, translate: IPosition, dragging: Ref<boolean>): void {
  watch(ref, () => {
    const target = ref.value;
    if (!target) return;

    target.addEventListener('mousedown', () => {
      dragging.value = true;
    });

    target.addEventListener('mouseup', () => {
      dragging.value = false;
    });

    target.addEventListener('mousemove', (evt) => {
      if (dragging.value) {
        evt.preventDefault();
        translate.x += evt.movementX;
        translate.y += evt.movementY;
      }
    });
  });
}
