import {
	IsIn,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	Min,
} from "class-validator";

export interface IGetTransactionDto {
	amount: number;
	bankDescription: string | null;
	counterpartyId: string;
	counterpartyName: string;
	counterpartyNickname: string | null;
	createdAt: string;
	dashboardLink: string;
	details: {
		address: {
			address1: string;
			address2: string | null;
			city: string;
			state: string | null;
			postalCode: string;
		} | null;
		domesticWireRoutingInfo: {
			bankName: string | null;
			accountNumber: string;
			routingNumber: string;
			address: {
				address1: string;
				address2: string | null;
				city: string;
				region: string;
				postalCode: string;
				country: string;
			} | null;
		} | null;
		electronicRoutingInfo: {
			accountNumber: string;
			routingNumber: string;
			bankName: string | null;
		} | null;
		internationalWireRoutingInfo: {
			iban: string;
			swiftCode: string;
			correspondentInfo: {
				routingNumber: string | null;
				swiftCode: string | null;
				bankName: string | null;
			} | null;
			bankDetails: {
				bankName: string;
				cityState: string;
				country: string;
			} | null;
			address: {
				address1: string;
				address2: string | null;
				city: string;
				region: string;
				postalCode: string;
				country: string;
			} | null;
			phoneNumber: string | null;
			countrySpecific: {
				countrySpecificDataCanada: {
					bankCode: string;
					transitNumber: string;
				} | null;
				countrySpecificDataAustralia: {
					bsbCode: string;
				} | null;
				countrySpecificDataIndia: {
					ifscCode: string;
				} | null;
				countrySpecificDataRussia: {
					inn: string;
				} | null;
				countrySpecificDataPhilippines: {
					routingNumber: string;
				} | null;
				countrySpecificDataSouthAfrica: {
					branchCode: string;
				} | null;
			};
		} | null;
	} | null;
	estimatedDeliveryDate: string;
	failedAt: string | null;
	id: string;
	kind:
		| "externalTransfer"
		| "internalTransfer"
		| "outgoingPayment"
		| "debitCardTransaction"
		| "incomingDomesticWire"
		| "checkDeposit"
		| "incomingInternationalWire"
		| "fee"
		| "other";
	note: string | null;
	externalMemo: string | null;
	postedAt: string | null;
	reasonForFailure: string | null;
	status: "pending" | "sent" | "cancelled" | "failed";
	feeId: string | null;
}

export interface IGetTransactionsDto {
	total: number;
	transactions: IGetTransactionDto[];
}

type TPaymentMethod = "ach";

export class PostTransactionDto {
	@IsString()
	@IsUUID()
	recipientId!: string;

	@IsNumber()
	@Min(0)
	amount!: number;

	@IsString()
	@IsIn(["ach"])
	paymentMethod!: TPaymentMethod;

	@IsString()
	@IsOptional()
	note?: string;

	@IsString()
	@MaxLength(140)
	@IsOptional()
	externalMemo?: string;

	@IsString()
	idempotencyKey!: string;
}
