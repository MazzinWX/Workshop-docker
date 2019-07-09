Portainer (outil d'admin)

Kernel compatibility
Docker cannot run correctly if your kernel is older than version 3.10 or if it is missing some modules. To check kernel compatibility, you can download and run the check-config.sh script.

    $ curl https://raw.githubusercontent.com/docker/docker/master/contrib/check-config.sh > check-config.sh

    $ bash ./check-config.sh
