"use strict";
// Copyright 2017-2022 Parity Technologies (UK) Ltd.
// This file is part of Substrate API Sidecar.
//
// Substrate API Sidecar is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
Object.defineProperty(exports, "__esModule", { value: true });
const argparse_1 = require("argparse");
const config_1 = require("./config");
const e2eHelpers_1 = require("./e2eHelpers");
const sidecarScriptApi_1 = require("./sidecarScriptApi");
const types_1 = require("./types");
// Stores all the processes
const procs = {};
const main = async (args) => {
    const { Failed } = types_1.StatusCode;
    const localUrl = args.local ? args.local : undefined;
    if (localUrl && !args.chain) {
        console.error('error: `--local` must be used in conjunction with `--chain`');
        process.exit(3);
    }
    if (args.log_level) {
        (0, sidecarScriptApi_1.setLogLevel)(args.log_level);
    }
    console.log('Building Sidecar...');
    const sidecarBuild = await (0, sidecarScriptApi_1.launchProcess)('yarn', procs, config_1.defaultSasBuildOpts);
    if (sidecarBuild.code === Failed) {
        console.log('Sidecar failed to build, exiting...');
        (0, sidecarScriptApi_1.killAll)(procs);
        process.exit(2);
    }
    // CheckTests will either return a success exit code of 0, or a failed exit code of 1.
    if (args.chain) {
        const selectedChain = await (0, e2eHelpers_1.launchChainTest)(args.chain, config_1.latestE2eConfig, procs, localUrl);
        (0, e2eHelpers_1.checkTests)(selectedChain);
    }
    else {
        const polkadotTest = await (0, e2eHelpers_1.launchChainTest)('polkadot', config_1.latestE2eConfig, procs);
        const kusamaTest = await (0, e2eHelpers_1.launchChainTest)('kusama', config_1.latestE2eConfig, procs);
        const westend = await (0, e2eHelpers_1.launchChainTest)('westend', config_1.latestE2eConfig, procs);
        const assetHubPolkadotTest = await (0, e2eHelpers_1.launchChainTest)('polkadot-asset-hub', config_1.latestE2eConfig, procs);
        (0, e2eHelpers_1.checkTests)(polkadotTest, kusamaTest, westend, assetHubPolkadotTest);
    }
};
const parser = new argparse_1.ArgumentParser();
parser.add_argument('--local', {
    required: false,
    nargs: '?',
});
parser.add_argument('--chain', {
    choices: ['polkadot', 'kusama', 'westend', 'polkadot-asset-hub'],
});
parser.add_argument('--log-level', {
    choices: ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'],
    default: 'http',
});
const args = parser.parse_args();
/**
 * Signal interrupt
 */
process.on('SIGINT', function () {
    console.log('Caught interrupt signal');
    (0, sidecarScriptApi_1.killAll)(procs);
    process.exit();
});
/**
 * Signal hangup terminal
 */
process.on('SIGHUP', function () {
    console.log('Caught terminal termination');
    (0, sidecarScriptApi_1.killAll)(procs);
    process.exit();
});
main(args)
    .catch((err) => console.error(err))
    .finally(() => process.exit());
//# sourceMappingURL=runLatestE2eTests.js.map