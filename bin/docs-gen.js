#!/usr/bin/env node

import { Command } from 'commander';
import { buildSite, startDevServer } from '../src/builder.js';

const program = new Command();

program
  .name('docs-gen')
  .description('Material Design 3 static documentation generator from Markdown')
  .version('1.0.0');

program
  .command('build')
  .description('Build static documentation website for production or GitHub Pages')
  .option('-i, --input <path>', 'Path to markdown documentation directory', 'docs')
  .option('-o, --output <path>', 'Output directory for static site', '_site')
  .option('-t, --title <title>', 'Documentation site title')
  .option('-d, --description <desc>', 'Documentation site description')
  .option('-g, --github <url>', 'GitHub repository URL')
  .option('-b, --base <path>', 'Base URL path (e.g. /my-repo/ for GitHub Pages)', './')
  .option('-c, --config <path>', 'Path to docs.config.json configuration file')
  .action(async (options) => {
    try {
      await buildSite(options);
    } catch (err) {
      console.error('\nBuild failed:', err);
      process.exit(1);
    }
  });

program
  .command('dev')
  .description('Start local development server with hot-reload for markdown files')
  .option('-i, --input <path>', 'Path to markdown documentation directory', 'docs')
  .option('-p, --port <port>', 'Dev server port', (val) => parseInt(val, 10), 3000)
  .option('--no-open', 'Do not open browser automatically')
  .option('-t, --title <title>', 'Documentation site title')
  .option('-d, --description <desc>', 'Documentation site description')
  .option('-g, --github <url>', 'GitHub repository URL')
  .option('-c, --config <path>', 'Path to docs.config.json configuration file')
  .action(async (options) => {
    try {
      await startDevServer(options);
    } catch (err) {
      console.error('\nDev server failed:', err);
      process.exit(1);
    }
  });

program.parse(process.argv);

