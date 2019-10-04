FROM opuscapita/minsk-core-ci:1

# install az

# get rid of warnings about missing terminal etc.
ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install ca-certificates curl apt-transport-https lsb-release gnupg \
  && curl -sL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | tee /etc/apt/trusted.gpg.d/microsoft.asc.gpg > /dev/null \
  && AZ_REPO=$(lsb_release -cs) && echo "deb [arch=amd64] https://packages.microsoft.com/repos/azure-cli/ $AZ_REPO main" | \
    sudo tee /etc/apt/sources.list.d/azure-cli.list \
  && apt-get update && apt-get install azure-cli

# install Kubectl
ARG KUBECTL_VERSION=1.15.3
RUN curl -fLk -o /usr/bin/kubectl https://storage.googleapis.com/kubernetes-release/release/v${KUBECTL_VERSION}/bin/linux/amd64/kubectl \
  && chmod +x /usr/bin/kubectl

# Install Helm
ARG HELM_VERSION=2.12.2
RUN curl -fLk -o /usr/bin/helm.tar.gz https://storage.googleapis.com/kubernetes-helm/helm-v${HELM_VERSION}-linux-amd64.tar.gz \
  && cd /usr/bin && tar -xzf ./helm.tar.gz --strip-components=1 -C . linux-amd64/helm \
  && chmod +x /usr/bin/helm \
  && rm -rf /usr/bin/helm.tar.gz
