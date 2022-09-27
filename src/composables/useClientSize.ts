import type { ISize } from '@/utils/graphic';
import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

export function useClientSize(elementRef: Ref<HTMLElement | undefined>): Ref<ISize | undefined> {
  const getSize = (target: HTMLElement | undefined): ISize | undefined => target && {
    width: target.clientWidth,
    height: target.clientHeight,
  };

  const size = ref<ISize | undefined>(getSize(elementRef.value));

  const observer = new ResizeObserver(() => {
    size.value = getSize(elementRef.value);
  });

  watch(elementRef, () => {
    if (elementRef.value) {
      observer.observe(elementRef.value);
    }
  });

  onMounted(() => {
    if (elementRef.value) {
      observer.observe(elementRef.value);
    }
  });

  onBeforeUnmount(() => {
    if (elementRef.value) {
      observer.unobserve(elementRef.value);
    }
  });

  return size;
}
