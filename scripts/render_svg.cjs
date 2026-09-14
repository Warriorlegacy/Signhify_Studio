const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

async function render() {
  const rootDir = path.resolve(__dirname, "..");
  const svgPath = path.join(rootDir, "public", "signhify-logo.svg");
  const svgRaw = fs.readFileSync(svgPath, "utf8");

  // Ensure svg scales properly
  const svgScaled = svgRaw
    .replace(/width="64"/, 'width="100%"')
    .replace(/height="64"/, 'height="100%"');

  console.log("Launching headless Chromium...");
  const browser = await chromium.launch();

  // 1. Transparent 2048x2048 PNG (Master HQ)
  {
    const page = await browser.newPage({
      viewport: { width: 2048, height: 2048 },
      deviceScaleFactor: 1,
    });

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 2048px;
      height: 2048px;
      background: transparent;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      width: 1960px;
      height: 1960px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="container">
    ${svgScaled}
  </div>
</body>
</html>`;

    await page.setContent(html, { waitUntil: "load" });
    await page.waitForTimeout(400);

    const outPngRoot = path.join(rootDir, "signhify-logo-vector.png");
    const outPngPublic = path.join(rootDir, "public", "signhify-logo-vector.png");
    await page.screenshot({ path: outPngRoot, omitBackground: true });
    await page.screenshot({ path: outPngPublic, omitBackground: true });
    console.log("Generated:", outPngRoot);
    await page.close();
  }

  // 2. High Quality JPG / JPEG with Obsidian Black backdrop (#040711)
  {
    const page = await browser.newPage({
      viewport: { width: 2048, height: 2048 },
      deviceScaleFactor: 1,
    });

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 2048px;
      height: 2048px;
      background: #040711;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      width: 1960px;
      height: 1960px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="container">
    ${svgScaled}
  </div>
</body>
</html>`;

    await page.setContent(html, { waitUntil: "load" });
    await page.waitForTimeout(400);

    const outJpgRoot = path.join(rootDir, "signhify-logo-vector.jpg");
    const outJpegRoot = path.join(rootDir, "signhify-logo-vector.jpeg");
    const outJpgPublic = path.join(rootDir, "public", "signhify-logo-vector.jpg");
    const outJpegPublic = path.join(rootDir, "public", "signhify-logo-vector.jpeg");

    await page.screenshot({ path: outJpgRoot, type: "jpeg", quality: 100 });
    await page.screenshot({ path: outJpegRoot, type: "jpeg", quality: 100 });
    await page.screenshot({ path: outJpgPublic, type: "jpeg", quality: 100 });
    await page.screenshot({ path: outJpegPublic, type: "jpeg", quality: 100 });
    console.log("Generated JPG/JPEG:", outJpgRoot, outJpegRoot);
    await page.close();
  }

  // 3. Isolated Transparent Kinetic 'S' Emblem (Icon only)
  {
    const page = await browser.newPage({
      viewport: { width: 2048, height: 2048 },
      deviceScaleFactor: 1,
    });

    const emblemSvg = svgScaled
      .replace(/<rect x="3\.5"[\s\S]*?stroke-width="1\.8" \/>/, "")
      .replace(/<path d="M 12 5\.5 Q 32 4\.5 52 5\.5"[\s\S]*?stroke-linecap="round" \/>/, "");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 2048px;
      height: 2048px;
      background: transparent;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      width: 1850px;
      height: 1850px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="container">
    ${emblemSvg}
  </div>
</body>
</html>`;

    await page.setContent(html, { waitUntil: "load" });
    await page.waitForTimeout(400);

    const outEmblemPng = path.join(rootDir, "signhify-logo-emblem.png");
    const outEmblemPublic = path.join(rootDir, "public", "signhify-logo-emblem.png");
    await page.screenshot({ path: outEmblemPng, omitBackground: true });
    await page.screenshot({ path: outEmblemPublic, omitBackground: true });
    console.log("Generated emblem:", outEmblemPng);
    await page.close();
  }

  // 4. Ultra-Res 4096x4096 (4K Master) Transparent PNG
  {
    const page = await browser.newPage({
      viewport: { width: 4096, height: 4096 },
      deviceScaleFactor: 1,
    });

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 4096px;
      height: 4096px;
      background: transparent;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      width: 3920px;
      height: 3920px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="container">
    ${svgScaled}
  </div>
</body>
</html>`;

    await page.setContent(html, { waitUntil: "load" });
    await page.waitForTimeout(500);

    const out4kPng = path.join(rootDir, "signhify-logo-vector-4k.png");
    await page.screenshot({ path: out4kPng, omitBackground: true });
    console.log("Generated 4K Master:", out4kPng);
    await page.close();
  }

  await browser.close();
  console.log("SUCCESS: All raster formats generated!");
}

render().catch((err) => {
  console.error(err);
  process.exit(1);
});
