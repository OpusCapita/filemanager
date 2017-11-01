function downloadFile(content, name) {
  let objectUrl = URL.createObjectURL(new Blob([content], { type: 'octet/stream' }));

  let downloadLink = document.createElement("a");
  downloadLink.href = objectUrl;
  downloadLink.download = name;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export {
  downloadFile
};
