import path from "path";
import { startCluster } from "./utils/cluster";

let workers = parseInt(process.env.NODE_WORKERS?.toString() ?? "1");
if (isNaN(workers) || workers < 1) {
	workers = 1;
}

startCluster(path.join(__dirname, "server.js"), workers);
