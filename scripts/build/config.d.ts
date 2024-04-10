import { IChainConfigE2E } from './types';
export declare const defaultSasStartOpts: {
    proc: string;
    resolver: string;
    resolverStartupErr: string;
    args: string[];
};
export declare const defaultSasBuildOpts: {
    proc: string;
    resolver: string;
    args: string[];
};
export declare const defaultSasPackOpts: {
    proc: string;
    resolver: string;
    args: string[];
};
export declare const historicalE2eConfig: Record<string, IChainConfigE2E>;
export declare const latestE2eConfig: Record<string, IChainConfigE2E>;
