import json
import os
import re
import zipfile
from pathlib import Path, PurePosixPath

import boto3

WORK_DIR = Path(__file__).parent / '.work'

def safe_path(value: object) -> str:
    if not isinstance(value, str) or not value or len(value) > 240:
        raise ValueError('Invalid generated filename.')
    path = PurePosixPath(value)
    if path.is_absolute() or '..' in path.parts or path.parts[0] in ('.', ''):
        raise ValueError(f'Unsafe generated filename: {value}')
    return str(path)

def client():
    account = os.environ['R2_ACCOUNT_ID']
    return boto3.client('s3', endpoint_url=f'https://{account}.r2.cloudflarestorage.com', aws_access_key_id=os.environ['R2_ACCESS_KEY_ID'], aws_secret_access_key=os.environ['R2_SECRET_ACCESS_KEY'], region_name='auto')

def package_and_upload(product: dict) -> str:
    slug = product.get('slug')
    if not isinstance(slug, str) or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
        raise ValueError('Product has an invalid slug.')
    product_files = product.get('files')
    if not isinstance(product_files, list) or not product_files:
        raise ValueError('Product must contain at least one file.')
    zip_path = WORK_DIR / f'{slug}.zip'
    total_size = 0
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as archive:
        archive.writestr('README.md', f"# {product['title']}\n\n{product['description']}")
        for item in product_files:
            filename = safe_path(item.get('filename')) if isinstance(item, dict) else ''
            content = item.get('content') if isinstance(item, dict) else None
            if not isinstance(content, str): raise ValueError(f'Invalid contents for {filename}.')
            total_size += len(content.encode('utf-8'))
            if total_size > 10_000_000: raise ValueError('Generated product exceeds the 10 MB packaging limit.')
            archive.writestr(filename, content)
    key = f'products/{slug}.zip'
    with zip_path.open('rb') as source: client().upload_fileobj(source, os.environ.get('R2_BUCKET_NAME', 'apexbluesky-store'), key, ExtraArgs={'ContentType': 'application/zip'})
    zip_path.unlink(missing_ok=True)
    domain = os.environ['PUBLIC_R2_DOMAIN'].rstrip('/')
    return f'https://{domain}/{key}'

if __name__ == '__main__':
    product = json.loads((WORK_DIR / 'product_brief.json').read_text(encoding='utf-8'))
    product['downloadUrl'] = package_and_upload(product)
    (WORK_DIR / 'product_ready.json').write_text(json.dumps(product, indent=2), encoding='utf-8')
    print(f"Uploaded product asset for {product['slug']}")
