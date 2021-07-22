import { extrinsicBaseWeight, perClass } from './substrateConsts';
import { MetadataConsts } from '../../types/chains-config';

export const dbcDefinitions: MetadataConsts[] = [
	{
		runtimeVersions: [264],
		extrinsicBaseWeight,
	},
	{
		runtimeVersions: [264],
		perClass,
	},
];
