import https from "node:https";

const DOMAIN = "signhify.dpdns.org";
const KEY = "f6d8a7c29e134b2895e63810a4c27bdf";
const KEY_LOCATION = `https://${DOMAIN}/${KEY}.txt`;

const URLS = [
  `https://${DOMAIN}/`,
  `https://${DOMAIN}/brand`,
  `https://${DOMAIN}/insights`,
  `https://${DOMAIN}/services`,
  `https://${DOMAIN}/about`,
  `https://${DOMAIN}/contact`,
  `https://${DOMAIN}/pricing`,
  `https://${DOMAIN}/projects`,
  `https://${DOMAIN}/ai`,
  `https://${DOMAIN}/marketplace`,
  `https://${DOMAIN}/sprint`,
  `https://${DOMAIN}/book`,
];

const payload = JSON.stringify({
  host: DOMAIN,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URLS,
});

console.log("🚀 Pinging IndexNow endpoints for instant search engine indexing...");

const endpoints = [
  "api.indexnow.org",
  "www.bing.com",
  "search.seznam.cz",
  "yandex.com",
];

endpoints.forEach((host) => {
  const req = https.request(
    {
      hostname: host,
      path: "/indexnow",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(payload),
      },
    },
    (res) => {
      console.log(`[IndexNow] ${host} -> Status: ${res.statusCode}`);
    }
  );

  req.on("error", (err) => {
    console.error(`[IndexNow Error] ${host} -> ${err.message}`);
  });

  req.write(payload);
  req.end();
});
