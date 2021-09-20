import { ValidationOptions, registerDecorator } from "class-validator";

const validFirstTwoCharacters = [
	// 00 - 12
	"00",
	"01",
	"02",
	"03",
	"04",
	"05",
	"06",
	"07",
	"08",
	"09",
	"10",
	"11",
	"12",
	// 21 - 32
	"21",
	"22",
	"23",
	"24",
	"25",
	"26",
	"27",
	"28",
	"29",
	"30",
	"31",
	"32",
	// 61 - 72
	"61",
	"62",
	"63",
	"64",
	"65",
	"66",
	"67",
	"68",
	"69",
	"60",
	"71",
	"72",
	// 80
	"80",
];

export function IsRoutingNumber(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: "isRoutingNumber",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				validate(value: any) {
					// Routing numbers are strings since they can have leading zeroes
					if (typeof value !== "string") {
						return false;
					}
					// Routing numbers are always 9 characters
					if (value.length !== 9) {
						return false;
					}
					// Routing numbers only contain numbers
					if (!value.match(/^[0-9]+$/)) {
						return false;
					}
					// The routing number is in the form of XXXXYYYYC
					// XXXX is Federal Reserve Routing Symbol, YYYY is the Financial Institution Identifier, and C is the Check Digit
					// Within the 4 digit Federal Reserve Routing Symbol, the first two digits can only be 00 - 12, 21 - 32, 61 - 72, or 80
					const firstTwoCharacters = value.substr(0, 2);
					if (validFirstTwoCharacters.indexOf(firstTwoCharacters) === -1) {
						return false;
					}
					// The check digit is the ninth digit of the routing number and must meet the following condition:
					// 3(d1+d4+d7) + 7(d2+d5+d8) + (d3+d6+d9) mod 10 = 0
					const d1 = parseInt(value[0]);
					const d2 = parseInt(value[1]);
					const d3 = parseInt(value[2]);
					const d4 = parseInt(value[3]);
					const d5 = parseInt(value[4]);
					const d6 = parseInt(value[5]);
					const d7 = parseInt(value[6]);
					const d8 = parseInt(value[7]);
					const d9 = parseInt(value[8]);
					const formula =
						3 * (d1 + d4 + d7) + 7 * (d2 + d5 + d8) + (d3 + d6 + d9);
					if (formula % 10 !== 0) {
						return false;
					}
					return true;
				},
			},
		});
	};
}
