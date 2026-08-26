from pathlib import Path
import base64, re, sys

base_path = Path(sys.argv[1])
data_dir = Path(sys.argv[2])
out_path = Path(sys.argv[3])

base = base_path.read_text(encoding='utf-8')
module_file = data_dir / 'mother_module.html'
if module_file.exists():
    mother = module_file.read_text(encoding='utf-8')
else:
    chunks = sorted(data_dir.glob('chunk*.txt'))
    if not chunks:
        raise SystemExit('mother quiz data not found')
    mother = ''.join(p.read_text(encoding='utf-8') for p in chunks)

mother = mother.replace('<title>前後左右上下宇宙大の思い出クイズ</title>', '<title>あの日、あの時クイズ</title>', 1)
encoded = base64.b64encode(mother.encode('utf-8')).decode('ascii')

pattern = re.compile(r'("anohi":")[^"]*(")')
patched, count = pattern.subn(lambda m: m.group(1) + encoded + m.group(2), base, count=1)
if count != 1:
    raise SystemExit('anohi module not found in base app')

patched = patched.replace('const ANOHI_MASTER_KEY="anohi_master_questions_v1";', 'const ANOHI_MASTER_KEY="anohi_master_questions_mother_v1";')
patched = patched.replace('const ANOHI_DB_NAME="anohi_memory_quiz_db_v1";', 'const ANOHI_DB_NAME="anohi_memory_quiz_db_mother_v1";')

out_path.parent.mkdir(parents=True, exist_ok=True)
out_path.write_text(patched, encoding='utf-8')
print(f'Built mother version: {out_path} ({out_path.stat().st_size} bytes)')
