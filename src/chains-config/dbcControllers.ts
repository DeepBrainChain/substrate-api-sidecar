import { ControllerConfig } from '../types/chains-config';
import { initLRUCache, QueryFeeDetailsCache } from './cache';
// import { getBlockWeight } from './metadata-consts';
/**
 * Statemine configuration for Sidecar.
 */
export const dbcControllers: ControllerConfig = {
	controllers: [
		'AccountsBalanceInfo',
		'AccountsValidate',
		'Blocks',
		'BlocksExtrinsics',
		'BlocksRawExtrinsics',
		'NodeNetwork',
		'NodeTransactionPool',
		'NodeVersion',
		'PalletsStorage',
		'RuntimeCode',
		'RuntimeMetadata',
		'RuntimeSpec',
		'TransactionDryRun',
		'TransactionFeeEstimate',
		'TransactionMaterial',
		'TransactionSubmit',
	],
	options: {
		finalizes: true,
		minCalcFeeRuntime: 2,
		blockStore: initLRUCache(),
		hasQueryFeeApi: new QueryFeeDetailsCache(null, null),
	},
};
