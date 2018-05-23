node_version() {
    echo -e "\n[INFO] ================================================================================================="
    echo "[INFO] NodeJS: Updating to release version: $1."
    echo "[INFO] ================================================================================================="
    find . -type f -name "lerna.json" -exec sed -i 's|\"version.*\"|\"version\": \"'$1'\"|g' {} \;
    find . -type f -name "package.json" -exec sed -i 's|\"version.*\"|\"version\": \"'$1'\"|g' {} \;
    find . -type f -name "package.json" -exec sed -i 's|\"@opuscapita/react-filemanager-connector-google-drive-v2\".*\"|\"@opuscapita/react-filemanager-connector-google-drive-v2\": \"'$1'\"|g' {} \;
    find . -type f -name "package.json" -exec sed -i 's|\"@opuscapita/react-filemanager-connector-node-v1\".*\"|\"@opuscapita/react-filemanager-connector-node-v1\": \"'$1'\"|g' {} \;
    git --no-pager diff --color
}