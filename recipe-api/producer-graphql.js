const server = require('fastify')();
const graphql = require('fastify-gql');
const fs = require('fs');

// schema file for graphql.
const schema = fs.readFileSync(__dirname + '/../shared/graphql-schema.gql').toString();
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;


// resolvers tell grapql how to build response.
const resolvers = {
    // top-level queries.
    Query: {
        pid: () => process.pid,
        recipe: async (_obj, {id}) => {
            if (id != 42) throw new Error(`recipe ${id} not found`);

            return {
                id,
                name: "Chicken Tikka Masala",
                steps: "Throw it in a pot..."
            }
        }
    },
    // runs when a Recipe is retrieved.
    Recipe: {
        ingredients: async (obj) => {
            return (obj.id != 42) ? [] : [
                { id: 1, name: "Chicken", quantity: "1 lb", },
                { id: 2, name: "Sauce", quantity: "2 cups" }
            ]
        }
    }
};

// register graphql with fastify serve.
server
    .register(graphql, { schema, resolvers, graphql: true })
    .listen(PORT, HOST, () => {
        console.log(`Producer running at http://${HOST}:${PORT}/graphql`);
    })
