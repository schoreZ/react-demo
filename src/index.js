import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {combineReducers} from 'redux'

function Test(props) {
    return (
        <div>
            <h1>Hello, World</h1>
        </div>
    )
}


const todo = (state, action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                id: action.id,
                text: action.text,
                completed: false
            };
        case 'TOGGLE_TODO':
            if (state.id !== action.id) {
                return state;
            }
            
            return {
                ...state,
                completed: !state.completed
            };
        default:
            return state;
    }
};

const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action)
            ];
        case 'TOGGLE_TODO':
            return state.map(t =>
                todo(t, action)
            );
        default:
            return state;
    }
};

const visibilityFilter = (
    state = 'ALL',
    action
) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
        return action.filter;
        default:
        return state;
    }
};

const todoApp = combineReducers({
    todos,
    visibilityFilter
});


let nextTodoId = 0;
class TodoApp extends Component {
    componentDidMount() {
    }
    
    render() {
        const {store} = this.props;
        // const {todos, visibilityFilter} = store.getState();
        // const visibleTodos = getVisibleTodos(todos, visibilityFilter);
        return (
            <div>
                <AddTodo
                    onAddTodo={(input) => {
                        store.dispatch({
                            type: 'ADD_TODO',
                            id: nextTodoId++,
                            text: input.value
                        })
                        input.value = ''
                        //console.log(store.getState().todos)
                    }}>
                </AddTodo>
                <TodoList
                    store={store}
                    onToggleTodo={(todo) => {
                        store.dispatch({
                            type: 'TOGGLE_TODO',
                            id: todo.id
                        })
                    }}>
                </TodoList>
                <Footer store={this.props.store}
                    onClick={(filter) => {
                        store.dispatch({
                            type: 'SET_VISIBILITY_FILTER',
                            filter: filter
                        })
                    }} >
                </Footer>
            </div>
        )
    };
}

const AddTodo = ({onAddTodo}) => (
    <div>
        <input ref={node => {this.input = node}}></input>
        <button onClick={() => onAddTodo(this.input)}>Add Todo</button>
    </div>
)

class TodoList extends Component{
    componentDidMount() {
        //const {store} = this.props;
        this.unsubscribe = this.props.store.subscribe(() => this.forceUpdate());
        //console.log('TodoList: ' + store.getState().todos)
    }
    
    componentWillUnMount() {
        this.unsubscribe();
    }
    
    render () {
        const {onToggleTodo} = this.props;
        const todos = getVisibleTodos(this.props.store.getState().todos, this.props.store.getState().visibilityFilter)
        return (
            <ul>
                {todos.map(todo =>
                    <li key={todo.id} onClick={() => onToggleTodo(todo)} style={{
                            textDecoration: todo.completed ? 'line-through' : 'none'
                        }}>
                        {todo.text}
                    </li>
                )}
            </ul>
        );
    }
}

class Footer extends Component{
    componentDidMount() {
        const {store} = this.props;
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }
    componentWillUnMount() {
        this.unsubscribe();
    }
    render() {
        const {store, onClick} = this.props;
        return(
            <div>
                <FilterLink filter='ALL' currentFilter={store.getState().visibilityFilter} onClick={onClick}>All</FilterLink>
                {' '}
                <FilterLink filter='ACTIVE' currentFilter={store.getState().visibilityFilter} onClick={onClick}>Active</FilterLink>
                {' '}
                <FilterLink filter='COMPLETED' currentFilter={store.getState().visibilityFilter} onClick={onClick}>Completed</FilterLink>
            </div>
        )
    }
}
const FilterLink = ({filter, currentFilter, onClick, children}) => {
    if (filter === currentFilter) {
        return <span>{children}</span>
    }
    return <a href='#' onClick={(e) => {
            e.preventDefault()
            onClick(filter)
        }}>
        {children}
    </a>
}

function getVisibleTodos(todos, filter) {
    if (filter === 'ALL') {
        return todos;
    } else if (filter === 'ACTIVE') {
        return todos.filter(t => !t.completed)
    } else if (filter === 'COMPLETED') {
        return todos.filter(t=> t.completed)
    }
}


//const store = createStore(todoApp);

const render = () => {
    ReactDOM.render(
        // Render the TodoApp Component to the <div> with id 'root'
        <TodoApp
            store={createStore(todoApp)}
            />,
        document.getElementById('root')
        
    )
};

//store.subscribe(render);
render();
