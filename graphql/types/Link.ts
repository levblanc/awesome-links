import { extendType, intArg, objectType, stringArg } from 'nexus';
import { User } from './User';

export const Link = objectType({
  name: 'Link',
  definition(t) {
    t.string('id');
    t.string('title');
    t.string('url');
    t.string('description');
    t.string('imageUrl');
    t.string('category');
    t.list.field('users', {
      type: User,
      async resolve(parent, _args, ctx) {
        return await ctx.prisma.link
          .findUnique({ where: { id: parent.id } })
          .users();
      },
    });
  },
});

export const Edge = objectType({
  name: 'Edge',
  definition(t) {
    t.string('cursor');
    t.field('node', {
      type: Link,
    });
  },
});

export const PageInfo = objectType({
  name: 'PageInfo',
  definition(t) {
    t.string('endCursor');
    t.boolean('hasNextPage');
  },
});

export const Response = objectType({
  name: 'Response',
  definition(t) {
    t.field('pageInfo', { type: PageInfo });
    t.list.field('edges', {
      type: Edge,
    });
  },
});

export const LinksQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('links', {
      type: 'Response',
      args: {
        first: intArg(),
        after: stringArg(),
      },
      async resolve(_parent, args, ctx) {
        let baseOption = {
          take: args.first, // number of items to return from the database
        };

        let queryOptions = baseOption;

        if (args.after) {
          // check if there is a cursor as the argument
          queryOptions = {
            ...baseOption,
            skip: 1, // skip the cursor
            cursor: {
              id: args.after, // the cursor
            },
          };
        }

        const queryResults = await ctx.prisma.link.findMany(queryOptions);

        // if the initial request returns links
        if (queryResults.length > 0) {
          // get last item in previous result set
          const lastItem = queryResults.at(-1);
          // cursor we will return in subsequent requests
          const cursor = lastItem?.id;

          // query after the cursor to check if we have next page
          const queryNextPage = await ctx.prisma.link.findMany({
            ...baseOption,
            cursor: {
              id: cursor,
            },
          });

          const result = {
            pageInfo: {
              endCursor: cursor,
              hasNextPage: queryNextPage.length >= args.first,
            },
            edges: queryResults.map((link) => ({
              cursor: link.id,
              node: link,
            })),
          };

          return result;
        }

        return {
          edges: [],
          pageInfo: {
            endCursor: '',
            hasNextPage: false,
          },
        };
      },
    });
  },
});
