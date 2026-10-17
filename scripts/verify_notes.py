#!/usr/bin/env python3
"""Verify the versioned note bodies, or exported rendered reader innerHTML.

Vendored from the October 2026 handoff (scripts/verify_notes.py); paths point at
content/notes/. `npm run verify:notes` exports the prerendered bodies first.

Run from anywhere. For the real app, export each rendered body as
<slug>.body.html into a directory and pass --rendered-dir DIR.
Optional --link-remaps JSON is a mapping of original href -> approved href.
Title/date/read-time are separate UI checks against notes-manifest.json.
"""
import argparse, hashlib, json, sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
class BodyParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.text = []
        self.tags = []
        self.links = []
        self.unsafe = []
    def handle_data(self, value):
        self.text.append(value)
    def handle_starttag(self, tag, attrs):
        self.tags.append(tag)
        attrs = dict(attrs)
        if tag in ('script', 'iframe', 'object', 'embed', 'style'):
            self.unsafe.append(tag)
        for key, value in attrs.items():
            if key.startswith('on'):
                self.unsafe.append(key)
            if key in ('href', 'src') and value and value.strip().lower().startswith(('javascript:', 'data:text/html', 'vbscript:')):
                self.unsafe.append(value)
        if tag == 'a':
            self.links.append(attrs.get('href'))
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

def parse_file(path):
    parser = BodyParser()
    parser.feed(path.read_text(encoding='utf-8'))
    return parser

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--rendered-dir', type=Path)
    parser.add_argument('--link-remaps', type=Path)
    args = parser.parse_args()
    manifest = json.loads((ROOT/'content/notes/manifest.json').read_text(encoding='utf-8'))
    remaps = json.loads(args.link_remaps.read_text()) if args.link_remaps else {}
    errors = []
    count = 0
    for note in manifest['notes']:
        if not note['included']:
            continue
        path = (args.rendered_dir / f"{note['slug']}.body.html") if args.rendered_dir else ROOT/'content/notes/bodies'/f"{note['slug']}.html"
        if not path.exists():
            errors.append(f"Missing body: {path}")
            continue
        body = parse_file(path)
        normalized = ' '.join(''.join(body.text).split())
        digest = hashlib.sha256(normalized.encode('utf-8')).hexdigest()
        if digest != note['bodySha256']:
            errors.append(f"Text differs: {note['slug']}")
        if body.tags != note['bodyTagSequence']:
            errors.append(f"Element order/structure differs: {note['slug']}")
        expected_links = [remaps.get(x['href'], x['href']) for x in note['sourceLinks']]
        if body.links != expected_links:
            errors.append(f"Link destinations differ: {note['slug']}")
        if body.unsafe:
            errors.append(f"Unsafe markup: {note['slug']}: {body.unsafe}")
        count += 1
    if count != manifest['includedCount']:
        errors.append(f"Compared {count}, expected {manifest['includedCount']}")
    if errors:
        print('\n'.join(errors), file=sys.stderr)
        return 1
    print(f"PASS: {count} complete note bodies match text, element order, and approved links.")
    return 0
if __name__ == '__main__':
    raise SystemExit(main())
