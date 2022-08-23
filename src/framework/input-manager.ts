import { viewScale } from '../sketch.js';

const INPUT_EVENT_TYPES = [
  'mouseClicked',
  'mousePressed',
  'mouseReleased',
  'doubleClicked',
  'mouseMoved',
  'mouseDragged',
  'mouseWheel',
  'keyPressed',
  'keyReleased',
  'keyTyped',
] as const;
type InputEventType = typeof INPUT_EVENT_TYPES[number];

type InputEventListener = object;
type InputEventCallback = (event?: Event) => void;

// All listeners currently registered
const listenerSet = new Set<InputEventListener>();
// Maps each event type to the specific listeners who care about it
const listenerMap = new Map<InputEventType, InputEventListener[]>();
// If a global definition for an event existed before InputManager, keep a reference for restoring
const prevEventFuncMap = new Map<InputEventType, InputEventCallback>();

let pointerLockIsRequired = false;
let lastPointerLockChangeTime = -Infinity;

const InputManager = {
  get mousePos(): { x: number, y: number } { return { x: mouseX / viewScale, y: mouseY / viewScale }; },
  get mouseDelta(): { x: number, y: number } { return { x: movedX / viewScale, y: movedY / viewScale }; },

  get hasPointerLock(): boolean { return document.pointerLockElement !== null; },

  addListener(listener: InputEventListener): void {
    if (listenerSet.has(listener)) {
      return;
    }
    listenerSet.add(listener);

    for (const eventType of INPUT_EVENT_TYPES.filter(eventType => listener[eventType] !== undefined)) {
      if (!listenerMap.has(eventType)) {
        wrapEvent(eventType);
        listenerMap.set(eventType, []);
      }
      listenerMap.get(eventType).push(listener);
    }
  },

  removeListener(listener: InputEventListener): void {
    if (!listenerSet.has(listener)) {
      return;
    }
    listenerSet.delete(listener);

    for (const [eventType, listenerList] of [...listenerMap]) {
      if (listenerList.includes(listener)) {
        listenerList.splice(listenerList.indexOf(listener), 1);
        if (listenerList.length === 0) {
          listenerMap.delete(eventType);
          unwrapEvent(eventType);
        }
      }
    }
  },

  requirePointerLock(): void {
    pointerLockIsRequired = true;

    document.addEventListener('pointerlockchange', () => {
      lastPointerLockChangeTime = millis();
    });

    document.addEventListener('mousedown', () => {
      if (!InputManager.hasPointerLock && millis() - lastPointerLockChangeTime > 1500) {
        requestPointerLock();
      }
    });
  },
};

function tryDispatchEvent(eventType: InputEventType, event?: Event): void {
  if (pointerLockIsRequired && !InputManager.hasPointerLock) return;

  listenerMap.get(eventType).forEach(listener => (listener[eventType] as InputEventCallback).apply(listener, event));
}

function wrapEvent(eventType: InputEventType): void {
  const eventFunc = function (event?: Event): void { tryDispatchEvent(eventType, event); };
  const prevEventFunc: InputEventCallback = globalThis[eventType];

  if (prevEventFunc === undefined) {
    globalThis[eventType] = eventFunc;
  } else {
    globalThis[eventType] = function (event?: Event): void {
      eventFunc(event);
      prevEventFunc(event);
    };
    prevEventFuncMap.set(eventType, prevEventFunc);
  }
}

function unwrapEvent(eventType: InputEventType): void {
  if (prevEventFuncMap.has(eventType)) {
    globalThis[eventType] = prevEventFuncMap.get(eventType);
    prevEventFuncMap.delete(eventType);
  } else {
    delete globalThis[eventType];
  }
}

export default InputManager;
