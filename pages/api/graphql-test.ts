import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { Context,createContext } from "../../graphql/context";
import { schema } from "../../graphql/schema";

const start = async () => {
  const server = new ApolloServer<Context>({ schema })

  const { url } = await startStandaloneServer(server, {
    context: createContext,
    listen: { port: 3000 }
  })


}

start()