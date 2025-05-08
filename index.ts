#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

function mkdirRecursive(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    return;
  }
  const parentDir = path.dirname(dirPath);
  mkdirRecursive(parentDir);
  fs.mkdirSync(dirPath);
}

function copyTemplate(templatePath: string, templateName: string, newModuleName: string): void {
  if (!fs.existsSync(templatePath)) {
    console.error(chalk.red(`Error: Template path "${templatePath}" does not exist.`));
    return;
  }

  const newModulePath = path.join(path.dirname(templatePath), newModuleName);

  if (fs.existsSync(newModulePath)) {
    console.error(chalk.red(`Error: ${newModuleName} already exists.`));
    return;
  }

  mkdirRecursive(newModulePath);

  function copyRecursive(src: string, dest: string): void {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name.replace(new RegExp(templateName, 'gi'), match => {
        return match === templateName ? newModuleName : capitalize(newModuleName);
      }));

      if (entry.isDirectory()) {
        mkdirRecursive(destPath);
        copyRecursive(srcPath, destPath);
      } else {
        let content = fs.readFileSync(srcPath, 'utf8');
        content = content.replace(new RegExp(templateName, 'gi'), match => {
          return match === templateName ? newModuleName : capitalize(newModuleName);
        });
        fs.writeFileSync(destPath, content, 'utf8');
      }
    }
  }

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  copyRecursive(templatePath, newModulePath);

  console.log(chalk.green(`Module ${newModuleName} created successfully.`));
}

program
  .name('nestjs-api-generator')
  .description('CLI to generate a new module from a template')
  .version('1.0.0')
  .requiredOption('-s, --source <templateName>', '템플릿 이름')
  .requiredOption('-t, --target <newModuleName>', '새 모듈 이름');

program.parse(process.argv);

const options = program.opts();
const templateName = options.source;
const newModuleName = options.target;

if (!templateName || !newModuleName) {
  console.error(chalk.red('Error: 템플릿 이름과 새 모듈 이름을 모두 제공해야 합니다.'));
  process.exit(1);
}

const templatePath = path.join(process.cwd(), templateName);

copyTemplate(templatePath, templateName, newModuleName);
