import {
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	registerDecorator,
} from "class-validator";

import validate from "deep-email-validator";

@ValidatorConstraint({ async: true })
export class IsValidEmailConstraint implements ValidatorConstraintInterface {
	async validate(emailAddress: string) {
		if (typeof emailAddress !== "string") {
			return false;
		}
		return (
			await validate({
				email: emailAddress,
				validateRegex: true,
				validateMx: true,
				validateTypo: true,
				validateDisposable: true,
				validateSMTP: false,
			})
		).valid;
	}
}

export function IsValidEmail(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: "isValidEmail",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: validationOptions,
			validator: IsValidEmailConstraint,
		});
	};
}
