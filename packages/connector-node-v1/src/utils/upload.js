async function readLocalFile() {
  return new Promise((resolve, reject) => {
    const uploadInput = document.createElement("input");

    uploadInput.addEventListener('change', _ => {
      const file = uploadInput.files[0];
      resolve({
        type: file.type,
        name: file.name,
        file
      });
    });

    uploadInput.type = "file";
    document.body.appendChild(uploadInput);
    uploadInput.click();
    document.body.removeChild(uploadInput);
  });
}

export {
  readLocalFile
}
