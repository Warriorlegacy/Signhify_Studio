import { initSchema } from "../src/lib/schema";
import { startEngine } from "../src/lib/engine";

initSchema();
startEngine();
console.log("[hunter-worker] engine started — polling queues");
setInterval(() => {}, 60_000);
