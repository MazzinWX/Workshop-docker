Création du dossier de travail
Création du fichier app.py, requirements.txt, dockerfile, docker-compose.yml

Explications des fichiers:

app.py: L'application en python

dockerfile: Une image qui comprend toutes les dépendences que l'application a besoin.
->
FROM: la version de python installée
WORKDIR: le dossier dans lequel le projet prend place
ENV: variable d'environnement utilisé par Flask
RUN: Installation de gcc pour compiler les packages Python
COPY & RUN: Installation des dépendences Python à partir du fichier requirements.txt
COPY: copie le dossier actuel vers le dossier de travail dans l'image docker (ici /code)
CMD: Commande par défaut pour le container

docker-compose.yml:
2 services: web et redis ->

web service utilise une image construite à partir du Dockerfile dans le dossier actuel. Lie ensuite le container et la machine locale au port 5000

redis service utilise une image publique Redis


Pour démarrer l'application, utilisons
    docker-compose up
    
C'est normal si ça prends un peu de temps la première fois, vu que tout doit être téléchargé.

Si vous voyez cette ligne:
    web_1    |  * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
c'est que l'environnement est prêt et l'application est mise en service!

[Linux]:
Il suffit d'aller sur son navigateur et de taper dans la barre d'adresse ceci:
    localhost:5000
ou encore
    127.0.0.1:5000

[MacOS ou Windows avec Docker Machine]:
Pour obtenir l'adresse IP de votre Docker host: 
    docker-machine ip MACHINE_VM
Ensuite dans le navigateur
    http://MACHINE_VM_IP:5000
    
Le message suivant apparait: *Hello World! I have been seen 1 times.*
Rafraichir la page augmente ce nombre. Dans le terminal qui a lancé le *docker-compose up*, on peut voir
les requêtes à chaque fois que la page a été chargée.

Dans un autre terminal, faisons
    docker image ls
    
Celà nous donne l'ensemble des docker image qui sont disponibles, avec leur TAG (modifiable), leur IMAGE ID, leur date de création et leur taille.

Pour arrêter l'application, on peut soit faire *Ctrl-c* dans le terminal qui fait tourner l'image, soit utiliser
    docker-compose down
dans un autre terminal positionné dans le dossier du projet.

Premier contact avec Docker fait!


Maintenant, on va modifier le fichier *docker-compose.yml* pour y ajouter un *bind mount* pour le service web.

**Modification du fichier docker-compose.yml**

Ajouter après la ligne *- "5000:5000"* et avant la ligne *redis:*
        volumes:
          - .:/code
        environment:
          FLASK_ENV: development

Le nouvel élément *volumes* permet de monter (mount) le dossier du projet directement dans */code* dans le container, ce qui permettra de modifier le code "on the fly", sans avoir à reconstruire l'image.
Après avoir ajouté ces 4 lignes, il faut *"rebuild"* le fichier.
    docker-compose up --build


Il suffira de modifier le fichier *app.py* pour modifier l'affichage.