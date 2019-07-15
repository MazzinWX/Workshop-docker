### *Partie 1*

Go pour Docker-UI-demo

Commençons par la création du Dockerfile du frontend
__*Explications du Dockerfile du frontend:*__

    FROM node:11.1.0-alpine AS node_base
->
ça définit notre image de base. Version 11.1.0 de Node avec Yarn

    FROM node_base as deps
    WORKDIR /usr/app
    COPY package.json /usr/app/package.json
    COPY yarn.lock /usr/app/yarn.lock
    RUN yarn install
->
Installation des dépendences avec Yarn

    FROM node_base as build
    WORKDIR /usr/app
    COPY --from=deps /usr/app/node_modules /usr/app/node_modules
    COPY . /usr/app
    RUN yarn build
->
Récupère les dépendences de la deuxième étape et "build" l'ensemble avec le Webpack

    FROM scratch AS ui
    COPY --from=build /usr/app/dist /usr/app
->
Dernière partie, une image vide (scratch) et on y copie les assets fait lors de la précédente étape.


On va pouvoir *build* grâce à cette commande:
    docker build -t #pseudo_hub#/docker-ui-demo .


Mais on pourrait également utiliser un fichier Makefile utilisant le *Make*.
    GIT_SHA=$(shell git rev-parse HEAD)
    TAG=#pseudo_hub#/docker-ui-demo
    all: build
    build:
	    docker build -t $(TAG):$(GIT_SHA) . \
        && docker tag $(TAG):$(GIT_SHA) $(TAG):latest
    .PHONY: build

Il suffit d'utiliser *make build* ensuite.

__*Partie serveur*__

Va falloir lancer le serveur, donc créeons un dossier *nginx-server* avec un *Dockerfile*
    FROM socialengine/nginx-spa
    COPY --from=#pseudo_hub#/docker-ui-demo /usr/app /app

Maintenant on peut *build* l'image du serveur web:
    docker build -t #pseudo_hub#/docker-nginx-demo
et l'utiliser:
    docker run -it --rm 8000:80 #pseudo_hub#/docker-nginx-demo

L'application sera maintenant disponible sur le port 8000 de *localhost*

La première partie est terminée; place à la suite!

### *Partie 2*

En principe on pourrait utiliser ceci:
    yarn run dev --env.api-url https://api.thecatapi.com --env.port 3000

Mais notre but sera de créer une image *dev* qui va nous permettre de faire tourner des scripts *yarn* dans un container et utiliser les *volumes Docker* pour partager les fichiers entre le container et l'hôte.

__*dev.Dockerfile*__

Ajoutons un fichier dev.Dockerfile avec ceci dedans:
    FROM node:11.1.0-alpine AS node_base

    FROM node_base as deps
    WORKDIR /usr/app
    COPY package.json /usr/app/package.json
    COPY yarn.lock /usr/app/yarn.lock
    RUN yarn install

    FROM node_base as dev
    WORKDIR /usr/app
    COPY --from=deps /usr/app/node_modules /usr/app/node_modules
    COPY . /usr/app
    ENTRYPOINT ["yarn"]

Et pas besoin de fichier *.dockerignore* supplémentaire.

La dernière partie * ENTRYPOINT* forcera l'utilisation de *yarn* au lieu du shell.

Docker build et tag:
    docker build -f dev.Dockerfile -t #pseudo_hub#/docker-ui-demo-dev .

Maintenant on peut lancer l'environnement de développement:
    docker run -it --rm -p 3000:3000 #pseudo_hub#/docker-ui-demo-dev dev --env.api-url https://api.thecatapi.com --env.host 0.0.0.0 --env.port 3000

L'environnement *dev* devrait maintenant tourner sur *localhost:3000*
Dès que vous voulez faire des changement dans le dossier *src*, l'app ne se met pas à jour... Pourquoi??

La réponse vient des *volumes*
Pour le moment, les fichiers édités en local ne sont pas les même que les fichiers dans le container.
On va avoir besoin d'utiliser les *Docker Volumes* pour partager le tout.

*Schéma 3 types de volumes*

Il y a 3 sortes de *volumes*:
En utilisant *-v* ou *--volume*, avec une syntaxe très rigide mais qui combine toutes les options.
*--mount* qui est beaucoup plus explicite et verbeux. C'est celui qu'on va utiliser.
Le dernier c'est *tmpfs*, pour les data non persistentes, pas utile pour nous.

Si on fait:
    docker run -it --rm -p 3000:3000 --mount source=src,target=/usr/app/src mazzinwx/docker-ui-demo-dev dev --env.api-url https://my-api.com --env.host 0.0.0.0 --env.port 3000
Le volume est bien monté, suffit de vérifier avec cette commande:
    docker volume ls
puis avec le nom
    docker volume inspect #nom_du_volume#

__*fin partie 2*__


### *Partie 3*

Ajouter/retirer des packages et l'administration.

On va ajouter un peu de style à cette appli!
    yarn add @emotion/core @emotion/styled
On va également ajouter au Makefile cette ligne:
    VOLUME_MOUNTS_WITH_DEP_STUFF=$(VOLUME_MOUNTS) --mount source=yarn.lock,target=/usr/app/
Avec ceci un peu plus bas:
    run-yarn:
	docker run -it --rm $(VOLUME_MOUNTS_WITH_DEP_STUFF) $(TAG_DEV) $(ARGS)
	
On va ajouter les package =>
    make build-dev
    
    make run-yarn ARGS="add @emotion/core @emotion/styled"

Normalement les fichiers *package.json* et *yarn.lock* ont dû changer.
Vérifions:
    git diff package.json yarn.lock
    
On peut vérifier avec *yarn* également:
    make run-yarn ARGS="list --pattern emotion"
    
On importe ensuite dans l'environnement de dev:
    make run-dev API_URL=https://api.thecatapi.com

    
Et voilà!!!!!
