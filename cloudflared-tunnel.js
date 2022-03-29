const childProcess = require("child_process");
const commandExistsSync = require("command-exists").sync;

class CloudflaredTunnel {

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

    emitChange(msg, code) {
        if (this.change) {
            this.change(this.running, msg, code);
        }
    }

    emitError(msg) {
        if (this.error) {
            this.error(msg);
        }
    }

    start() {
        if (!this.checkInstalled()) {
            this.emitError(`Cloudflared error: ${this.cloudflaredPath} is not found`);
            return;
        }

        if (!this.token) {
            this.emitError("Cloudflared error: Token is not set");
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

        this.running = true;
        this.emitChange("Starting cloudflared");
        this.childProcess = childProcess.spawn(this.cloudflaredPath, args);
        this.childProcess.stdout.pipe(process.stdout);
        this.childProcess.stderr.pipe(process.stderr);

        this.childProcess.on("close", (code) => {
            this.running = false;
            this.emitChange("Stopped cloudflared", code);
        });

        this.childProcess.on("error", (err) => {
            if (err.code === "ENOENT") {
                this.emitError(`Cloudflared error: ${this.cloudflaredPath} is not found`);
            } else {
                this.emitError(err);
            }
        });

        this.childProcess.stderr.on("data", (data) => {
            this.emitError(data.toString());
        });
    }

    stop() {
        this.emitChange("Stopping cloudflared");
        this.childProcess.kill("SIGINT");
    }
}

module.exports = {
    CloudflaredTunnel
};
