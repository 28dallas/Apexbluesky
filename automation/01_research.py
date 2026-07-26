import json
import os
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

import requests
from groq import Groq

WORK_DIR = Path(__file__).parent / '.work'
WORK_DIR.mkdir(exist_ok=True)

SYSTEM_PROMPT = '''You are an expert full-stack developer and digital product creator.
Return STRICT JSON ONLY, with no markdown fence or commentary. Generate a complete, runnable,
original digital product. Do not include secrets, copied proprietary code, malware, or files outside
the product directory. The files array must contain relative, safe paths only.
Schema: {"title":"string","slug":"lowercase-hyphen-slug","category":"Web Templates | AI Tools | Scripts","price":29,"description":"markdown string","social_caption":"string","files":[{"filename":"relative/path","content":"full content"}]}'''

def fetch_reddit_topics() -> list[str]:
    headers = {'User-Agent': 'ApexBlueSkyProductResearch/1.0 (contact: support@apexblueskytools.online)'}
    try:
        response = requests.get('https://www.reddit.com/r/nextjs/top.json?t=week&limit=10', headers=headers, timeout=15)
        response.raise_for_status()
        titles = [item['data']['title'] for item in response.json().get('data', {}).get('children', [])]
        matches = [title for title in titles if any(word in title.lower() for word in ('template', 'starter', 'agent', 'automation', 'ai', 'saas'))]
        return matches or ['Next.js AI Automation Starter Kit']
    except requests.RequestException:
        return []

def fetch_google_trends_topics() -> list[str]:
    """Reads the public Google Trends RSS feed and keeps developer-relevant topics."""
    try:
        response = requests.get('https://trends.google.com/trending/rss?geo=US', timeout=15)
        response.raise_for_status()
        root = ET.fromstring(response.content)
        titles = [item.findtext('title', default='') for item in root.findall('./channel/item')]
        keywords = ('ai', 'software', 'developer', 'coding', 'code', 'app', 'saas', 'automation', 'tech')
        return [title for title in titles if any(keyword in title.lower() for keyword in keywords)]
    except (requests.RequestException, ET.ParseError):
        return []

def fetch_topics() -> list[str]:
    """Combine Reddit and Google Trends, retaining a reliable starter fallback."""
    topics = fetch_reddit_topics() + fetch_google_trends_topics()
    return list(dict.fromkeys(topics)) or ['Next.js AI Automation Starter Kit']

def validate_product(product: object) -> dict:
    if not isinstance(product, dict):
        raise ValueError('The product model did not return an object.')
    required_strings = ('title', 'slug', 'category', 'description', 'social_caption')
    for key in required_strings:
        if not isinstance(product.get(key), str) or not product[key].strip():
            raise ValueError(f'Missing or invalid product field: {key}.')
    if not product['slug'].replace('-', '').isalnum() or product['slug'] != product['slug'].lower():
        raise ValueError('The generated product slug is invalid.')
    if not isinstance(product.get('price'), (int, float)) or not 0 <= product['price'] <= 10000:
        raise ValueError('The generated product price is invalid.')
    files = product.get('files')
    if not isinstance(files, list) or not files:
        raise ValueError('The generated product must include at least one file.')
    return product

def generate(topic: str) -> dict:
    client = Groq(api_key=os.environ['GROQ_API_KEY'])
    response = client.chat.completions.create(
        model=os.environ.get('GROQ_PRODUCT_MODEL', 'llama-3.3-70b-versatile'),
        response_format={'type': 'json_object'},
        messages=[{'role': 'system', 'content': SYSTEM_PROMPT}, {'role': 'user', 'content': f'Create one sellable product from this demand topic: {topic}'}],
    )
    content = response.choices[0].message.content
    if not content:
        raise RuntimeError('The product model returned no content.')
    return validate_product(json.loads(content))

if __name__ == '__main__':
    topic = sys.argv[1] if len(sys.argv) > 1 else fetch_topics()[0]
    product = generate(topic)
    (WORK_DIR / 'product_brief.json').write_text(json.dumps(product, indent=2), encoding='utf-8')
    print(f'Researched and generated: {product.get("title", topic)}')
