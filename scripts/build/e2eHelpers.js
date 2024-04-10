"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchChainTest = exports.checkTests = void 0;
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
const sidecarScriptApi_1 = require("./sidecarScriptApi");
const types_1 = require("./types");
/**
 * Check each chain test returned by `launchChainTest`, and exit the program
 * with the correct process.
 *
 * @param args The results of each test.
 */
const checkTests = (...args) => {
    const testStatus = args.every((test) => test);
    if (testStatus) {
        console.log('[PASSED] All Tests Passed!');
        process.exit(0);
    }
    else {
        console.log('[FAILED] Some Tests Failed!');
        process.exit(1);
    }
};
exports.checkTests = checkTests;
/**
 * Launch a e2e test for a chain.
 *
 * @param chain The chain to test against.
 * @param config The config specific to a chain.
 * @param isLocal Boolean declaring if this chain is local.
 * @param procs Object containing all the processes.
 */
const launchChainTest = async (chain, config, procs, localUrl) => {
    const { wsUrl, SasStartOpts, e2eStartOpts } = config[chain];
    const { Success } = types_1.StatusCode;
    // Set the ws url env var
    localUrl ? (0, sidecarScriptApi_1.setWsUrl)(localUrl) : (0, sidecarScriptApi_1.setWsUrl)(wsUrl);
    console.log('Launching Sidecar...');
    const sidecarStart = await (0, sidecarScriptApi_1.launchProcess)('yarn', procs, SasStartOpts);
    if (sidecarStart.code === Success) {
        // Sidecar successfully launched, and jest will now get called
        console.log('Launching jest...');
        const jest = await (0, sidecarScriptApi_1.launchProcess)('yarn', procs, e2eStartOpts);
        if (jest.code === Success) {
            (0, sidecarScriptApi_1.killAll)(procs);
            return true;
        }
        else {
            (0, sidecarScriptApi_1.killAll)(procs);
            return false;
        }
    }
    else {
        console.error('Error launching sidecar... exiting...');
        (0, sidecarScriptApi_1.killAll)(procs);
        process.exit(2);
    }
};
exports.launchChainTest = launchChainTest;
//# sourceMappingURL=e2eHelpers.js.map