/// <reference types="node" />
import { Namespace } from 'argparse';
import { ChildProcessWithoutNullStreams } from 'child_process';
export type ProcsType = {
    [key: string]: ChildProcessWithoutNullStreams;
};
export declare enum StatusCode {
    Success = "0",
    Failed = "1"
}
export interface IChainConfig {
    wsUrl: string;
    SasStartOpts: IProcOpts;
}
export interface IChainConfigE2E extends IChainConfig {
    e2eStartOpts: IProcOpts;
}
export interface IProcOpts {
    proc: string;
    resolver: string;
    resolverStartupErr?: string;
    resolverJestErr?: string;
    resolverFailed?: string;
    args: string[];
}
export interface StatusResponse {
    code: StatusCode;
    stderr: string;
    stdout: string;
}
export interface IBenchResult {
    endpoint: string;
    stdout: string;
}
export interface IE2EParseArgs extends Namespace {
    local: string;
    chain: string;
    log_level: string;
}
export interface IBenchParseArgs extends Namespace {
    log_level: string;
    endpoint: string;
    ws_url: string;
    time: string;
}
export type IBenchmarkConfig = {
    [x: string]: {
        /**
         * Relative path to the benchmark related to the key which represents a endpoint.
         */
        path: string;
    };
};
