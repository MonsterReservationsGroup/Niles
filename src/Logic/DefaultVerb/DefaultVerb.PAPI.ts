import * as packageJson from '../../../package.json';

export function defaultVerb() {
  const version = packageJson.version;
  console.log(`The current Niles version is: ${version}`);
}
