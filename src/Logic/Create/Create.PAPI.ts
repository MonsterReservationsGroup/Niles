import { prompt } from 'inquirer';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import * as fixtures from './Assets/Templates.json';

// <-- Import End -->

type fileChoiceCallback_ = (type: string) => void;
interface fileChoice_ {
  callback: fileChoiceCallback_;
  type: string;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createFolders(folders: Array<string>, fileName: string) {
  folders.forEach((folder) => execSync(`cd ${fileName} && mkdir ${folder}`));
}

interface file_ {
  name: Array<string>;
  template: Array<string>;
}

function createFiles(files: Array<file_>, componentName: string, lang: string) {
  files.forEach((file) => {
    const basePath = `${CONSTANTS.workingDir}/${componentName}/`;
    const path = basePath + `${componentName}.${file.name}.${lang}`;
    console.log(path);
    writeFileSync(path, file.template.join('\n'));
  });
}

const fileChoices: Array<fileChoice_> = [
  { type: 'component', callback: (componentType) => {} },
  { type: 'service', callback: (componentType) => {} },
  {
    type: 'module',
    callback: async (component_) => {
      const { fileName, language } = await prompt(CONSTANTS.questions);
      const capitalizedFilename = capitalize(fileName);
      execSync(`mkdir ${capitalizedFilename}`);
      const { headed, headless } = CONSTANTS.languageTypes;
      const language_ = language.split().includes('x') ? headed : headless;
      const refrence = (fixtures as any)[language_][component_];
      createFolders(refrence.folders, capitalizedFilename);
      createFiles(refrence.files, capitalizedFilename, language);
      return;
    },
  },
  {
    type: 'todos',
    callback: async (componentType) => {
      const folders = fixtures.todos;
      const execSteps = CONSTANTS.execSteps.todos;
      execSync(execSteps[0]);
      execSync(execSteps[1]);
      createFolders(folders, execSteps[2]);
      return;
    },
  },
];

const langaugeChoices = ['js', 'ts', 'tsx', 'jsx'];

const CONSTANTS = {
  languageTypes: {
    headed: 'headed',
    headless: 'headless',
  },
  execSteps: {
    todos: ['touch Project.todos', 'mkdir todos-assets', 'todos-assets'],
  },
  workingDir: process.cwd(),
  mainQuestion: {
    type: 'list',
    name: 'file_',
    message: 'What type of file do you want to create?',
    default: fileChoices[0].type,
    choices: fileChoices.map((c) => c.type),
  },
  questions: [
    {
      type: 'input',
      name: 'fileName',
      message: 'What is the name of the file?',
      default: 'Default',
    },
    {
      type: 'list',
      name: 'language',
      message: 'What language do you want to use?',
      default: langaugeChoices[0],
      choices: langaugeChoices,
    },
  ],
};

// <-- Variable Definition End -->

export async function create() {
  const { file_, langauge, fileName } = await prompt([CONSTANTS.mainQuestion]);
  const choice = fileChoices.find((c) => c.type === file_);
  const { type, callback } = choice;
  await callback(type);
}
