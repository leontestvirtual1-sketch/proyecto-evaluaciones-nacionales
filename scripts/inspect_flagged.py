import sys
import pdfplumber
import re
from supabase import create_client

sys.stdout.reconfigure(encoding='utf-8')

env = {}
with open('.env.local', 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1)
            env[k.strip()] = v.strip().strip("'\"")

sb = create_client(env['VITE_SUPABASE_URL'], env['SUPABASE_SERVICE_ROLE_KEY'])

# Check Q52 in DB
q52 = sb.from_('preguntas').select('id, enunciado, alternativas').eq('id', 'preg-paes-m1-23-52').execute().data[0]
print("--- Q52 in DB ---")
print(q52['enunciado'])

# Check Q29 in DB
q29 = sb.from_('preguntas').select('id, enunciado, alternativas').eq('id', 'preg-paes-m1-23-29').execute().data[0]
print("\n--- Q29 in DB ---")
print(q29['enunciado'])

# Check Q59 in DB
q59 = sb.from_('preguntas').select('id, enunciado, alternativas').eq('id', 'preg-paes-m1-23-59').execute().data[0]
print("\n--- Q59 in DB ---")
print(q59['enunciado'])
