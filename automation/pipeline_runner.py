import json
import os
import subprocess
import sys
from pathlib import Path

import requests

ROOT = Path(__file__).parent

def run_step(script: str, *args: str) -> None:
    subprocess.run([sys.executable, str(ROOT / script), *args], check=True)

if __name__ == '__main__':
    topic = os.environ.get('PRODUCT_TOPIC', '').strip()
    run_step('01_research.py', *( [topic] if topic else [] ))
    run_step('02_package_and_upload.py')
    payload = json.loads((ROOT / '.work' / 'product_ready.json').read_text(encoding='utf-8'))
    endpoint = os.environ.get('NEXTJS_PUBLISH_URL', 'https://apexblueskytools.online/api/workers/publish')
    secret = os.environ['PIPELINE_PUBLISH_SECRET']
    response = requests.post(endpoint, json=payload, headers={'Authorization': f'Bearer {secret}'}, timeout=60)
    if not response.ok:
        raise RuntimeError(f'Publish failed ({response.status_code}): {response.text}')
    print(json.dumps(response.json(), indent=2))
