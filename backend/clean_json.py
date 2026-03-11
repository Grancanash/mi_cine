import json

# Campos únicos que queremos limpiar por modelo
unique_fields = {
    "catalogs.category": "name",
    "catalogs.actor": "name",
    "catalogs.platform": "name",
    "accounts.profile": "user",
}

with open("datos.json", "r", encoding="utf-8") as f:
    data = json.load(f)

seen = {model: set() for model in unique_fields}
cleaned = []

for obj in data:
    model = obj["model"]
    field = unique_fields.get(model)
    if field:
        key = obj["fields"][field]
        if key in seen[model]:
            continue  # saltamos duplicados
        seen[model].add(key)
    cleaned.append(obj)

with open("datos_clean.json", "w", encoding="utf-8") as f:
    json.dump(cleaned, f, ensure_ascii=False, indent=2)

print("Archivo limpio creado: datos_clean.json")
