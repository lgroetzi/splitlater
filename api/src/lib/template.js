// @flow
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { promisify } from 'util';

export async function render(filePath: string, context: any): Promise<string> {
  const source = await promisify(fs.readFile)(filePath);
  const template = Handlebars.compile(source.toString());
  return template(context);
}

export async function byName(name: string, context: any): Promise<string> {
  const moduleDir = path.dirname((module: any).filename);
  const filePath = path.join(moduleDir, '..', '..', 'templates', 'views', name);
  return render(`${filePath}.hbs`, context);
}
