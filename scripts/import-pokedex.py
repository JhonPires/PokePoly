import urllib.request,csv,io,json,pathlib
base='https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/'
def rows(name):
 return list(csv.DictReader(io.StringIO(urllib.request.urlopen(base+name,timeout=30).read().decode('utf-8'))))
species=rows('pokemon_species.csv');types=rows('pokemon_types.csv');names=rows('pokemon_species_names.csv')
type_map={}; english={int(n['pokemon_species_id']):n['name'] for n in names if n['local_language_id']=='9'}
for r in types:
 i=int(r['pokemon_id'])
 if i<=1025:type_map.setdefault(i,[]).append(int(r['type_id']))
result=[dict(id=int(r['id']),name=english[int(r['id'])],generation=int(r['generation_id']),parent=int(r['evolves_from_species_id']) if r['evolves_from_species_id'] else None,legendary=r['is_legendary']=='1' or r['is_mythical']=='1',types=type_map[int(r['id'])]) for r in species if int(r['id'])<=1025]
pathlib.Path('assets/data/pokedex.json').write_text(json.dumps(result,ensure_ascii=False),encoding='utf-8')
print('Cached species:',len(result))

existing=[int(p.stem.split('_')[1]) for p in pathlib.Path('assets/pokemons').glob('poke_*.gif') if p.stem.split('_')[1].isdigit()]
pathlib.Path('src/pokedex.js').write_text('export const evolutionDex='+json.dumps(result,ensure_ascii=False)+';\nexport const pokedex=evolutionDex.filter(p=>p.generation<=9);\nexport const availableSprites='+json.dumps(existing)+';\n',encoding='utf-8')
