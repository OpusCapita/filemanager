import FileSaver from 'file-saver';

// a case when we need to silently download a file using Javascript, and prompt to save it afterwards
function promptToSaveBlob({ content, name, downloadUrl }) {
  if (downloadUrl) {
    const iframeId = 'oc-fm--filemanager-download-iframe';
    let iframeDOMNode = document.getElementById(iframeId);

    if (!iframeDOMNode) {
      iframeDOMNode = document.createElement('iframe');
      iframeDOMNode.style.display = 'none';
      iframeDOMNode.id = iframeId;
      document.body.appendChild(iframeDOMNode);
    }

    iframeDOMNode.src = downloadUrl;
  } else {
    const blob = new Blob([content], { type: 'octet/stream' });
    FileSaver.saveAs(blob, name);
  }
}

// a case when we trigger a direct download in browser
// used in google drive' connector
function triggerHiddenForm({ downloadUrl, target = '_self' }) {
  const form = document.createElement("form");
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
