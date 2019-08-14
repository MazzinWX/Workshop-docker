For installation of Docker on Windows 10 with Hyper-V capacity ( Check if Hyper-V is available by using Speccy )
If Win 10 + Hyper-V  
=> __Docker Desktop__  
`( https://hub.docker.com/editions/community/docker-ce-desktop-windows)`  
Without Hyper-V or with another version of Windows  
=> __Docker Toolbox__  
`( https://docs.docker.com/toolbox/overview/ )`  

For Mac users, it's there => `( https://docs.docker.com/docker-for-mac/install/ )`

### Ubuntu from Repository:

*Updating:*

    sudo apt-get update

*Installation from repository:*

    sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
    
*Official Docker GPG key :*

    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    
*Let's check the fingerprint:*

    sudo apt-key fingerprint 0EBFCD88
    
*it must look like this*
->
```
pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]
```  

*This command line will install latest stable release of Docker:*

```
sudo add-apt-repository \
"deb [arch=amd64] https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) \
stable"
```

*Docker installed! Let's check this!!!*
=>

`sudo docker run hello-world`   
container doesn't exist locally, it'll be downloaded the first time we run it    


**Linux Post-install**

Avoid using `sudo` command each time you want to use a docker command, by including actual user to a docker group

*Create group:*
`sudo groupadd docker`
    
*Put user into the new docker group:*
`sudo usermod -aG docker $YOUR_USER`

Log out from your session et log in. Now, we'll test a command line without `sudo`
`docker run hello-world`

If there's a warning about `~/.docker/` permissions -> Remove folder `~/.docker/` or change rights and permissions on it  
`sudo chown "$USER":"$USER" /home/"$USER"/.docker -R`
`sudo chmod g+rwx "$HOME/.docker" -R`


### Docker compose

Linux only! If you have Mac OS or Windows, with Docker Desktop, Docker Compose is already installed  
`sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`

Now, give rights to *execute*  
`sudo chmod +x /usr/local/bin/docker-compose`
    
and let's try it!!  
`docker-compose --version`

In case of a problem due to path, we can create a symbolic link  
`sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose`
    

We'll need a Docker Hub account also, it's a container repository where we can keep our own images:  `https://hub.docker.com/`

And if you need to deploy your app, several options are there!!

- Amazon Web Services (Need a credit card to activate free services)
- Google Cloud
- Microsoft Azure (Need a credit card to activate free services)
- Heroku (Free)
- Jelastic Cloud (A 14 days free trial)
