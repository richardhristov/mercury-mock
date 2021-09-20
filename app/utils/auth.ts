import { Action } from "routing-controllers";
import { Request } from "express";

export const authorizationChecker = async (action: Action, roles?: any[]) => {
	const req = action.request as Request;
	const authorization = req.get("authorization");
	return !!authorization;
};

export const currentUserChecker = async (action: Action) => {
	const req = action.request as Request;
	const authorization = req.get("authorization");
	return authorization;
};
