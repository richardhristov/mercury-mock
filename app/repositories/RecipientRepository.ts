import { IGetRecipientDto, PostRecipientDto } from "../dtos/RecipientDto";

import faker from "faker";
import uuid from "uuid-random";

interface IRecipientData {
	user: string;
	recipient: IGetRecipientDto;
}

const data: IRecipientData[] = [];

class RecipientRepository {
	public static async getById(user: string, id: string) {
		return data.find((d) => d.user === user && d.recipient.id === id);
	}

	public static async getAllByUser(user: string) {
		return data.filter((d) => d.user === user);
	}

	public static async create(user: string, dto: PostRecipientDto) {
		const recipientData: IRecipientData = {
			user,
			recipient: {
				...dto,
				electronicRoutingInfo: {
					...dto.electronicRoutingInfo,
					bankName: faker.company.companyName(),
					address: {
						...dto.electronicRoutingInfo.address,
						address2: dto.electronicRoutingInfo.address.address2 ?? null,
					},
				},
				id: uuid(),
				status: "active",
				dateLastPaid: null,
				defaultPaymentMethod: "ach",
				domesticWireRoutingInfo: null,
				checkInfo: null,
				internationalWireRoutingInfo: null,
				address: null,
			},
		};
		data.push(recipientData);
		return recipientData;
	}
}

export default RecipientRepository;
