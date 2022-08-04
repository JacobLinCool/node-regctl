import fs from "node:fs";
import { spawn } from "node:child_process";
import { bin, install } from "./lib.js";

export async function main(): Promise<void> {
    const args = process.argv.slice(2);

    if (args[0] === "bin") {
        if (!args[1]) {
            console.log(bin);
            return;
        }
        if (args[1] === "remove") {
            fs.unlinkSync(bin);
            console.log("Removed regctl");
            return;
        }
        if (args[1] === "install") {
            if (args[2]) {
                console.log(`Installing regctl ${args[2]}`);
                console.log(await install(bin, args[2]));
            } else {
                console.log("Installing latest version of regctl");
                await install(bin);
            }
            return;
        }
        if (args[1] === "help" || args[1] === "--help" || args[1] === "-h") {
            console.log(`regctl bin                    : Prints the path to the binary`);
            console.log(`regctl bin remove             : Removes the binary`);
            console.log(`regctl bin install [version]  : Installs the binary`);
            console.log(`regctl bin help               : Prints this help message`);
            console.log(`Examples:`);
            console.log(`regctl bin install            : Installs the latest version of regctl`);
            console.log(`regctl bin install v0.4.4     : Installs regctl v0.4.4`);
            console.log(`You can find releases at https://github.com/regclient/regclient/releases`);
            return;
        }
    }

    if (!fs.existsSync(bin)) {
        console.log("Installed regctl to " + (await install(bin)));
    }

    const sub = spawn(bin, args, { shell: true, stdio: "inherit" });

    sub.on("exit", (code) => {
        if (typeof code === "number") {
            process.exit(code);
        } else {
            process.exit(1);
        }
    });

    process.on("SIGINT", () => {
        sub.kill("SIGINT");
    });
}
