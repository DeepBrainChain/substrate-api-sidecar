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
exports.latestE2eConfig = exports.historicalE2eConfig = exports.defaultSasPackOpts = exports.defaultSasBuildOpts = exports.defaultSasStartOpts = void 0;
const defaultJestOpts = {
    proc: 'jest',
    resolver: 'PASS',
    resolverJestErr: 'FAIL',
};
exports.defaultSasStartOpts = {
    proc: 'sidecar',
    resolver: 'Check the root endpoint',
    resolverStartupErr: 'error: uncaughtException: listen EADDRINUSE:',
    args: ['start'],
};
exports.defaultSasBuildOpts = {
    proc: 'sidecar',
    resolver: 'Build Finished',
    args: ['build'],
};
exports.defaultSasPackOpts = {
    proc: 'sidecar-pack',
    resolver: 'YN0000: Done in',
    args: ['pack'],
};
exports.historicalE2eConfig = {
    polkadot: {
        wsUrl: 'wss://rpc.polkadot.io',
        e2eStartOpts: {
            ...defaultJestOpts,
            args: ['start:historical-e2e-tests', '--chain', 'polkadot'],
        },
        SasStartOpts: exports.defaultSasStartOpts,
    },
    kusama: {
        wsUrl: 'wss://kusama-rpc.polkadot.io',
        e2eStartOpts: {
            ...defaultJestOpts,
            args: ['start:historical-e2e-tests', '--chain', 'kusama'],
        },
        SasStartOpts: exports.defaultSasStartOpts,
    },
    westend: {
        wsUrl: 'wss://westend-rpc.polkadot.io',
        e2eStartOpts: {
            ...defaultJestOpts,
            args: ['start:historical-e2e-tests', '--chain', 'westend'],
        },
        SasStartOpts: exports.defaultSasStartOpts,
    },
    'kusama-asset-hub': {
        wsUrl: 'wss://kusama-asset-hub-rpc.polkadot.io',
        e2eStartOpts: {
            ...defaultJestOpts,
            args: ['start:historical-e2e-tests', '--chain', 'asset-hub-kusama'],
        },
        SasStartOpts: exports.defaultSasStartOpts,
    },
    'polkadot-asset-hub': {
        wsUrl: 'wss://polkadot-asset-hub-rpc.polkadot.io',
        e2eStartOpts: {
            ...defaultJestOpts,
            args: ['start:historical-e2e-tests', '--chain', 'asset-hub-polkadot'],
        },
        SasStartOpts: exports.defaultSasStartOpts,
    },
};
exports.latestE2eConfig = {
    kusama: {
        wsUrl: 'wss://kusama-rpc.polkadot.io',
        SasStartOpts: exports.defaultSasStartOpts,
        e2eStartOpts: {
            proc: 'latest-e2e',
            resolver: 'Finished with a status code of 0',
            resolverFailed: 'Finished with a status code of 1',
            args: ['start:latest-e2e-tests', '--chain', 'kusama'],
        },
    },
    polkadot: {
        wsUrl: 'wss://rpc.polkadot.io',
        SasStartOpts: exports.defaultSasStartOpts,
        e2eStartOpts: {
            proc: 'latest-e2e',
            resolver: 'Finished with a status code of 0',
            resolverFailed: 'Finished with a status code of 1',
            args: ['start:latest-e2e-tests', '--chain', 'polkadot'],
        },
    },
    'polkadot-asset-hub': {
        wsUrl: 'wss://polkadot-asset-hub-rpc.polkadot.io',
        SasStartOpts: exports.defaultSasStartOpts,
        e2eStartOpts: {
            proc: 'latest-e2e',
            resolver: 'Finished with a status code of 0',
            resolverFailed: 'Finished with a status code of 1',
            args: ['start:latest-e2e-tests', '--chain', 'assetHubPolkadot'],
        },
    },
    westend: {
        wsUrl: 'wss://westend-rpc.polkadot.io',
        SasStartOpts: exports.defaultSasStartOpts,
        e2eStartOpts: {
            proc: 'latest-e2e',
            resolver: 'Finished with a status code of 0',
            resolverFailed: 'Finished with a status code of 1',
            args: ['start:latest-e2e-tests', '--chain', 'westend'],
        },
    },
};
//# sourceMappingURL=config.js.map