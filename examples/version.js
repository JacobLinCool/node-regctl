import { bin, install } from "regctl";
import fs from "node:fs";
import { spawn } from "node:child_process";
if (!fs.existsSync(bin)) {
    // install regctl binary
    await install(bin);
}
// run regctl
spawn(bin, ["version"], { stdio: "inherit" });
