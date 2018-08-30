let path = require('path');
let fs = require('fs-extra');
let execSync = require('child_process').execSync;
let Base64 = require('js-base64').Base64;

let outDir = '/home/volkovich/k8s-fs/helm';

getHelmReleases = () => {
  let releases = execSync(`helm ls -q`, { encoding: 'utf-8' }).split('\n');
  console.log('getHelmReleases', releases);
  return releases;
};

getIngressesForRelease = ({ releaseName }) => {
  console.log('getIngressesForRelease', releaseName);
  let ingresses = JSON.parse(execSync(`kubectl get ingress --all-namespaces -l release="${releaseName}" -o json`, { encoding: 'utf-8' })).items;
  return ingresses;
};

getLinkByIngress = ({ ingress }) => {
  let link = `${ingress.spec.rules[0].host}${ingress.spec.rules[0].http.paths[0].path}`;
  console.log('getLinkByIngress:', link);
  return link;
};


setInterval(() => {
  // TODO - Handle release removal

  getHelmReleases().forEach(releaseName => {
    setTimeout(() => {
      let releaseOut = path.resolve(outDir, releaseName);
      let ingresses = getIngressesForRelease({ releaseName });

      ingresses.forEach(ingress => {
        let link = getLinkByIngress({ ingress });
        let linkOut = path.resolve(outDir, `${releaseName}-Link:${Base64.encode(link)}`);
        execSync(`touch ${linkOut}`);
      });
    });
  });
}, 10000);
