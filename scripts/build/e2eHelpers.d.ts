import { IChainConfigE2E, ProcsType } from './types';
/**
 * Check each chain test returned by `launchChainTest`, and exit the program
 * with the correct process.
 *
 * @param args The results of each test.
 */
export declare const checkTests: (...args: boolean[]) => void;
/**
 * Launch a e2e test for a chain.
 *
 * @param chain The chain to test against.
 * @param config The config specific to a chain.
 * @param isLocal Boolean declaring if this chain is local.
 * @param procs Object containing all the processes.
 */
export declare const launchChainTest: (chain: string, config: Record<string, IChainConfigE2E>, procs: ProcsType, localUrl?: string) => Promise<boolean>;
