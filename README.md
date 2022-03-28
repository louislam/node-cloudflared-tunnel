# node-cloudflared-tunnel

## Requirements

1. Installed cloudflared. 

  You can download it from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/.

2. Token

  You can get it from Cloudflare Zero Trust `https://dash.teams.cloudflare.com/{{ YOUR CLOUDFLARE ACCOUNT ID }}/access/tunnels`

## Example Code

```
import { CloudflaredTunnel } from "./cloudflared-tunnel.js";

let tunnel = new CloudflaredTunnel();
tunnel.token = "<YOUR TOKEN>";
tunnel.start();
```
