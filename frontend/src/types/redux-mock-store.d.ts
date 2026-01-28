declare module 'redux-mock-store' {
  import { AnyAction, Store } from 'redux';

  interface MockStoreCreator<S = any, A extends AnyAction = AnyAction> {
    (state?: S | (() => S)): MockStoreEnhanced<S, A>;
  }

  interface MockStoreEnhanced<S = any, A extends AnyAction = AnyAction> extends Store<S, A> {
    getActions(): A[];
    clearActions(): void;
  }

  function configureStore<S = any, A extends AnyAction = AnyAction>(
    middlewares?: any[]
  ): MockStoreCreator<S, A>;

  export = configureStore;
}
