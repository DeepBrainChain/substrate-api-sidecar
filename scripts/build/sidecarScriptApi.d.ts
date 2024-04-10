import { IProcOpts, ProcsType, StatusResponse } from './types';
/**
 * Sets the url that sidecar will use in the env
 *
 * @param url ws url used in sidecar
 */
export declare const setWsUrl: (url: string) => void;
/**
 * Sets the log level for sidecar
 *
 * @param level log-levels -> error, warn, info, http, verbose, debug, silly
 */
export declare const setLogLevel: (level: string) => void;
/**
 * Kill all processes
 *
 * @param procs
 */
export declare const killAll: (procs: ProcsType) => void;
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
export declare const launchProcess: (cmd: string, procs: ProcsType, { proc, resolver, resolverJestErr, resolverStartupErr, resolverFailed, args }: IProcOpts) => Promise<StatusResponse>;
