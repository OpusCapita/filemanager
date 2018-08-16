async function readLocalFile() {
  return new Promise((resolve, reject) => {
    const uploadInput = document.createElement("input");
    const reader = new FileReader();

    uploadInput.addEventListener('change', (e) => {
      const file = uploadInput.files[0];
      reader.addEventListener('load', (e) => {
        resolve({
          content: e.target.result,
          type: file.type,
          name: file.name
        });
      });
      reader.addEventListener('error', (err) => reject(err));
      reader.readAsBinaryString(file);
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
