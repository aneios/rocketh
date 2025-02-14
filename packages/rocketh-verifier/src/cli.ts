#! /usr/bin/env node
import {loadEnv} from 'ldenv';
import {readAndResolveConfig} from 'rocketh';
import {run} from '.';
import {Command, Option} from 'commander';
import pkg from '../package.json';
import {ConfigOptions} from 'rocketh';
import {exportMetadata} from './metadata';
loadEnv();

const commandName = `rocketh-verify`;

const program = new Command();
program
	.name(commandName)
	.description('submit contract for verification')
	.version(pkg.version)

	.option('-d, --deployments <value>', 'folder where deployments are saved')
	.requiredOption('-n, --network <value>', 'network context to use');

program
	.command('etherscan')
	.description('submit contract for verification to etherscan')
	.option('--endpoint <value>', 'endpoint to connect to')
	.action((options: {endpoint?: string}) => {
		const programOptions = program.opts() as ConfigOptions;
		const resolvedConfig = readAndResolveConfig(programOptions, {ignoreMissingRPC: true});
		run(resolvedConfig, {
			verifier: {type: 'etherscan', apiKey: process.env['ETHERSCAN_API_KEY'], endpoint: options.endpoint},
		});
	});

program
	.command('sourcify')
	.description('submit contract for verification to sourcify')
	.option('--endpoint <value>', 'endpoint to connect to')
	.action((options: {endpoint?: string}) => {
		const programOptions = program.opts() as ConfigOptions;
		const resolvedConfig = readAndResolveConfig(programOptions, {ignoreMissingRPC: true});
		run(resolvedConfig, {verifier: {type: 'sourcify', endpoint: options.endpoint}});
	});

program
	.command('metadata')
	.description('export metadata')
	.option('--out <value>', 'folder to write metadata into')
	.action((options: {out?: string}) => {
		const programOptions = program.opts() as ConfigOptions;
		const resolvedConfig = readAndResolveConfig(programOptions, {ignoreMissingRPC: true});
		exportMetadata(resolvedConfig, {out: options.out || '_metadata'});
	});

program.parse(process.argv);
