import { Response } from "express";
import {
	Authorized,
	BadRequestError,
	Body,
	CurrentUser,
	Get,
	JsonController,
	NotFoundError,
	Param,
	Post,
	Res,
	UnauthorizedError,
} from "routing-controllers";
import {
	IGetTransactionDto,
	IGetTransactionsDto,
	PostTransactionDto,
} from "../dtos/TransactionDto";
import TransactionRepository from "../repositories/TransactionRepository";

const idempotencyKeys: Record<string, IGetTransactionDto | undefined> = {};

@Authorized()
@JsonController("/api/v1")
class TransactionsController {
	// GET /account/:id/transactions
	@Get("/account/:id/transactions")
	async getAll(
		@Param("id") accountId: string,
		@CurrentUser() user?: string
	): Promise<IGetTransactionsDto> {
		if (!user) {
			throw new UnauthorizedError();
		}
		const data = await TransactionRepository.getAllByUserAccount(
			user,
			accountId
		);
		return {
			total: data.length,
			transactions: data.map((d) => d.transaction),
		};
	}

	// GET /account/:id/transaction/:transactionId
	@Get("/account/:id/transaction/:transactionId")
	async get(
		@Param("id") accountId: string,
		@Param("transactionId") transactionId: string,
		@CurrentUser() user?: string
	): Promise<IGetTransactionDto> {
		if (!user) {
			throw new UnauthorizedError();
		}
		const data = await TransactionRepository.getById(
			user,
			accountId,
			transactionId
		);
		if (!data) {
			throw new NotFoundError();
		}
		return data.transaction;
	}

	// POST /account/:id/transactions
	@Post("/account/:id/transactions")
	async post(
		@Res() res: Response,
		@Param("id") accountId: string,
		@Body({ required: true })
		dto: PostTransactionDto,
		@CurrentUser() user?: string
	): Promise<IGetTransactionDto> {
		if (!user) {
			throw new UnauthorizedError();
		}
		const idempotentTransaction = idempotencyKeys[dto.idempotencyKey];
		if (idempotentTransaction) {
			res.status(409);
			return idempotentTransaction;
		}
		const data = await TransactionRepository.create(user, accountId, dto);
		if (!data) {
			throw new BadRequestError();
		}
		idempotencyKeys[dto.idempotencyKey] = data.transaction;
		return data.transaction;
	}
}

export default TransactionsController;
