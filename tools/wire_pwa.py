from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
index = ROOT / 'index.html'
manifest = ROOT / 'manifest.json'

html = index.read_text(encoding='utf-8')

# PWA manifest link: add once, without disturbing the existing design.
manifest_link = '<link rel="manifest" href="./manifest.json">'
if manifest_link not in html:
    marker = '<title>そなYELL</title>'
    if marker not in html:
        raise SystemExit('index.html: title marker not found')
    html = html.replace(marker, marker + manifest_link, 1)

# PWA service worker registration: add once at the beginning of the existing script.
sw_boot = '<script>if ("serviceWorker" in navigator) { navigator.serviceWorker.register("./sw.js", {scope:"./"}).catch(()=>{}); }'
if 'navigator.serviceWorker.register("./sw.js"' not in html:
    marker = '<script>\n(function(){'
    if marker not in html:
        raise SystemExit('index.html: script marker not found')
    html = html.replace(marker, sw_boot + '\n(function(){', 1)

# Fixed design decision: the user's YELL tree becomes a 大樹 at 50 YELL.
html = html.replace('id="treeProgressText">0 / 20', 'id="treeProgressText">0 / 50', 1)
old = "const n=state.yell,max=20,icon=n>=20?'🌳':n>=15?'🌳':n>=10?'🌿':'🌱';"
new = "const n=state.yell,max=50,icon=n>=50?'🌳':n>=25?'🌿':'🌱';"
if old in html:
    html = html.replace(old, new, 1)
else:
    # If already patched, do not fail the workflow.
    if 'const n=state.yell,max=50' not in html:
        raise SystemExit('index.html: My Tree growth rule not found')

# Keep the leaf progress indicator tied to the same 50-YELL ceiling.
html = html.replace('for(let i=0;i<max;i++)', 'for(let i=0;i<max;i++)', 1)

index.write_text(html, encoding='utf-8')

# The installed app opens the dedicated PWA shell, while the existing index remains the source app.
m = manifest.read_text(encoding='utf-8')
m = m.replace('"id": "./"', '"id": "./app.html"', 1)
m = m.replace('"start_url": "./"', '"start_url": "./app.html"', 1)
manifest.write_text(m, encoding='utf-8')
