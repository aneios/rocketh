#!/usr/bin/env node
const Web3 = require('web3'); // TODO use lightweight http provider
const {
    setupGlobals,
    setup,
    runStages,
    rocketh
} = require('./lib');


if(require.main === module) {
    const yargs = require('yargs');
    yargs.command('launch [nodeUrl]', 'run stages on node ', (yargs) => {
        yargs
        .positional('nodeUrl', {
            describe: 'nodeUrl to bind on',
            default: 'http://localhost:8545'
        })
        }, (argv) => {
            if (argv.verbose) console.info(`connect on :${argv.nodeUrl}`)
            setupGlobals({
                provider: new Web3.providers.HttpProvider(argv.nodeUrl) // TODO pass node uri in arguments
            });
            setup(true);
        })
    .option('verbose', {
        alias: 'v',
        default: false
    })
    .argv
} else {
    if (!global.ethereum) { // not setup yet
        setupGlobals();
        rocketh.launch = (nodeUrl) => {
            if (nodeUrl) {
                setupGlobals({
                    provider: new Web3.providers.HttpProvider(nodeUrl)
                })
            } else {
                setupGlobals();
            }
            return setup(false);
        }
    }
}

module.exports = rocketh;
