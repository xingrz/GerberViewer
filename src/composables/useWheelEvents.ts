import type { IPosition, IScale } from '@/utils/graphic';
import { watch, type Ref } from 'vue';

export function useWheelEvents(ref: Ref<HTMLElement | undefined>, translate: IPosition & IScale): void {
  watch(ref, () => {
    const target = ref.value;
    if (!target) return;

    target.addEventListener('wheel', (evt) => {
      evt.preventDefault();
      if (evt.ctrlKey) {
        const value = translate.scale - evt.deltaY / 100;
        translate.scale = Math.max(0, value);
      } else {
        translate.x -= evt.deltaX;
        translate.y -= evt.deltaY;
      }
    });
  });
}
