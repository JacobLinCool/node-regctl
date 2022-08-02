import path from "node:path";

/**
 * The path to the regctl binary.
 */
export const bin = path.join(
    __dirname,
    "..",
    "bin",
    process.platform === "win32" ? "regctl.exe" : "regctl",
);
