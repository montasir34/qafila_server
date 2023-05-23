import SchemaBuilder from "@pothos/core";
import { PrismaClient } from "@prisma/client";
import PrismaPlugin from "@pothos/plugin-prisma";
import { DateResolver } from "graphql-scalars";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import utils from "../utils";

export const prisma = new PrismaClient({});

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;

  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});
builder.addScalarType("Date", DateResolver, {});

type ContextType = {
  userId?: string
}

const User = builder.prismaObject("User", {
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    role: t.exposeString("role"),
    posts: t.relation("Post"),
  }),
});

builder.prismaObject('Post', {
 fields: t => ({
   id: t.exposeID('id'),
   body: t.expose('body', {
     type: 'String',
     nullable: true
   }),
   author: t.relation('author'),
   image: t.expose('image', {
     type: 'String',
     nullable: true
   }),
   likes: t.expose('like', {
     type: 'Int',
     nullable: true
   }),
   comments: t.relation('comments'),
   createdAt: t.expose('createdAt', {
     type: 'Date',
     nullable: false
   })
 })
})

 builder.prismaObject('Help', {
  fields: t => ({
    id: t.exposeID('id'),
    type: t.exposeString('type'),
    direction: t.exposeString('direction'),
    discription: t.expose('discription', {
      type: 'String',
      nullable: true
    }),
    image: t.expose('image', {
      type: 'String',
      nullable: true
    }),
    completed: t.exposeBoolean('completed'),
    votes: t.expose('votes', {
      type: 'Int',
      nullable: true
    }),
    payment: t.expose('payment', {
      type: 'String',
      nullable: true
    }),
    createdAt: t.expose('createdAt', {
      type: 'Date',
      nullable: false
    }),
    contact_number: t.expose('contact_number', {
      type: 'Int',
      nullable: true
    }),
    payment_number: t.expose('payment_number', {
      type: 'Int',
      nullable: true
    }),
    contact_type : t.expose('contact_type', {
      type: 'String',
      nullable: true
    }),
    applicant: t.relation('applicant'),
    donor: t.expose('donor', {
      type: 'String',
      nullable: true,
    })
  })
})


 builder.prismaObject('Comment', {
  fields: t => ({
    id: t.exposeID('id'),
    body: t.exposeString('body'),
    author: t.relation('author'),
    post: t.relation('Post'),
    createdAt: t.expose('createdAt', {
      type: 'Date',
      nullable:false
    }),
  })
})


builder.queryType({
  fields: t => ({
    me: t.prismaField({
      type: 'User',
      resolve: async (query, root, args, ctx: ContextType, info) => {
        console.log(ctx.userId);
        
        const me = await prisma.user.findUniqueOrThrow({
          where: {
            id: ctx.userId
          }
        })
        return me
      }
    })
  })
})



builder.mutationType({
  fields: (t) => ({
    createUser: t.field({
      type: User,
      args: {
        name: t.arg({ type: 'String', required: true }),
        email: t.arg({ type: 'String', required: true }),
        password: t.arg({ type: 'String', required: true }),
        image: t.arg({ type: 'String', required: false }),
      },
      resolve: async (root, {name, password, email, image}) => {
          console.log(utils.generateToken('hello', 'USER', 'monte@gmail.com'));
          
        if(!(name || password || email)){
          throw new Error('All fields required')
        }
        

        const user = await prisma.user.create({
          data: {
            password,
            name,
            email,
            image
          }
        })
        return user
      }
    }),
  }),
});
export default builder;
