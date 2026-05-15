import os
import glob

files = glob.glob('/opt/lampp/htdocs/pnweb_cursor/*.html')

replacements = {
    'href="#google-ads"': 'href="ads.html"',
    'href="index.html#google-ads"': 'href="ads.html"',
    
    'href="#sites"': 'href="sites.html"',
    'href="index.html#sites"': 'href="sites.html"',
    
    'href="#videos"': 'href="videos.html"',
    'href="index.html#videos"': 'href="videos.html"',
    
    'href="#artes"': 'href="artes.html"',
    'href="index.html#artes"': 'href="artes.html"',
    
    'href="#sistemas"': 'href="sistemas.html"',
    'href="index.html#sistemas"': 'href="sistemas.html"'
}

for file in files:
    with open(file, 'r') as f:
        content = f.read()
        
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    with open(file, 'w') as f:
        f.write(content)

print("Done")
