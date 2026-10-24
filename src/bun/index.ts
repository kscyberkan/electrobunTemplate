import { createWindows } from "./windows";
import mainView from "./views/mainview";

await createWindows(mainView);

console.log("App started!");
