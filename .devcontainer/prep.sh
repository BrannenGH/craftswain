# /bin/sh
sudo mount --make-rshared / 

podman system service -t 0 & 