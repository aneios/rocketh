#! /usr/bin/env node
import {loadEnv} from 'ldenv';
import {loadAndExecuteDeployments, readConfig} from '.';
import {Command} from 'commander';
import pkg from '../package.json';

loadEnv();

const commandName = pkg.name;
const program = new Command();
program
	.name(commandName)
	.version(pkg.version)
	.usage(`${commandName}`)
	.description('execute deploy scripts and store the deployments')
	.option('-s, --scripts <value>', 'path the folder containing the deploy scripts to execute')
	.option('-t, --tags <value>', 'comma separated list of tags to execute')
	.option('-d, --deployments <value>', 'folder where deployments are saved')
	.requiredOption('-n, --network <value>', 'network context to use')
	.parse(process.argv);

const options = program.opts();
const config = readConfig(options as any);

loadAndExecuteDeployments({...config, logLevel: 1});
