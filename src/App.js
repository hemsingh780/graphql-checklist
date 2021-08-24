
import React from "react";
import { useQuery , gql ,useMutation} from '@apollo/client'

// add todos
// toggle todos 
// delete todos 
// list todos
const GET_TODOS = gql`
query getTodos {
  todos {
    done
    id
    text
  }
}
`

  const TOGGLE_TODO = gql`
  mutation toggleTodo($id: uuid! , $done: Boolean!) {
    update_todos(where: {id: {_eq:$id}}, _set: {done:  $done}) {
      returning {
        done
        id
        text
      }
    }
  }
`

  const ADD_TODO = gql`
  mutation addTodo($text:String!){
    insert_todos(objects: {text: $text}) {
      returning {
        done
        id
        text
      }
    }
  }
  `
  const DELETE_TODO = gql`
  mutation deleteTodo($id: uuid!) {
    delete_todos(where: {id: {_eq: $id}}) {
      returning {
        done
        id
        text
      }
    }
  }
  `

function App() {
  const [todoText, setTodoText] = React.useState('')

  const {data,loading , error} = useQuery(GET_TODOS)
  const [ toggleTodo ] =  useMutation(TOGGLE_TODO)
  const [ addTodo ] = useMutation(ADD_TODO,{
    onCompleted:() => setTodoText('')
  })
  const [deleteTodo] = useMutation(DELETE_TODO)

  if(loading) return <div>loading todos....</div>
  if(error) return <div>error fetching todos !</div>

  async function  handleToggleTodo({id,done}){
   const data = await toggleTodo({variables:{id,done: !done}})
  //  console.log(data)
  }  
  
  async function handleAddTodo(event) {
      event.preventDefault();
      if(!todoText.trim()) return;
      const data = await addTodo({
        variables: {text:todoText},
        refetchQueries:[
          {query:GET_TODOS}
        ]
      })
  }
  
  async function handleDeleteTodo({id}) {
   const isConfirmed =  window.confirm('Do you want to delete this todo ?');
  if(isConfirmed){
   const data =   await deleteTodo({
     variables:{id},
      refetchQueries:[
        {query:GET_TODOS}
      ]
    })
   console.log(data)
  }
  }


  return (
    <div className="vh-100 code flex flex-column items-center bg-purple white pa3 fl-1">
      <h1 className="f2-1">Grapql Checklist {" "}
      <span role='img' aria-label="checkmark">
       ✅
      </span>
      </h1>

      {/* Todo Form */}

      <form className="mb3" onSubmit={handleAddTodo}>
        <input
         className="pa2 f4 b--dashed" 
         type='text'
         placeholder='Write yout todo'
         onChange={event => setTodoText(event.target.value)}
         value={todoText}
         />
        <button className="pa2 f4 bg-green" type='submit'>Create</button>
      </form>

      {/* Todo List */}

      <div className="flex items-center justify-center flex-column">
          {
            data.todos.map(todo => (
              <p onDoubleClick={()=>handleToggleTodo(todo)} key={todo.id}>
                  <span className={`pointer list pa1 f3 ${todo.done && 'strike'}`}>
                    {todo.text}
                  </span>
                  <button className="bg-transparent nt bn f4" onClick={() => handleDeleteTodo(todo)}>
                  <span className="red">&times;</span>
                  </button>
              </p>
            ))
          }
    </div>
    </div>
  );
}

export default App;
