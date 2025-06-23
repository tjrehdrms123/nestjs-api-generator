#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function toPascalCase(str: string): string {
  return str
    .replace(/(^\w|-\w)/g, clear => clear.replace('-', '').toUpperCase());
}

function mkdirRecursive(dirPath: string): void {
  if (fs.existsSync(dirPath)) return;
  const parentDir = path.dirname(dirPath);
  mkdirRecursive(parentDir);
  fs.mkdirSync(dirPath);
}

function replaceAllCases(content: string, original: string, replacement: string): string {
  const pascalOriginal = toPascalCase(original);
  const pascalReplacement = toPascalCase(replacement);

  const kebabOriginal = toKebabCase(original);
  const kebabReplacement = toKebabCase(replacement);

  // 예: Template → ClientCompanyRecordHistory
  content = content.replace(new RegExp(pascalOriginal, 'g'), pascalReplacement);

  // 예: template → client-company-record-history
  content = content.replace(new RegExp(kebabOriginal, 'g'), kebabReplacement);

  return content;
}
  
function copyTemplate(
  templatePath: string,
  templateName: string,
  folderName: string,
  className: string
): void {
  if (!fs.existsSync(templatePath)) {
    console.error(chalk.red(`Error: Template path "${templatePath}" does not exist.`));
    return;
  }

  const newModulePath = path.join(path.dirname(templatePath), folderName);

  if (fs.existsSync(newModulePath)) {
    console.error(chalk.red(`Error: ${folderName} already exists.`));
    return;
  }

  mkdirRecursive(newModulePath);

  function copyRecursive(src: string, dest: string): void {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);

      const destFileName = entry.name.replace(
        new RegExp(templateName, 'gi'),
        match => (match === templateName ? folderName : className)
      );
      const destPath = path.join(dest, destFileName);

      if (entry.isDirectory()) {
        mkdirRecursive(destPath);
        copyRecursive(srcPath, destPath);
      } else {
        let content = fs.readFileSync(srcPath, 'utf8');
        content = replaceAllCases(content, templateName, folderName);
        fs.writeFileSync(destPath, content, 'utf8');
      }
    }
  }

  copyRecursive(templatePath, newModulePath);

  console.log(chalk.green(`✅ Module "${folderName}" created successfully.`));
}

program
  .name('nestjs-api-generator')
  .description('CLI to generate a new module from a template')
  .version('1.0.1')
  .requiredOption('-s, --source <templateName>', '템플릿 이름')
  .requiredOption('-t, --target <newModuleName>', '새 모듈 이름')
  .option('--style <style>', '이름 변환 스타일 (kebab, pascal, raw)', 'raw');

program.parse(process.argv);

const options = program.opts();
const templateName = options.source;
const targetInput = options.target;
const style = options.style || 'raw';

let folderName = targetInput;
let className = targetInput;

if (style === 'kebab') {
  folderName = toKebabCase(targetInput);
  className = toPascalCase(targetInput);
} else if (style === 'pascal') {
  folderName = toPascalCase(targetInput);
  className = toPascalCase(targetInput);
}

const templatePath = path.join(process.cwd(), templateName);
copyTemplate(templatePath, templateName, folderName, className);
