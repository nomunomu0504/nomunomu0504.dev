# Vendors the fonts used for build-time OG image rendering (src/lib/og.ts) so builds never need the network:
#   - Noto Sans JP 700: woff2 subsets + the unicode-range CSS, from the @fontsource/noto-sans-jp package on jsDelivr
#   - Geist 700 and Geist Mono 400: copied from the installed @fontsource packages
# Re-run to bump versions. Output: src/assets/og-fonts/ (committed).
import json, os, shutil, urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "src", "assets", "og-fonts")
PKG, VER = "@fontsource/noto-sans-jp", "5.3.1"

noto = os.path.join(OUT, "noto-sans-jp")
os.makedirs(noto, exist_ok=True)
flat = json.load(urllib.request.urlopen(f"https://data.jsdelivr.com/v1/package/npm/{PKG}@{VER}/flat", timeout=30))
files = [f["name"] for f in flat["files"] if f["name"].endswith("-700-normal.woff2")] + ["/700.css"]

def grab(name):
    data = urllib.request.urlopen(f"https://cdn.jsdelivr.net/npm/{PKG}@{VER}{name}", timeout=60).read()
    with open(os.path.join(noto, os.path.basename(name)), "wb") as fh:
        fh.write(data)
    return len(data)

with ThreadPoolExecutor(8) as ex:
    sizes = list(ex.map(grab, files))

for src, dst in [
    ("node_modules/@fontsource/geist/files/geist-latin-700-normal.woff2", "geist-latin-700-normal.woff2"),
    ("node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2", "geist-mono-latin-wght-normal.woff2"),
]:
    shutil.copyfile(os.path.join(ROOT, src), os.path.join(OUT, dst))

with open(os.path.join(OUT, "SOURCE.md"), "w") as fh:
    fh.write(
        f"Fonts vendored by scripts/og-fonts.py for build-time OG image rendering (src/lib/og.ts).\n\n"
        f"- noto-sans-jp/: Noto Sans JP 700 from {PKG}@{VER} ({len(files)} files), SIL Open Font License 1.1\n"
        f"- geist-latin-700-normal.woff2: from @fontsource/geist, SIL Open Font License 1.1\n"
        f"- geist-mono-latin-wght-normal.woff2: from @fontsource-variable/geist-mono, SIL Open Font License 1.1\n"
    )
print(f"noto-sans-jp: {len(files)} files, {sum(sizes) / 1048576:.1f} MB")
