import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue';

export function useEventListener<T extends HTMLElement, K extends keyof GlobalEventHandlersEventMap>(
  ref: Ref<T | undefined>,
  type: K, listener: (this: HTMLElement, ev: GlobalEventHandlersEventMap[K]) => unknown
): void {
  const bindListener = () => {
    ref.value?.addEventListener(type, listener);
  };

  watch(ref, bindListener);
  onMounted(bindListener);

  onBeforeUnmount(() => {
    ref.value?.removeEventListener(type, listener);
  });
}
