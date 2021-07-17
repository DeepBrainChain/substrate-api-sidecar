import { ApiPromise } from '@polkadot/api';
import { RequestHandler } from 'express';
import { BlockWeightStore } from 'src/types/chains-config';

import { BlocksService } from '../../services';
import { INumberParam } from '../../types/requests';
import AbstractController from '../AbstractController';

interface ControllerOptions {
	blockWeightStore: BlockWeightStore;
	minCalcFeeRuntime: null | number;
}

export default class BlocksExtrinsicsController extends AbstractController<BlocksService> {
	constructor(api: ApiPromise, options: ControllerOptions) {
		super(
			api,
			'/blocks/:blockId/extrinsics',
			new BlocksService(
				api,
				options.minCalcFeeRuntime,
				options.blockWeightStore
			)
		);
		this.initRoutes();
	}

	protected initRoutes(): void {
		this.safeMountAsyncGetHandlers([
			['/:extrinsicIndex', this.getExtrinsicByTimepoint],
		]);
	}

	/**
	 *
	 * @param _req Express Request
	 * @param res Express Response
	 */
	private getExtrinsicByTimepoint: RequestHandler<INumberParam> = async (
		{
			params: { blockId, extrinsicIndex },
			query: { eventDocs, extrinsicDocs },
		},
		res
	): Promise<void> => {
		const hash = await this.getHashForBlock(blockId);

		const eventDocsArg = eventDocs === 'true';
		const extrinsicDocsArg = extrinsicDocs === 'true';

		const options = {
			eventDocs: eventDocsArg,
			extrinsicDocs: extrinsicDocsArg,
			checkFinalized: true,
			queryFinalizedHead: false,
			omitFinalizedTag: true,
			isSummary: false,
		};

		/**
		 * By default we will return a `IBlock` response since `isSummary` is false
		 * in the options. Therefore we typecast here to make sure the compiler is happy
		 */
		const block = await this.service.fetchBlock(hash, options);

		/**
		 * Verify our param `extrinsicIndex` is an integer represented as a string
		 */
		this.parseNumberOrThrow(
			extrinsicIndex,
			'`exstrinsicIndex` path param is not a number'
		);

		/**
		 * Change extrinsicIndex from a type string to a number before passing it
		 * into any service.
		 */
		const index = parseInt(extrinsicIndex, 10);

		BlocksExtrinsicsController.sanitizedSend(
			res,
			this.service.fetchExtrinsicByIndex(block, index)
		);
	};
}
