import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
      type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone: String!
        website: String!
      }

      type Todo {
        id: ID!
        title: String!
        completed: Boolean
        user: User
      }

      type Query {
        getTodos: [Todo]
        getAllUsers: [User]
        getUser(id: ID!): User
      }
    `,
    resolvers: {
      Todo: {
        user: async (todo) => (
          await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)
        ).data,
      },
      Query: {
        getTodos: async () => {
          // Fetch all todos from the API
          const allTodos = (await axios.get('https://jsonplaceholder.typicode.com/todos')).data;

          // Return only the first 10 todos
          return allTodos.slice(0, 10);
        },
        getAllUsers: async () => (
          await axios.get('https://jsonplaceholder.typicode.com/users')
        ).data,
        getUser: async (parent, {id}) => (
          await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
        ).data,
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();

  app.use('/graphql', expressMiddleware(server));

  const PORT = 8000;

  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

startServer();
