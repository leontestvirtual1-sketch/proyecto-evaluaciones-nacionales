import sys
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

# Q29
q29 = {
    'enunciado': (
        "En una tienda de mascotas se dispone de un monto máximo de $50.000 para pagar la electricidad "
        "que se consume en un mes.\n\n"
        "La empresa eléctrica que suministra este servicio realiza el cobro, en pesos, mediante la función "
        "$c(x) = 100x + 5000$, siendo $x$ la cantidad de kWh consumidos en el mes.\n\n"
        "¿Cuál de los siguientes conjuntos contiene a todos y únicamente los posibles valores del consumo "
        "en kWh en el mes que se puede solventar con el monto disponible en esa tienda?"
    ),
    'alternativas': [
        {'letra': 'A', 'texto': '$[0, 450]$', 'es_correcta': True},
        {'letra': 'B', 'texto': '$[0, 450[$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$[0, 550[$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$[0, 5500]$', 'es_correcta': False}
    ],
    'respuesta_correcta': 'A'
}

# Q52
q52 = {
    'enunciado': (
        "Una persona apoya una escalera de 15 m sobre una pandereta de 1,5 m de altura, para poder llegar "
        "a cierta altura de un edificio, tal como se representa en la siguiente figura:\n\n"
        "El punto de apoyo de la escalera en la pandereta está justo cuando completa los 2 m de escalera.\n\n"
        "¿A qué altura de la pared del edificio llega la escalera que colocó la persona?"
    ),
    'alternativas': [
        {'letra': 'A', 'texto': 'A 15,5 m', 'es_correcta': False},
        {'letra': 'B', 'texto': 'A 11,25 m', 'es_correcta': True},
        {'letra': 'C', 'texto': 'A 9,75 m', 'es_correcta': False},
        {'letra': 'D', 'texto': 'A 5 m', 'es_correcta': False}
    ],
    'respuesta_correcta': 'B'
}

# Q59
q59 = {
    'enunciado': (
        "Los trabajadores de una empresa tienen tres tipos de sueldos según su puesto de trabajo. "
        "Hay $n$ trabajadores con un sueldo de $800.000, $m$ trabajadores con un sueldo de $500.000 "
        "y $w$ trabajadores con un sueldo de $1.100.000.\n\n"
        "¿Cuál de las siguientes fórmulas permite determinar el promedio $\\bar{X}$ de los sueldos "
        "de todos los trabajadores de esta empresa?"
    ),
    'alternativas': [
        {'letra': 'A', 'texto': '$$\\bar{X} = \\frac{800.000 + 500.000 + 1.100.000}{n + m + w}$$', 'es_correcta': False},
        {'letra': 'B', 'texto': '$$\\bar{X} = \\left(\\frac{800.000 + 500.000 + 1.100.000}{3}\\right)(n + m + w)$$', 'es_correcta': False},
        {'letra': 'C', 'texto': '$$\\bar{X} = \\frac{800.000 \\cdot n + 500.000 \\cdot m + 1.100.000 \\cdot w}{3}$$', 'es_correcta': False},
        {'letra': 'D', 'texto': '$$\\bar{X} = \\frac{800.000 \\cdot n + 500.000 \\cdot m + 1.100.000 \\cdot w}{n + m + w}$$', 'es_correcta': True}
    ],
    'respuesta_correcta': 'D'
}

for q_id, q_data in [('preg-paes-m1-23-29', q29), ('preg-paes-m1-23-52', q52), ('preg-paes-m1-23-59', q59)]:
    sb.from_('preguntas').update({
        'enunciado': q_data['enunciado'],
        'alternativas': q_data['alternativas'],
        'respuesta_correcta': q_data['respuesta_correcta'],
        'updated_at': 'now()'
    }).eq('id', q_id).execute()
    print(f"Updated {q_id} successfully.")

print("All targeted questions updated!")
