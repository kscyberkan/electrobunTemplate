import { BrowserWindow, Updater } from "electrobun/main";

const DEV_SERVER_PORT = 5173;
const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`;

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ViewConfig {
	/** Must match the key in electrobun.config.ts `build.copy` (e.g. "mainview") */
	name: string;
	title: string;
	frame: {
		width: number;
		height: number;
		x?: number;
		y?: number;
	};
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function resolveUrl(viewName: string): Promise<string> {
	const channel = await Updater.localInfo.channel();
	if (channel === "dev") {
		try {
			await fetch(DEV_SERVER_URL, { method: "HEAD" });
			console.log(`HMR enabled: Using Vite dev server at ${DEV_SERVER_URL}`);
			return DEV_SERVER_URL;
		} catch {
			console.log("Vite dev server not running. Falling back to bundled view.");
		}
	}
	return `views://${viewName}/index.html`;
}

// ─── Factory ───────────────────────────────────────────────────────────────────

export async function createWindow(config: ViewConfig): Promise<BrowserWindow> {
	const url = await resolveUrl(config.name);
	return new BrowserWindow({
		title: config.title,
		url,
		frame: config.frame,
	});
}

export async function createWindows(
	...configs: ViewConfig[]
): Promise<BrowserWindow[]> {
	return Promise.all(configs.map(createWindow));
}
