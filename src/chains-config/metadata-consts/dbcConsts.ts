import { extrinsicBaseWeight, perClass } from './substrateConsts';
import { MetadataConsts } from '../../types/chains-config';

export const dbcDefinitions: MetadataConsts[] = [
	{
		runtimeVersions: [264,265,266,267,268,269,270],
		extrinsicBaseWeight,
	},
	{
		runtimeVersions: [264,265,266,267,268,269,270],
		perClass,
	},
];
