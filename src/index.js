import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {createStore, combineReducers} from 'redux'
import {Provider, connect} from 'react-redux'

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

    render() {
        const {store} = this.props;
        return (
            <div>
                <AddTodoZ />
                <VisibleTodoList />
                <FooterZ />
            </div>
        )
    };
}

class AddTodo extends Component{
    
    render() {
        const {dispatch} = this.props;
        return (
            <div>
                <input ref={node => {this.input = node}}></input>
                <button onClick={() => {dispatch({
                        id: nextTodoId++,
                        text: nextTodoId + ': ' + this.input.value,
                        type: 'ADD_TODO'
                    });
                    this.input.value = ''
                }}>Add Todo {nextTodoId}</button>
            </div>
        )
    }
}

const TodoList = ({todos, onToggleTodo}) => (
    <ul>
        {
            todos.map(todo =>
                <li
                    key={todo.id}
                    onClick={() => onToggleTodo(todo.id)}
                    style={{
                        textDecoration: todo.completed ? 'line-through' : 'none'
                    }}
                    >
                    {todo.text}
                </li>
            )
        }
    </ul>
)

class Footer extends Component{
    render() {
        const {currentFilter, onClick} = this.props;
        return(
            <div>
                <FilterLink filter='ALL' currentFilter={currentFilter} onClick={onClick}>All</FilterLink>
                {' '}
                <FilterLink filter='ACTIVE' currentFilter={currentFilter} onClick={onClick}>Active</FilterLink>
                {' '}
                <FilterLink filter='COMPLETED' currentFilter={currentFilter} onClick={onClick}>Completed</FilterLink>
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

const mapStoreToProps = (state) => (
    {
        todos: getVisibleTodos(state.todos, state.visibilityFilter)
    }
)

const mapDispatchToProps = (dispatch) => (
    {
        onToggleTodo: (id) => dispatch({
            id: id,
            type: 'TOGGLE_TODO'
        })
    }
)

const VisibleTodoList = connect(
    mapStoreToProps,
    mapDispatchToProps
)(TodoList)

const AddTodoZ = connect(state=>{
    return {state}
},null)(AddTodo)

const FooterZ = connect(state => ({
    currentFilter: state.visibilityFilter
}), dispatch => ({
    onClick: (filter) => dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter
    })
}))(Footer)

const render = () => {
    ReactDOM.render(
        // Render the TodoApp Component to the <div> with id 'root'
        <Provider store={createStore(todoApp)}>
            <TodoApp />
        </Provider>,
        document.getElementById('root')
        
    )
};

//store.subscribe(render);
render();
