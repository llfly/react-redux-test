// 把 action creators 转成拥有同名 keys 的对象，但使用 dispatch 把每个 action creator 包围起来，这样可以直接调用它们
// 一般情况下可以直接在 Store 实例上调用 dispatch，如果在 React 中使用 Redux，react-redux 会提供 dispatch
// 惟一使用 bindActionCreators 的场景是需要把 action creator 往下传到一个组件上，却不想让这个组件觉察到 Redux 的存在，而且不希望把 Redux store 或 dispatch 传给它。


// actions.js
function addTodo(text) {
  return {
    type: 'ADD_TODO',
    text
  }
}

function removeTodo(id) {
  return {
    type: 'REMOVE_TODO',
    id
  }
}

const actions = { addTodo, removeTodo }

// App.js
class App extends Component {
  render() {
    const { visibleTodos, visibilityFilter, actions } = this.props
    return (
      <div>
        <AddTodo
          onAddClick={text =>
            actions.addTodo(text)
          }/>
        <TodoList
          todos={visibleTodos}
          onTodoClick={index =>
            actions.completeTodo(index)
          }/>
        <Footer
          filter={visibilityFilter}
          onFilterChange={nextFilter =>
            actions.setVisibilityFilter(nextFilter)
          }/>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch, a) {
  return { actions: bindActionCreators(actions, dispatch) }
}

const FinalApp = connect(select, mapDispatchToProps)(App)

ReactDOM.render(
  <Provider store={createStore(reducer)}>
    <FinalApp />
  </Provider>,
  document.getElementById('app')
)
// 这样就可以把 dispatch 包装后的 actions 直接传递给app，而 app 内部无需再 diapatch(action)