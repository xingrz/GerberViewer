import { isRef, onBeforeUnmount, onMounted, unref, watch, type Ref } from 'vue';

export function useEventListener<K extends keyof WindowEventMap>(
  ref: Window,
  type: K, listener: (this: Window, ev: WindowEventMap[K]) => unknown
): void;

export function useEventListener<K extends keyof GlobalEventHandlersEventMap>(
  ref: Ref<GlobalEventHandlers | undefined>,
  type: K, listener: (this: GlobalEventHandlers, ev: GlobalEventHandlersEventMap[K]) => unknown
): void;

export function useEventListener<K extends keyof (WindowEventMap | GlobalEventHandlersEventMap)>(
  ref: Window | Ref<GlobalEventHandlers | undefined>,
  type: K, listener: (this: Window | GlobalEventHandlers, ev: (WindowEventMap | GlobalEventHandlersEventMap)[K]) => unknown
): void {
  const bindListener = () => {
    unref(ref)?.addEventListener(type, listener);
  };

  if (isRef(ref)) {
    watch(ref, bindListener);
  }

  onMounted(bindListener);

  onBeforeUnmount(() => {
    unref(ref)?.removeEventListener(type, listener);
  });
}
