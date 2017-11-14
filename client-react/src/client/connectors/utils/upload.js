async function readLocalFile() {
  return new Promise((resolve, reject) => {
    let uploadInput = document.createElement("input");
    let reader = new FileReader();

    uploadInput.addEventListener('change', (e) => {
      let file = uploadInput.files[0];
      reader.addEventListener('load', (e) => {
        resolve({
          content: e.target.result,
          type: file.type,
          name: file.name,
          file
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
