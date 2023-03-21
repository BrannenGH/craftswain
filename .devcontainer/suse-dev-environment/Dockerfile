FROM registry.suse.com/bci/nodejs:latest

# Install VSCode dependencies
RUN zypper install -y tar gzip 

# Install buildah/podman dependencies
RUN zypper install -y fuse-overlayfs slirp4netns podman buildah

# Install user tools
RUN zypper install -y zsh vi sudo

RUN groupadd wheel

RUN printf "root ALL=(ALL:ALL) ALL \n%%wheel ALL=(ALL:ALL) NOPASSWD: ALL" > /etc/sudoers.d/default

RUN npm isntall -g corepack

RUN corepack enable

RUN corepack prepare yarn@stable --activate

RUN useradd -r system

RUN useradd -m -u 1000 -g users -G wheel -s /bin/zsh develop

RUN echo develop:10000:5000 > /etc/subuid && echo develop:10000:5000 > /etc/subgid

RUN mkdir /run/user/1000 

RUN chown develop /run/user/1000

USER develop

ENV XDG_RUNTIME_DIR=/run/user/1000

RUN /bin/sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" 