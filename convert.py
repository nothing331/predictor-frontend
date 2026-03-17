import re
import os

def convert_to_jsx(html_path, out_path, component_name):
    with open(html_path, "r") as f:
        html = f.read()
    
    # Extract everything inside <body>...</body>
    body_match = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL | re.IGNORECASE)
    if not body_match:
        print(f"No body found in {html_path}")
        return
    body_content = body_match.group(1)

    # Convert class= to className=
    jsx = body_content.replace('class=', 'className=')
    jsx = jsx.replace('class="', 'className="') # Extra safety

    def style_replacer(match):
        style_val = match.group(1).strip()
        if not style_val:
            return ""
        if "background-image" in style_val:
            url_match = re.search(r"url\(['\"]([^'\"]+)['\"]\)", style_val)
            if url_match:
                return f"style={{{{ backgroundImage: \"url('{url_match.group(1)}')\" }}}}"
        return "" # Remove empty or unrecognized styles

    jsx = re.sub(r'style="([^"]*)"', style_replacer, jsx)

    # SVG issues and other typical items
    jsx = re.sub(r' viewBox=', ' viewBox=', jsx, flags=re.IGNORECASE)
    jsx = jsx.replace('stroke-width=', 'strokeWidth=')
    jsx = jsx.replace('stroke-opacity=', 'strokeOpacity=')
    jsx = jsx.replace('fill-opacity=', 'fillOpacity=')
    jsx = jsx.replace('stop-color=', 'stopColor=')
    jsx = jsx.replace('stop-opacity=', 'stopOpacity=')
    
    # Simple self-closing input/img (might be brittle but good enough)
    jsx = re.sub(r'<input([^>]*[^/])>', r'<input\1/>', jsx)
    jsx = re.sub(r'<img([^>]*[^/])>', r'<img\1/>', jsx)

    # Convert all <br> to <br/>
    jsx = re.sub(r'<br\s*>', '<br/>', jsx)

    # Convert HTML comments to JSX comments
    jsx = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', jsx, flags=re.DOTALL)

    jsx = jsx.replace('colspan=', 'colSpan=')
    jsx = jsx.replace('lineargradient', 'linearGradient')
    
    code = f"""import Link from "next/link";

export default function {component_name}() {{
  return (
    <>
{jsx}
    </>
  );
}}
"""
    # ensure dir
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w") as f:
        f.write(code)

convert_to_jsx("stitch_downloads/home.html", "app/page.tsx", "Home")
convert_to_jsx("stitch_downloads/detail.html", "app/market/page.tsx", "MarketDetail")
