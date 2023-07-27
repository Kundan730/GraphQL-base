import React from 'react';
import './App.css';
import { useQuery, gql } from '@apollo/client';

const query = gql`
  query GetTodos {
    getTodos {
      title
      completed
      id
      user {
        name
        email
        phone
      }
    }
  }
`;

function App() {
  const { data, loading } = useQuery(query);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className='App'>
      <h2>Todo List</h2>
      <table className='todo-table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Completed</th>
            <th>User</th>
          </tr>
        </thead>
        <tbody>
          {data.getTodos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.title}</td>
              <td className={todo.completed ? 'completed' : 'not-completed'}>
                {todo.completed ? 'Yes' : 'No'}
              </td>
              <td>
                <p className='user-info'>Name: {todo.user.name}</p>
                <p className='user-info'>Email: {todo.user.email}</p>
                <p className='user-info'>Phone: {todo.user.phone}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
