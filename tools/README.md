Containers for code and infrastructure development with all required tools:
- `container-for-code.sh` runs container prepared for developing `code` part (java, maven, npm etc.)
- `container-for-deployment.sh` runs container prepared for developing `deployment` part (terrafoprm, kubectl, az etc.)

Both containers expect `VAULT_ADDR`, `VAULT_TOKEN` in environment, because Vault is used as a source of credentials and other configuration data.

`VAULT_ADDR` has to be defined by developer in his environment.

`VAULT_TOKEN` is acquired autometically. It requires also `AZURE_USER`, `AZURE_PASS` in environment (these are used as login credentials in Vault service, which gives read-only access to credentials for any OpusCapita user).
