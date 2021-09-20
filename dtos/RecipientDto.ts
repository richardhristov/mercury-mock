import {
	IsEmail,
	IsISO31661Alpha2,
	IsIn,
	IsInstance,
	IsOptional,
	IsPhoneNumber,
	IsString,
	ValidateNested,
} from "class-validator";

import { IsRoutingNumber } from "../utils/is-routing-number";
import { IsState } from "../utils/is-state";
import { Type } from "class-transformer";

export interface IGetRecipientDto {
	id: string;
	name: string;
	status: "active" | "deleted";
	emails: string[];
	dateLastPaid: string | null;
	defaultPaymentMethod: "ach" | "check" | "domesticWire" | "internationalWire";
	electronicRoutingInfo: {
		accountNumber: string;
		routingNumber: string;
		bankName: string | null;
		electronicAccountType:
			| "businessChecking"
			| "businessSavings"
			| "personalChecking"
			| "personalSavings";
		address: {
			address1: string;
			address2: string | null;
			city: string;
			region: string;
			postalCode: string;
			country: string;
		} | null;
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
			canada: {
				bankCode: string;
				transitNumber: string;
			} | null;
			australia: {
				bsbCode: string;
			} | null;
			india: {
				ifscCode: string;
			} | null;
		};
	} | null;
	checkInfo: {
		address: {
			address1: string;
			address2: string | null;
			city: string;
			region: string;
			postalCode: string;
			country: string;
		};
	} | null; // Check mailing address.
	address: {
		name: string;
		address1: string;
		address2: string | null;
		city: string;
		region: string;
		postalCode: string;
		country: string;
	} | null; // Deprecated. Use checkInfo instead.
}

export interface IGetRecipientsDto {
	recipients: IGetRecipientDto[];
	total: number;
}

class PostAddressDto {
	@IsString()
	address1!: string;

	@IsOptional()
	@IsString()
	address2?: string;

	@IsString()
	city!: string;

	@IsState()
	region!: string;

	@IsString()
	postalCode!: string;

	@IsString()
	@IsISO31661Alpha2()
	country!: string;
}

type TElectronicAccountType =
	| "businessChecking"
	| "businessSavings"
	| "personalChecking"
	| "personalSavings";

class PostElectronicRoutingInfoDto {
	@IsString()
	accountNumber!: string;

	@IsString()
	@IsRoutingNumber()
	routingNumber!: string;

	@IsString()
	@IsIn([
		"businessChecking",
		"businessSavings",
		"personalChecking",
		"personalSavings",
	])
	electronicAccountType!: TElectronicAccountType;

	@Type(() => PostAddressDto)
	@IsInstance(PostAddressDto)
	@ValidateNested()
	address!: PostAddressDto;
}

type TPaymentMethod =
	| "check"
	| "electronic"
	| "domesticWire"
	| "internationalWire";

export class PostRecipientDto {
	@IsString()
	name!: string;

	@IsEmail({}, { each: true })
	emails!: string[];

	@IsString()
	@IsIn(["check", "electronic", "domesticWire", "internationalWire"])
	paymentMethod!: TPaymentMethod;

	@Type(() => PostElectronicRoutingInfoDto)
	@IsInstance(PostElectronicRoutingInfoDto)
	@ValidateNested()
	electronicRoutingInfo!: PostElectronicRoutingInfoDto;

	@IsOptional()
	@IsPhoneNumber("US")
	phoneNumber?: string;
}
