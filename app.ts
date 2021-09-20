import "reflect-metadata";

import { authorizationChecker, currentUserChecker } from "./utils/auth";

import RecipientsController from "./controllers/RecipientsController";
import TransactionsController from "./controllers/TransactionsController";
import compression from "compression";
import { createExpressServer } from "routing-controllers";

export const startServer = () => {
	const app = createExpressServer({
		cors: {
			origin: ["*"],
		},
		controllers: [RecipientsController, TransactionsController],
		currentUserChecker,
		authorizationChecker,
	});

	// Trust proxies in internal networks
	app.set("trust proxy", "10.0.0.0/8, 192.168.0.0/16, 172.16.0.0/12");
	// Enable compression
	app.use(compression());
	app.listen(process.env.PORT || 8008);
	console.log(`Started server`);
};
