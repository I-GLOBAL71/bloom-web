// Mock de react-is
const ReactIs = {
  isElement: () => false,
  isValidElementType: () => true,
  isFragment: () => false,
  isSuspense: () => false,
  isLazy: () => false,
  isMemo: () => false,
  isForwardRef: () => false,
  isPortal: () => false,
  isProfiler: () => false,
  isStrictMode: () => false,
  AsyncMode: Symbol.for('react.async_mode'),
  ConcurrentMode: Symbol.for('react.concurrent_mode'),
  ContextConsumer: Symbol.for('react.context'),
  ContextProvider: Symbol.for('react.provider'),
  Element: Symbol.for('react.element'),
  ForwardRef: Symbol.for('react.forward_ref'),
  Fragment: Symbol.for('react.fragment'),
  Lazy: Symbol.for('react.lazy'),
  Memo: Symbol.for('react.memo'),
  Portal: Symbol.for('react.portal'),
  Profiler: Symbol.for('react.profiler'),
  StrictMode: Symbol.for('react.strict_mode'),
  Suspense: Symbol.for('react.suspense')
};

module.exports = ReactIs;