- Ubuntu from Repository: -

*Update:*

    $ sudo apt-get update

*Installation venant du repo:*

    $ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
    
*Ajout de la clé GPG de docker officielle:*

    $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    
*Vérifions le "fingerprint":*

    $ sudo apt-key fingerprint 0EBFCD88
    
*qui devrait correspondre à ça*
->
    pub   rsa4096 2017-02-22 [SCEA]
          9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
    uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
    sub   rsa4096 2017-02-22 [S]
    
*La commande qui installera la dernière version stable de Docker:*

    $ sudo add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
    
*Et docker est installé! Vérifions ça de suite*
=>

    $ sudo docker run hello-world
    
le container n'existant pas localement, il sera téléchargé la première fois qu'on lance la commande.


**Post-install Linux**

Pour éviter de devoir utiliser sudo à chaque fois, on va inclure son utilisateur actuel dans le groupe docker

*Créer le groupe:*
    $ sudo groupadd docker
    
*Ajouter l'utilisateur dans le groupe:*
    $sudo usermod -aG docker $VOTRE-NOM-D'-UTILISATEUR
    
Quitter la session actuelle et la relancer. Testons ensuite avec *docker* sans le *sudo*
    $ docker run hello-world
    
S'il y a une alerte concernant les permissions de *~/.docker/*  -> il suffit soit de retirer le dossier *~/.docker/* ou bien de changer son propriétaire et ses permissions
    $ sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
    $ sudo chmod g+rwx "$HOME/.docker" -R


    
**Docker compose**
Pour Linux uniquement, MacOs et Windows utilisent la version Desktop et ont déjà Docker Compose intégré

    sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

Ensuite, donnons les droits d'exécution
    sudo chmod +x /usr/local/bin/docker-compose
    
et vérifions que ça fonctionne
    $ docker-compose --version

En cas de soucis de chemin (path), on peut créer un lien symbolique
    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
    
