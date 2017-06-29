import isPlainObject from 'lodash/isPlainObject'
import $$observable from 'symbol-observable'

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
/**
 *定义 Redux Action 的初始化 type
 */
export const ActionTypes = {
  INIT: '@@redux/INIT'
}

/**
 * Creates a Redux store that holds the state tree.
 * The only way to change the data in the store is to call `dispatch()` on it.
 *
 * There should only be a single store in your app. To specify how different
 * parts of the state tree respond to actions, you may combine several reducers
 * into a single reducer function by using `combineReducers`.
 *
 * @param {Function} reducer A function that returns the next state tree, given
 * the current state tree and the action to handle.
 *
 * @param {any} [preloadedState] The initial state. You may optionally specify it
 * to hydrate the state from the server in universal apps, or to restore a
 * previously serialized user session.
 * If you use `combineReducers` to produce the root reducer function, this must be
 * an object with the same shape as `combineReducers` keys.
 *
 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
 * to enhance the store with third-party capabilities such as middleware,
 * time travel, persistence, etc. The only store enhancer that ships with Redux
 * is `applyMiddleware()`.
 *
 * @returns {Store} A Redux store that lets you read the state, dispatch actions
 * and subscribe to changes.
 */

export default function createStore(reducer, preloadedState, enhancer) {
  // 如果初始化传入的是函数并且没有传入中间件，则初始化函数设为中间件
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }
  // currentState: 当前数据
  let currentReducer = reducer          // 当前reducer
  let currentState = preloadedState     // 初始化状态
  let currentListeners = []             // 当前订阅的事件
  let nextListeners = currentListeners  // 为什么需要两个 存放回调函数 的变量？
  let isDispatching = false             // 是否正在分配事件

    /**
     * eg: dispatch 后，回调函数正在被逐个执行（ for 循环进行时）
     * 假设回调函数队列原本是这样的 [a, b, c, d]
     *
     * 当 for 循环执行到第 3 步，即 a、b 已经被执行，准备执行 c ，此时，a 被取消订阅
     * 那么此时回调函数队列就变成了 [b, c, d]，第 3 步对应换成了 d，c 被跳过
     * 
     * 为了避免这个问题，本函数会在上述场景中把 currentListeners 复制给 nextListeners
     *
     * 这样 dispatch 后，在逐个执行回调函数的过程中
     * 如果有新增订阅或取消订阅，都在 nextListeners 中操作
     * 让 currentListeners 中的回调函数得以完整地执行
     *
     * 既然新增是在 nextListeners 中 push，因此毫无疑问，新的回调函数不会在本次 currentListeners 的循环体中被触发
     *
     */

  /**
   * 保存一份订阅快照
   * @return {void}
   */
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */

  /**
   * 获取 store 里的当前 state tree
   *
   * @returns {any} 返回应用中当前的state tree
   */
  function getState() {
    return currentState
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  /**
   *
   * 添加一个 listener ，当 dispatch action 的时候执行，这时 state 已经发生了一些变化，
   * 可以在 listener 函数调用 getState() 方法获取当前的 state
   *
   * 你可以在 listener 改变的时候调用 dispatch ，要注意
   *
   * 1. 订阅器（subscriptions） 在每次 dispatch() 调用之前都会保存一份快照。
   *    当你在正在调用监听器（listener）的时候订阅(subscribe)或者去掉订阅（unsubscribe），
   *    对当前的 dispatch() 不会有任何影响。但是对于下一次的 dispatch()，无论嵌套与否，
   *    都会使用订阅列表里最近的一次快照。
   *
   * 2. 订阅器不应该关注所有 state 的变化，在订阅器被调用之前，往往由于嵌套的 dispatch()
   *    导致 state 发生多次的改变，我们应该保证所有的监听都注册在 dispath() 之前。
   *
   * @param {Function} 要监听的函数
   * @returns {Function} 一个可以移除监听的函数
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.')
    }
    //标记有订阅的 listener
    let isSubscribed = true
    //保存一份快照
    ensureCanMutateNextListeners()
    //添加一个订阅函数
    nextListeners.push(listener)
    
    //返回一个取消订阅的函数
    return function unsubscribe() {
      //判断没有订阅一个 listener
      if (!isSubscribed) {
        //调用 unsubscribe 方法的时候，直接 return
        return
      }
      //标记现在没有一个订阅的 listener
      isSubscribed = false

      //保存一下订阅快照
      ensureCanMutateNextListeners()
      //找到当前的 listener
      const index = nextListeners.indexOf(listener)
      //移除当前的 listener
      nextListeners.splice(index, 1)
    }
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
   /**
   * dispath action。这是触发 state 变化的惟一途径。
   * 
   * @param {Object} 一个普通(plain)的对象，对象当中必须有 type 属性
   *
   * @returns {Object} 返回 dispatch 的 action
   *
   * 注意: 如果你要用自定义的中间件， 它可能包装 `dispatch()`
   *       返回一些其它东西，如( Promise )
   */
  function dispatch(action) {
    //判断 action 不是普通对象。也就是说该对象由 Object 构造函数创建
    if (!isPlainObject(action)) {
       //抛出一个异常(actions 必须是一个普通对象. 或者用自定义的中间件来处理异步 actions)
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      )
    }

    // 判断 action 对象的 type 属性等于 undefined 
    if (typeof action.type === 'undefined') {
      //抛出一个异常
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      )
    }

    //判断 dispahch 正在运行，Reducer在处理的时候又要执行 dispatch
    if (isDispatching) {
      //抛出一个异常(Reducer 在处理的时候不能 dispatch action)
      throw new Error('Reducers may not dispatch actions.')
    }

    // 执行当前reducer,当前 reducer 可以被 replace 掉
    try {
      //标记 dispatch 正在运行
      isDispatching = true
      //执行当前 Reducer 函数返回新的 state
      currentState = currentReducer(currentState, action)
    } finally {
      //标记 dispatch 没有在运行 
      isDispatching = false
    }

    // 每次发布时候，更新当前订阅函数
    // 如果发布的时候再订阅，会把下次订阅的函数从当前函数拷贝一份，防止当前执行发布函数受影响
    const listeners = currentListeners = nextListeners
    // 依次执行每个订阅函数
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener()
    }

    return action
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  /**
   * 替换计算 state 的 reducer。
   *
   * 这是一个高级 API。
   * 只有在你需要实现代码分隔，而且需要立即加载一些 reducer 的时候才可能会用到它。
   * 在实现 Redux 热加载机制的时候也可能会用到。
   *
   * @param {Function} store 要用的下一个 reducer.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }
    //当前传入的 nextReducer 赋值给 currentReducer
    currentReducer = nextReducer
    //调用 dispatch 函数，传入默认的 action
    dispatch({ type: ActionTypes.INIT })
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    //订阅方法赋值给变量 outerSubscribe
    const outerSubscribe = subscribe
    return {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      
      /**
       * 这是一个最小的观察订阅方法
       * 
       * @param {Object}  观察着的任何一个对象都可以作为一个 observer.
       * 观察者应该有 `next` 方法
       */
      subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.')
        }
        //获取观察者的状态
        function observeState() {
          // 调用 observer 的 next 方法，获取当前 state
          if (observer.next) {
            observer.next(getState())
          }
        }

        observeState()
        // 将 observeState 当作一个 listener，dispatch 之后自动调用 observer 的 next 方法
        const unsubscribe = outerSubscribe(observeState)
        //返回一个取消订阅的方法
        return { unsubscribe }
      },

      [$$observable]() {
        return this
      }
    }
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT })

  return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
}
