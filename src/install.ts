import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const RELEASE_BASE = "https://github.com/regclient/regclient/releases/";

const LINUX_URL: Partial<Record<typeof process.arch, string>> = {
    arm64: "regctl-linux-arm64",
    x64: "regctl-linux-amd64",
    ppc64: "regctl-linux-ppc64le",
    s390x: "regctl-linux-s390x",
};

const MACOS_URL: Partial<Record<typeof process.arch, string>> = {
    arm64: "regctl-darwin-arm64",
    x64: "regctl-darwin-amd64",
};

const WINDOWS_URL: Partial<Record<typeof process.arch, string>> = {
    x64: "regctl-windows-amd64.exe",
};

function resolve_base(version: string): string {
    if (version === "latest") {
        return `${RELEASE_BASE}latest/download/`;
    }
    return `${RELEASE_BASE}download/${version}/`;
}

/**
 * Install regctl to the given path.
 * @param to The path to the binary to install.
 * @param version The version of regctl to install.
 * @returns The path to the binary that was installed.
 */
export async function install(to: string, version = "latest"): Promise<string> {
    if (process.platform === "linux") {
        return install_linux(to, version);
    } else if (process.platform === "darwin") {
        return install_macos(to, version);
    } else if (process.platform === "win32") {
        return install_windows(to, version);
    } else {
        console.error("Unsupported platform: " + process.platform);
        process.exit(1);
    }
}

export async function install_linux(to: string, version = "latest"): Promise<string> {
    const file = LINUX_URL[process.arch];

    if (file === undefined) {
        console.error("Unsupported architecture: " + process.arch);
        process.exit(1);
    }

    await download(resolve_base(version) + file, to);
    fs.chmodSync(to, "755");
    return to;
}

export async function install_macos(to: string, version = "latest"): Promise<string> {
    const file = MACOS_URL[process.arch];

    if (file === undefined) {
        console.error("Unsupported architecture: " + process.arch);
        process.exit(1);
    }

    await download(resolve_base(version) + file, to);
    fs.chmodSync(to, "755");
    return to;
}
export async function install_windows(to: string, version = "latest"): Promise<string> {
    const file = WINDOWS_URL[process.arch];

    if (file === undefined) {
        console.error("Unsupported architecture: " + process.arch);
        process.exit(1);
    }

    await download(resolve_base(version) + file, to);
    return to;
}

function download(url: string, to: string, redirect = 0): Promise<string> {
    if (redirect === 0) {
        process.env.VERBOSE && console.log(`Downloading ${url} to ${to}`);
    } else {
        process.env.VERBOSE && console.log(`Redirecting to ${url}`);
    }

    return new Promise<string>((resolve, reject) => {
        if (!fs.existsSync(path.dirname(to))) {
            fs.mkdirSync(path.dirname(to), { recursive: true });
        }

        let done = true;
        const file = fs.createWriteStream(to);
        const request = https.get(url, (res) => {
            if (res.statusCode === 302 && res.headers.location !== undefined) {
                const redirection = res.headers.location;
                done = false;
                file.close(() => resolve(download(redirection, to, redirect + 1)));
                return;
            }
            res.pipe(file);
        });

        file.on("finish", () => {
            if (done) {
                file.close(() => resolve(to));
            }
        });

        request.on("error", (err) => {
            fs.unlink(to, () => reject(err));
        });

        file.on("error", (err) => {
            fs.unlink(to, () => reject(err));
        });

        request.end();
    });
}
