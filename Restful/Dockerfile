# Add Copyright Information
FROM node:latest
LABEL maintainer='nick@cotasystem.com'
ADD VERSION .

ARG DOMAIN=${DOMAIN}
ARG API_URL=${API_URL}
ARG CLIENT_PORT=${CLIENT_PORT}
ARG CLIENT_SECRET=${CLIENT_SECRET}

RUN apt-get -y update && \
    apt-get -y dist-upgrade && \
    apt-get -y upgrade

COPY ./assets/src/ /opt/app

WORKDIR /opt/app
# RUN npm install

# COPY ./assets/entrypoint.sh /opt/app/
# RUN chmod +x /opt/app/entrypoint.sh
# RUN echo "\nREACT_APP_API_URL=${API_URL}" >> /opt/app/.env
# RUN echo "\nREACT_APP_DOMAIN=${DOMAIN}" >> /opt/app/.env
# RUN echo "\nREACT_APP_CLIENT_SECRET=${CLIENT_SECRET}" >> /opt/app/.env
# RUN npm install

# Ensure a new swagger.json file is generated.
# RUN npm run swagger-autogen

RUN sed -i "s/PORT\=3000/PORT\=${CLIENT_PORT}/g" /opt/app/package.json
# RUN sed -i "s/DOMAIN/${DOMAIN}/g" /opt/app/src/Keycloak.js
# ENTRYPOINT [ "npm" ,"start", "--prefix", "/opt/app/"]

# Add minimizing efforts. Remove components no longer essential to operation. disable apt
# RUN chmod 0 /usr/bin/apt-get

# Retain, but commented out; For troubleshooting
ENTRYPOINT ["tail", "-f", "/dev/null"]
# 
# Retain, but commented out; For altnertive loading in case of a need for post build procedures
# CMD [ "/opt/entrypoint.sh" ]