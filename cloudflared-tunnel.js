import childProcess from "child_process";
import { sync as commandExistsSync } from "command-exists";

export class CloudflaredTunnel {

    constructor(cloudflaredPath = "cloudflared") {
        this.cloudflaredPath = cloudflaredPath;

        this.url = "http://localhost:80";
        this.hostname = "";
    }

    get token() {
        return this._token;
    }

    set token(token) {
        this._token = token;
    }

    checkInstalled() {
        return commandExistsSync(this.cloudflaredPath);
    }

    start() {
        if (!this.checkInstalled()) {
            console.error(`Cloudflared error: ${this.cloudflaredPath} is not found`);
            return;
        }

        if (!this.token) {
            console.error("Cloudflared error: Token is not set");
            return;
        }

        const args = [
            "tunnel",
            "--no-autoupdate",
        ];

        /*
        if (this.hostname) {
            args.push("--hostname");
            args.push(this.hostname);
        }

        if (this.url) {
            args.push("--url");
            args.push(this.url);
        }*/

        args.push("run");
        args.push("--token");
        args.push(this.token);

        this.childProcess = childProcess.spawn(this.cloudflaredPath, args);
        this.childProcess.stdout.pipe(process.stdout);
        this.childProcess.stderr.pipe(process.stderr);

        this.childProcess.on("close", (code) => {

        });

        this.childProcess.on("error", (err) => {
            if (err.code === "ENOENT") {
                console.error(`Cloudflared error: ${this.cloudflaredPath} is not found`);
            } else {
                console.error(err);
            }
        });
    }

    stop() {
        this.childProcess.kill("SIGINT");
    }
}
