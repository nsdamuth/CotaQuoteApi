FROM graphile/postgraphile:4

WORKDIR /postgraphile

RUN npm install postgraphile-plugin-connection-filter --prefix /postgraphile

# Force Node to look in /postgraphile/node_modules
ENV NODE_PATH=/postgraphile/node_modules
