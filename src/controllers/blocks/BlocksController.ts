import { ApiPromise } from '@polkadot/api';
import { BlockHash } from '@polkadot/types/interfaces';
import { isHex } from '@polkadot/util';
import { RequestHandler } from 'express';

import { BlocksService } from '../../services';
import { INumberParam } from '../../types/requests';
import AbstractController from '../AbstractController';

interface ControllerOptions {
	finalizes: boolean;
	minCalcFeeRuntime: null | number;
	blockWeightStore: {};
}

interface IFinalizationOpts {
	hash: BlockHash;
	omitFinalizedTag: boolean;
	queryFinalizedHead: boolean;
}

/**
 * GET a block.
 *
 * Paths:
 * - `head`: Get the latest finalized block.
 * - (Optional) `number`: Block hash or height at which to query. If not provided, queries
 *   finalized head.
 *
 * Query:
 * - (Optional) `eventDocs`: When set to `true`, every event will have an extra
 * 	`docs` property with a string of the events documentation.
 * - (Optional) `extrinsicDocs`: When set to `true`, every extrinsic will have an extra
 * 	`docs` property with a string of the extrinsics documentation.
 * - (Optional for `/blocks/head`) `finalized`: When set to `false`, it will fetch the head of
 * 	the node's canon chain, which might not be finalized. When set to `true` it
 * 	will fetch the head of the finalized chain.
 *
 *
 * Returns:
 * - `number`: Block height.
 * - `hash`: The block's hash.
 * - `parentHash`: The hash of the parent block.
 * - `stateRoot`: The state root after executing this block.
 * - `extrinsicsRoot`: The Merkle root of the extrinsics.
 * - `authorId`: The account ID of the block author (may be undefined for some chains).
 * - `logs`: Array of `DigestItem`s associated with the block.
 * - `onInitialize`: Object with an array of `SanitizedEvent`s that occurred during block
 *   initialization with the `method` and `data` for each.
 * - `extrinsics`: Array of extrinsics (inherents and transactions) within the block. Each
 *   contains:
 *   - `method`: Extrinsic method.
 *   - `signature`: Object with `signature` and `signer`, or `null` if unsigned.
 *   - `nonce`: Account nonce, if applicable.
 *   - `args`: Array of arguments. Note: if you are expecting an [`OpaqueCall`](https://substrate.dev/rustdocs/v2.0.0/pallet_multisig/type.OpaqueCall.html)
 * 			and it is not decoded in the response (i.e. it is just a hex string), then Sidecar was not
 * 			able to decode it and likely that it is not a valid call for the runtime.
 *   - `tip`: Any tip added to the transaction.
 *   - `hash`: The transaction's hash.
 *   - `info`: `RuntimeDispatchInfo` for the transaction. Includes the `partialFee`.
 *   - `events`: An array of `SanitizedEvent`s that occurred during extrinsic execution.
 *   - `success`: Whether or not the extrinsic succeeded.
 *   - `paysFee`: Whether the extrinsic requires a fee. Careful! This field relates to whether or
 *     not the extrinsic requires a fee if called as a transaction. Block authors could insert
 *     the extrinsic as an inherent in the block and not pay a fee. Always check that `paysFee`
 *     is `true` and that the extrinsic is signed when reconciling old blocks.
 * - `onFinalize`: Object with an array of `SanitizedEvent`s that occurred during block
 *   finalization with the `method` and `data` for each.
 *
 * Note: Block finalization does not correspond to consensus, i.e. whether the block is in the
 * canonical chain. It denotes the finalization of block _construction._
 *
 * Substrate Reference:
 * - `DigestItem`: https://crates.parity.io/sp_runtime/enum.DigestItem.html
 * - `RawEvent`: https://crates.parity.io/frame_system/enum.RawEvent.html
 * - Extrinsics: https://substrate.dev/docs/en/knowledgebase/learn-substrate/extrinsics
 * - `Extrinsic`: https://crates.parity.io/sp_runtime/traits/trait.Extrinsic.html
 * - `OnInitialize`: https://crates.parity.io/frame_support/traits/trait.OnInitialize.html
 * - `OnFinalize`: https://crates.parity.io/frame_support/traits/trait.OnFinalize.html
 */
export default class BlocksController extends AbstractController<BlocksService> {
	constructor(api: ApiPromise, private readonly options: ControllerOptions) {
		super(
			api,
			'/blocks',
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
			['/head', this.getLatestBlock],
			['/:number', this.getBlockById],
			['/head/summary', this.getLatestBlockSummary],
			['/:number/summary', this.getBlockByIdSummary],
		]);
	}

	/**
	 * Get the latest block.
	 *
	 * @param _req Express Request
	 * @param res Express Response
	 */
	private getLatestBlock: RequestHandler = async (
		{ query: { eventDocs, extrinsicDocs, finalized } },
		res
	) => {
		const eventDocsArg = eventDocs === 'true';
		const extrinsicDocsArg = extrinsicDocs === 'true';

		const { hash, queryFinalizedHead, omitFinalizedTag } =
			await this.parseFinalizationOpts(
				this.options.finalizes,
				finalized as string
			);

		const options = {
			eventDocs: eventDocsArg,
			extrinsicDocs: extrinsicDocsArg,
			checkFinalized: false,
			queryFinalizedHead,
			omitFinalizedTag
		};

		BlocksController.sanitizedSend(
			res,
			await this.service.fetchBlock(hash, options)
		);
	};

	/**
	 * Get a block by its hash or number identifier. If the path ends with
	 * `/summary` then a short summary of the block will be returned
	 *
	 * @param req Express Request
	 * @param res Express Response
	 */
	private getBlockById: RequestHandler<INumberParam> = async (
		{ params: { number }, query: { eventDocs, extrinsicDocs } },
		res
	): Promise<void> => {
		const checkFinalized = isHex(number);

		const hash = await this.getHashForBlock(number);

		const eventDocsArg = eventDocs === 'true';
		const extrinsicDocsArg = extrinsicDocs === 'true';

		const queryFinalizedHead = !this.options.finalizes ? false : true;
		const omitFinalizedTag = !this.options.finalizes ? true : false;

		const options = {
			eventDocs: eventDocsArg,
			extrinsicDocs: extrinsicDocsArg,
			checkFinalized,
			queryFinalizedHead,
			omitFinalizedTag,
		};

		// We set the last param to true because we haven't queried the finalizedHead
		BlocksController.sanitizedSend(
			res,
			await this.service.fetchBlock(hash, options)
		);
	};

	/**
	 * 
	 * @param param0 
	 * @param res 
	 */
	private getBlockByIdSummary: RequestHandler<INumberParam> = async (
		{ params: { number } },
		res
	): Promise<void> => {
		const hash = await this.getHashForBlock(number);

		BlocksController.sanitizedSend(
			res,
			await this.service.fetchBlockSummary(hash)
		);
	};

	/**
	 * 
	 * @param param0 
	 * @param res 
	 */
	private getLatestBlockSummary: RequestHandler<INumberParam> = async (
		{ params: { number } },
		res
	): Promise<void> => {
		const hash = await this.getHashForBlock(number);

		let options = {
			finalizedHead: true,
		}

		BlocksController.sanitizedSend(
			res,
			await this.service.fetchBlockSummary(hash)
		);
	};

	/**
	 * This also returns the hash for the block to query.
	 *
	 * @param optFinalizes
	 * @param paramFinalized
	 */
	private parseFinalizationOpts = async (
		optFinalizes: boolean,
		paramFinalized: string
	): Promise<IFinalizationOpts> => {
		let hash, queryFinalizedHead, omitFinalizedTag;
		if (!optFinalizes) {
			// If the network chain doesn't finalize blocks, we dont want a finalized tag.
			omitFinalizedTag = true;
			queryFinalizedHead = false;
			hash = (await this.api.rpc.chain.getHeader()).hash;
		} else if (paramFinalized === 'false') {
			omitFinalizedTag = false;
			queryFinalizedHead = true;
			hash = (await this.api.rpc.chain.getHeader()).hash;
		} else {
			omitFinalizedTag = false;
			queryFinalizedHead = false;
			hash = await this.api.rpc.chain.getFinalizedHead();
		}

		return {
			hash,
			omitFinalizedTag,
			queryFinalizedHead,
		};
	};
}
