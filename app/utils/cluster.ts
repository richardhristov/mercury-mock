import recluster from "recluster";

export const startCluster = (path: string, workers: number) => {
	const cluster = recluster(path, {
		workers,
	});
	cluster.run();

	console.log(`Started ${workers} workers`);
	process.on("SIGUSR2", () => {
		console.log("Reloading");
		cluster.reload();
	});
	return cluster;
};
