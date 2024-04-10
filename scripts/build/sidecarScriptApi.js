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
exports.launchProcess = exports.killAll = exports.setLogLevel = exports.setWsUrl = void 0;
const child_process_1 = require("child_process");
const types_1 = require("./types");
/**
 * Strip data from a buffer.
 *
 * @param data
 */
const stripData = (data) => {
    return data.toString('utf-8').trim();
};
/**
 * Sets the url that sidecar will use in the env
 *
 * @param url ws url used in sidecar
 */
const setWsUrl = (url) => {
    process.env.SAS_SUBSTRATE_URL = url;
};
exports.setWsUrl = setWsUrl;
/**
 * Sets the log level for sidecar
 *
 * @param level log-levels -> error, warn, info, http, verbose, debug, silly
 */
const setLogLevel = (level) => {
    process.env.SAS_LOG_LEVEL = level;
};
exports.setLogLevel = setLogLevel;
/**
 * Kill all processes
 *
 * @param procs
 */
const killAll = (procs) => {
    console.log('Killing all processes...');
    for (const key of Object.keys(procs)) {
        if (!procs[key].killed) {
            try {
                console.log(`Killing ${key}`);
                const ppid = procs[key].pid;
                // Kill child and all its descendants.
                if (ppid != undefined) {
                    process.kill(-ppid, 'SIGTERM');
                    process.kill(-ppid, 'SIGKILL');
                }
            }
            catch (e) {
                /**
                 * The error we are catching here silently, is when `-procs[key].pid` takes
                 * the range of all pid's inside of the subprocess group created with
                 * `spawn`, and one of the process's is either already closed or doesn't exist anymore.
                 *
                 * ex: `Error: kill ESRCH`
                 *
                 * This is a very specific use case of an empty catch block and is used
                 * outside of the scope of the API therefore justifiable, and should be used cautiously
                 * elsewhere.
                 */
            }
        }
    }
};
exports.killAll = killAll;
/**
 * Launch any given process. It accepts an options object.
 *
 * @param cmd Optional Command will default to 'yarn'
 * @param procs Object of saved processes
 * @param IProcOpts
 * {
 *   proc => the name of the process to be saved in our cache
 *   resolver => If the stdout contains the resolver it will resolve the process
 *   resolverStartupErr => If the stderr contains the resolver it will resolve the process
 *   args => an array of args to be attached to the `yarn` command.
 * }
 */
const launchProcess = (cmd, procs, { proc, resolver, resolverJestErr, resolverStartupErr, resolverFailed, args }) => {
    return new Promise((resolve, reject) => {
        const { Success, Failed } = types_1.StatusCode;
        // Track the status of a jest test, if thats the process running.
        let jestStatus = Success;
        const stdout = [];
        const stderr = [];
        procs[proc] = (0, child_process_1.spawn)(cmd, args, { detached: true });
        procs[proc].stdout.on('data', (data) => {
            stdout.push(stripData(data));
            console.log(data.toString().trim());
            if (data.toString().includes(resolver)) {
                resolve({
                    code: Success,
                    stdout: stdout.join(),
                    stderr: stderr.join(),
                });
            }
            if (resolverFailed && data.toString().includes(resolverFailed)) {
                resolve({
                    code: Failed,
                    stdout: stdout.join(),
                    stderr: stderr.join(),
                });
            }
        });
        procs[proc].stderr.on('data', (data) => {
            stderr.push(stripData(data));
            console.error(data.toString().trim());
            /**
             * The Jest resolver will only apply when its present as an option.
             * While the process is active we just want to track the results of Jest, and
             * resolve the process on `close`.
             */
            if (resolverJestErr && data.toString().trim().includes(resolverJestErr)) {
                jestStatus = Failed;
            }
            if (resolverStartupErr && data.toString().trim().includes(resolverStartupErr)) {
                resolve({
                    code: Failed,
                    stdout: stdout.join(),
                    stderr: stderr.join(),
                });
            }
        });
        procs[proc].on('close', () => {
            if (jestStatus === Failed)
                resolve({
                    code: Failed,
                    stdout: stdout.join(),
                    stderr: stderr.join(),
                });
            resolve({
                code: Success,
                stdout: stdout.join(),
                stderr: stderr.join(),
            });
        });
        procs[proc].on('error', (err) => {
            console.log(err);
            reject(Failed);
        });
    });
};
exports.launchProcess = launchProcess;
//# sourceMappingURL=sidecarScriptApi.js.map