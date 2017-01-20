import { execSync } from 'child_process';
import path from 'path';
import os from 'os';

function extractArgs() {
  const type = process.argv[2];
  const fullName = process.argv[3];

  const splitted = fullName.split('/');
  const componentName = splitted.pop();
  const pathPrefix = splitted.join('/');

  return { type, componentName, pathPrefix };
}

const srcRoot = path.join(__dirname, '..', 'app');
const { type, componentName, pathPrefix } = extractArgs();


function mkdirp({ type, pathPrefix }) {
  console.log('mkdir...');
  execSync(`mkdir -p ${codeDir({ type, pathPrefix })}`);
  execSync(`mkdir -p ${testDir({ type, pathPrefix })}`);
}

function copyFiles({ type, pathPrefix, componentName }) {
  console.log('copy files...');
  execSync(`cp ${codeTemplatePath({ type })} ${codePath({ type, pathPrefix, componentName })}`);
  execSync(`cp ${testTemplatePath({ type })} ${testPath({ type, pathPrefix, componentName })}`);
}

function templateFilePath({ type }) {
  return path.join(__dirname, `${type}.template.js`);
}

function codeDir({ type, pathPrefix }) {
  return path.join(srcRoot, `${type}s`, pathPrefix);
}

function testDir({ type, pathPrefix }) {
  return path.join(srcRoot, 'spec', `${type}s`, pathPrefix);
}

function codePath({ type, pathPrefix, componentName }) {
  return path.join(codeDir({ type, pathPrefix }), `${componentName}.js`);
}

function testPath({ type, pathPrefix, componentName }) {
  return path.join(testDir({ type, pathPrefix }), `${componentName}.test.js`);
}
function codeTemplatePath({ type }) {
  return path.join(__dirname, `${type}.template.js`);
}

function testTemplatePath({ type }) {
  return path.join(__dirname, `${type}-test.template.js`);
}

function testFullNamespace({ pathPrefix, componentName }) {
  const splitted = pathPrefix.split('/');
  return splitted.concat([componentName]).map(capitalize).join('::');
}

function capitalize(str) {
  const lead = str[0] ? str[0].toUpperCase() : '';
  return `${lead}${str.slice(1, str.length)}`;
}

function sed({ type, pathPrefix, componentName }) {
  console.log('sed...');

  const sedCommand = getSedCommand();
  const pathSubstitution = (pathPrefix ? pathPrefix + '/' : '').replace(/\//g, '\\\/');

  execSync(`${sedCommand} 's/COMPONENT_NAME/${componentName}/g' ${codePath({ type, pathPrefix, componentName })}`);
  execSync(`${sedCommand} 's/COMPONENT_NAME/${componentName}/g' ${testPath({ type, pathPrefix, componentName })}`);

  execSync(`${sedCommand} 's/PATH_PREFIX\\\//${pathSubstitution}/g' ${codePath({ type, pathPrefix, componentName })}`);
  execSync(`${sedCommand} 's/PATH_PREFIX\\\//${pathSubstitution}/g' ${testPath({ type, pathPrefix, componentName })}`);

  execSync(`${sedCommand} 's/COMPONENT_FULL_NAMESPACE/${testFullNamespace({
    pathPrefix,
    componentName
  })}/g' ${testPath({ type, pathPrefix, componentName })}`);
}

function getSedCommand() {
  const osType = os.type().toLowerCase();
  if (osType === 'darwin') {
    return 'sed -i \'\'';
  } else if (osType === 'linux') {
    return 'sed -i';
  } else {
    throw new Error(`unknown os type ${osType}`);
  }
}

mkdirp({ type, pathPrefix });
copyFiles({ type, pathPrefix, componentName });
sed({ type, pathPrefix, componentName });

console.log(`created file: ${codePath({ type, pathPrefix, componentName })}`);
console.log(`created file: ${testPath({ type, pathPrefix, componentName })}`);
