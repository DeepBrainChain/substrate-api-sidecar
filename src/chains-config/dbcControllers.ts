import { ControllerConfig } from '../types/chains-config';
import { getBlockWeight } from './metadata-consts';
/**
 * Statemine configuration for Sidecar.
 */
export const dbcControllers: ControllerConfig = {
	controllers: [
		'AccountsAssets',
		'Blocks',
		'BlocksExtrinsics',
		'NodeNetwork',
		'NodeTransactionPool',
		'NodeVersion',
		'PalletsAssets',
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
		blockWeightStore: getBlockWeight('node'),
	},
};
