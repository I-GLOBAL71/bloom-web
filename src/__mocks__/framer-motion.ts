import React from 'react';

const createMotionComponent = (_Component: any) => {
  const MotionComponent = function(props: any) {
    const { drag, dragConstraints, style, ...otherProps } = props;
    return React.createElement('div', {
      ...otherProps,
      style: {
        ...style,
        cursor: drag ? 'grab' : undefined
      }
    });
  };
  return MotionComponent;
};

export const motion = new Proxy({}, {
  get: function(_target, prop) {
    if (prop === 'div') {
      return createMotionComponent((props: any) => React.createElement('div', props));
    }
    return function(component: any) {
      return createMotionComponent(component);
    };
  },
  apply: function(_target, _thisArg, args) {
    return createMotionComponent(args[0]);
  }
});

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => children;

export const useMotionValue = (initial: number) => ({
  set: (_value: number) => {},
  get: () => initial,
  onChange: (_callback: (value: number) => void) => () => {},
});

export const useTransform = (_input: any, _inputRange: any, _outputRange: any) => ({
  set: () => {},
  get: () => 0,
  onChange: (_callback: (value: number) => void) => () => {},
});

export const useDragControls = () => ({
  start: () => {},
  setOffset: () => {},
});

export const useSpring = () => ({
  set: () => {},
  get: () => 0,
  onChange: (_callback: (value: number) => void) => () => {},
});

export const useAnimate = () => [null, () => {}] as const;

export const useAnimation = () => ({
  start: () => Promise.resolve(),
  stop: () => {},
  set: () => {},
});

export default motion;