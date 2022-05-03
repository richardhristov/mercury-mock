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
	UnauthorizedError,
} from "routing-controllers";
import {
	IGetRecipientDto,
	IGetRecipientsDto,
	PostRecipientDto,
} from "../dtos/RecipientDto";
import RecipientRepository from "../repositories/RecipientRepository";

@Authorized()
@JsonController("/api/v1")
class RecipientsController {
	// GET /recipients
	@Get("/recipients")
	async getAll(@CurrentUser() user?: string): Promise<IGetRecipientsDto> {
		if (!user) {
			throw new UnauthorizedError();
		}
		const data = await RecipientRepository.getAllByUser(user);
		return {
			total: data.length,
			recipients: data.map((d) => d.recipient),
		};
	}

	// GET /recipient/:id
	@Get("/recipient/:id")
	async get(
		@Param("id") id: string,
		@CurrentUser() user?: string
	): Promise<IGetRecipientDto> {
		if (!user) {
			throw new UnauthorizedError();
		}
		const data = await RecipientRepository.getById(user, id);
		if (!data) {
			throw new NotFoundError();
		}
		return data.recipient;
	}

	// POST /recipients
	@Post("/recipients")
	async post(
		@Body({ required: true })
		dto: PostRecipientDto,
		@CurrentUser() user?: string
	): Promise<IGetRecipientDto> {
		if (!user) {
			throw new UnauthorizedError();
		}
		const data = await RecipientRepository.create(user, dto);
		if (!data) {
			throw new BadRequestError();
		}
		return data.recipient;
	}

	// POST /recipients/:id
	@Post("/recipients/:id")
	async postId(
		@Param("id") id: string,
		@Body({ required: true })
		dto: PostRecipientDto,
		@CurrentUser() user?: string
	): Promise<IGetRecipientDto> {
		if (!user) {
			throw new UnauthorizedError();
		}
		const data = await RecipientRepository.update(user, id, dto);
		if (!data) {
			throw new BadRequestError();
		}
		return data.recipient;
	}
}

export default RecipientsController;
