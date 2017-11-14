// a case when we need to silently download a file using Javascript, and prompt to save it afterwards
function promptToSaveBlob(content, name) {
  let objectUrl = URL.createObjectURL(new Blob([content], { type: 'octet/stream' }));

  let downloadLink = document.createElement("a");
  downloadLink.href = objectUrl;
  downloadLink.download = name;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// a case when we trigger a direct download in browser
function triggerHiddenForm({ downloadUrl, target = '_self' }) {
  let form = document.createElement("form");
  form.action = downloadUrl;
  form.target = target;
  form.method = 'GET';

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

export {
  promptToSaveBlob,
  triggerHiddenForm
};
