import { MetadataConsts } from '../../types/chains-config';
import { perClass } from './substrateConsts';

export const dbcDefinitions: MetadataConsts[] = [
	{
		runtimeVersions: [264],
		extrinsicBaseWeight: BigInt(65000000),
	},
	{
		runtimeVersions: [264],
		perClass,
	},
];
