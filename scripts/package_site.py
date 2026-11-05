"""Create a clean static artifact without documentation, tests, or personal data."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
output = root / 'artifacts' / 'jaws-jacket-shop.zip'
output.parent.mkdir(exist_ok=True)
files = [root / 'index.html']
for directory in ('css', 'js', 'assets/images'):
    files.extend(path for path in (root / directory).rglob('*')
                 if path.is_file() and path.suffix.lower() in
                 ('.css', '.js', '.svg', '.png', '.jpg', '.jpeg', '.jfif', '.webp', '.avif'))
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for path in sorted(files):
        archive.write(path, path.relative_to(root))
print(f'Paket statis: {output.relative_to(root)} ({len(files)} berkas)')
