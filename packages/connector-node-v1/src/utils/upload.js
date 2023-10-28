async function readLocalFile(typeAction) {
  return new Promise((resolve, reject) => {
    if (typeAction.action === 'click') {
      const uploadInput = document.createElement("input");
      uploadInput.addEventListener('change', _ => {
        const file = uploadInput.files[0];
        resolve({
          type: file.type,
          name: file.name,
          file
        });
      });
      // This input element in IE11 becomes visible after it is added on the page
      // Hide an input element
      uploadInput.style.visibility = 'hidden';
      uploadInput.type = "file";
      document.body.appendChild(uploadInput);
      uploadInput.click();
      document.body.removeChild(uploadInput);
    } else if (typeAction.action === 'drag') {
      const dragArea = document.createElement('div');
      const navigator = document.querySelector('.oc-fm--file-navigator');
      navigator.appendChild(dragArea);

      dragArea.style.position = 'absolute';
      dragArea.style.width = '100%';
      dragArea.style.height = '100%';
      dragArea.style.top = '0';

      dragArea.addEventListener('dragenter', (e) => {
        e.preventDefault();
      })

      dragArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const dt = e.dataTransfer;
        const files = dt.files;
        const file = files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            console.log(e.target.result);
          };
          reader.readAsDataURL(file);
        }
        navigator.removeChild(dragArea);
        resolve({
          type: file.type,
          name: file.name,
          file,
        });
      });

      dragArea.addEventListener('dragover', e => {
        e.preventDefault()
      });

      dragArea.addEventListener('dragleave', () => {
        navigator.removeChild(dragArea);
      });
    }
  });
}

export {
  readLocalFile
}
