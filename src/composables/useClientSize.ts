import type { ISize } from '@/utils/graphic';
import { ref, watch, type Ref } from 'vue';
import { useEventListener } from './useEventListener';

export function useClientSize(elementRef: Ref<HTMLElement | undefined>): Ref<ISize | undefined> {
  const getSize = (target: HTMLElement | undefined): ISize | undefined => target && {
    width: target.clientWidth,
    height: target.clientHeight,
  };

  const size = ref<ISize | undefined>(getSize(elementRef.value));

  watch(elementRef, () => {
    size.value = getSize(elementRef.value);
  });

  useEventListener(window, 'resize', () => {
    size.value = getSize(elementRef.value);
  });

  return size;
}
