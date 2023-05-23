
import express from "express";
import { createYoga } from "graphql-yoga";
import { useCookies } from "@whatwg-node/server-plugin-cookies";
import builder from "./builder";

const schema = builder.toSchema()
const app = express();
app.use(express.json())

const yoga = createYoga({
  schema,
  context:async (ctx) => {
   return {
    ...ctx,
    userId: 'monte id',
    coockies: ctx.request.cookieStore
   } 
  },
  plugins: [useCookies]
});
app.use("/graphql", yoga);
app.listen(8000, () => console.log(`server runing on port 8000`)
);