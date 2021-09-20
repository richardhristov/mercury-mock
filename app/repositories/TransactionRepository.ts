import { IGetTransactionDto, PostTransactionDto } from "../dtos/TransactionDto";

import RecipientRepository from "./RecipientRepository";
import faker from "faker";
import uuid from "uuid-random";

interface ITransactionData {
	user: string;
	accountId: string;
	transaction: IGetTransactionDto;
}

const data: ITransactionData[] = [];

class TransactionRepository {
	public static async getById(user: string, accountId: string, id: string) {
		return data.find(
			(d) =>
				d.user === user && d.accountId === accountId && d.transaction.id === id
		);
	}

	public static async getAllByUserAccount(user: string, accountId: string) {
		return data.filter((d) => d.user === user && d.accountId === accountId);
	}

	public static async create(
		user: string,
		accountId: string,
		dto: PostTransactionDto
	) {
		const recipientData = await RecipientRepository.getById(
			user,
			dto.recipientId
		);
		if (!recipientData) {
			throw new Error("Bad Recipient");
		}
		const { recipient } = recipientData;
		const transactionData: ITransactionData = {
			user,
			accountId,
			transaction: {
				...dto,
				note: dto.note ?? null,
				externalMemo: dto.externalMemo ?? null,
				id: uuid(),
				kind: "externalTransfer",
				status: "sent",
				failedAt: null,
				reasonForFailure: null,
				details: {
					electronicRoutingInfo: recipient.electronicRoutingInfo,
					address: null,
					domesticWireRoutingInfo: null,
					internationalWireRoutingInfo: null,
				},
				counterpartyId: recipient.id,
				counterpartyName: recipient.name,
				counterpartyNickname: recipient.name,
				bankDescription:
					recipient.electronicRoutingInfo?.bankName ??
					faker.company.companyName(),
				postedAt: new Date().toISOString(),
				createdAt: new Date().toISOString(),
				estimatedDeliveryDate: new Date().toISOString(),
				// TODO
				dashboardLink: "",
				feeId: null,
			},
		};
		data.push(transactionData);
		return transactionData;
	}
}

export default TransactionRepository;
