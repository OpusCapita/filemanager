FROM opuscapita/minsk-core-ci:1

# install az

# get rid of warnings about missing terminal etc.
ENV DEBIAN_FRONTEND noninteractive

# Install Azure CLI according to https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-apt?view=azure-cli-latest
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# install Kubectl
ARG KUBECTL_VERSION=1.17.7
RUN curl -fLk -o /usr/bin/kubectl https://storage.googleapis.com/kubernetes-release/release/v${KUBECTL_VERSION}/bin/linux/amd64/kubectl \
  && chmod +x /usr/bin/kubectl

# Install Helm
ARG HELM_VERSION=2.17.0
RUN curl -fLk -o /usr/bin/helm.tar.gz https://storage.googleapis.com/kubernetes-helm/helm-v${HELM_VERSION}-linux-amd64.tar.gz \
  && cd /usr/bin && tar -xzf ./helm.tar.gz --strip-components=1 -C . linux-amd64/helm \
  && chmod +x /usr/bin/helm \
  && rm -rf /usr/bin/helm.tar.gz
