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

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function mkdirRecursive(dirPath: string): void {
  if (fs.existsSync(dirPath)) return;
  const parentDir = path.dirname(dirPath);
  mkdirRecursive(parentDir);
  fs.mkdirSync(dirPath);
}

function replaceAllCases(content: string, original: string, replacement: string): string {
  const patterns = [
    {
      // PascalCase → PascalCase
      from: toPascalCase(original),
      to: toPascalCase(replacement),
    },
    {
      // kebab-case → kebab-case
      from: toKebabCase(original),
      to: toKebabCase(replacement),
    },
    {
      // camelCase → camelCase
      from: toCamelCase(original),
      to: toCamelCase(replacement),
    },
    {
      // raw 그대로 (소문자)
      from: original.toLowerCase(),
      to: replacement.toLowerCase(),
    }
  ];

  for (const { from, to } of patterns) {
    const regex = new RegExp(from, 'g');
    content = content.replace(regex, to);
  }

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
        content = replaceAllCases(content, templateName, className);
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
  .version('2.0.1')
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
