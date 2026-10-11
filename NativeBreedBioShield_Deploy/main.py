import os, sqlite3, json, urllib.request, urllib.parse
from datetime import datetime, timezone
from pathlib import Path
from contextlib import asynccontextmanager
from typing import Optional
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()
BASE = Path(__file__).resolve().parent
DIST = BASE / 'dist'
DB_PATH = Path(os.getenv('DATABASE_PATH', str(BASE / 'bioshield.db')))
REVIEWER_KEY = os.getenv('REVIEWER_KEY', 'demo-reviewer-123')

def db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con

def init_db():
    with db() as c:
        c.executescript('''
        CREATE TABLE IF NOT EXISTS cattle(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, breed TEXT NOT NULL, age TEXT, sex TEXT, location TEXT, notes TEXT, created_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS crop_trials(id INTEGER PRIMARY KEY AUTOINCREMENT, crop TEXT NOT NULL, breed TEXT, location TEXT, result TEXT, notes TEXT, created_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS services(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT, phone TEXT, location TEXT, description TEXT, vet_verified INTEGER DEFAULT 0, created_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS chat_history(id INTEGER PRIMARY KEY AUTOINCREMENT, user_message TEXT NOT NULL, assistant_message TEXT NOT NULL, created_at TEXT NOT NULL);
        ''')

@asynccontextmanager
async def lifespan(app):
    init_db()
    yield

app = FastAPI(title='NativeBreed BioShield API', version='1.0.0', lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=False, allow_methods=['*'], allow_headers=['*'])

class ChatRequest(BaseModel):
    message: Optional[str] = Field(default=None, max_length=10000)
    text: Optional[str] = Field(default=None, max_length=10000)
    user_message: Optional[str] = Field(default=None, max_length=10000)
    language: Optional[str] = 'English'
    history: list[dict] = []

class TranslateRequest(BaseModel):
    text: str
    sourceLanguage: Optional[str] = None
    targetLanguage: Optional[str] = None
    source_language: Optional[str] = None
    target_language: Optional[str] = None

class CattleCreate(BaseModel):
    name: Optional[str] = None
    breed: str
    age: Optional[str] = None
    sex: Optional[str] = None
    location: Optional[str] = None
    notes: Optional[str] = None

class TrialCreate(BaseModel):
    crop: str
    breed: Optional[str] = None
    location: Optional[str] = None
    result: Optional[str] = None
    notes: Optional[str] = None

class ServiceCreate(BaseModel):
    name: str
    category: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None

BREEDS = [
 {'name':'Gir','origin':'Gujarat','description':'Indigenous dairy cattle breed.'},
 {'name':'Sahiwal','origin':'Punjab region','description':'Indigenous dairy cattle breed.'},
 {'name':'Tharparkar','origin':'Thar region','description':'Dual-purpose indigenous cattle breed.'},
]

def rows(sql, args=()):
    with db() as c: return [dict(r) for r in c.execute(sql,args).fetchall()]

def demo_reply(msg):
    s=msg.lower()
    if any(x in s for x in ['hello','hi','hey']): return 'Hello! I’m NativeBreed BioShield. Ask me about native-breed information, cattle records, or general animal-care guidance.'
    if any(x in s for x in ['sick','ill','fever','not eating','symptom','injury']): return 'I can help you note the signs, but I cannot diagnose an animal. Please contact a qualified veterinarian promptly, especially if the animal seems very unwell or symptoms are worsening. Share the animal’s breed, age, and the signs you noticed.'
    if any(x in s for x in ['gir','sahiwal','tharparkar','breed','native cattle']): return 'Native cattle breeds have distinct regional histories and characteristics. Tell me which breed you are interested in (Gir, Sahiwal, or Tharparkar), and I can share a concise overview. For animal-specific health decisions, consult a veterinarian.'
    return 'Thanks for your question. I’m the NativeBreed BioShield demo assistant. I can help with native-breed information and general record-keeping guidance. For health concerns, please consult a qualified veterinarian.'

def ai_reply(msg, language):
    key=os.getenv('BIOSHIELD_AI_API_KEY') or os.getenv('OPENAI_API_KEY')
    if not key: return None
    base=os.getenv('BIOSHIELD_AI_BASE_URL','https://api.openai.com/v1').rstrip('/')
    model=os.getenv('BIOSHIELD_AI_MODEL','gpt-4o-mini')
    body={'model':model,'messages':[{'role':'system','content':f'You are NativeBreed BioShield, a helpful assistant for indigenous livestock information. Reply in {language or "English"}. Be careful: do not diagnose animals or prescribe treatment. Encourage contacting a qualified veterinarian for health concerns. Be clear and concise.'},{'role':'user','content':msg}], 'temperature':0.4}
    req=urllib.request.Request(base+'/chat/completions', data=json.dumps(body).encode(), headers={'Authorization':'Bearer '+key,'Content-Type':'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=25) as r: data=json.loads(r.read().decode())
        return data['choices'][0]['message']['content'].strip()
    except Exception:
        return None

@app.get('/api/health')
def health(): return {'status':'ok','database':'connected'}

@app.get('/api/breeds')
def breeds(): return {'items':BREEDS}

@app.post('/api/chat')
def chat(payload: ChatRequest):
    msg=(payload.message or payload.text or payload.user_message or '').strip()
    answer=ai_reply(msg,payload.language) if msg else None
    mode='ai' if answer else 'demo'
    answer=answer or (demo_reply(msg) if msg else 'Please type a message so I can respond.')
    with db() as c: c.execute('INSERT INTO chat_history(user_message,assistant_message,created_at) VALUES(?,?,?)',(msg,answer,datetime.now(timezone.utc).isoformat()))
    return {'reply':answer,'answer':answer,'response':answer,'mode':mode}

@app.post('/api/translate')
def translate(payload: TranslateRequest):
    src=payload.sourceLanguage or payload.source_language or 'en'
    dst=payload.targetLanguage or payload.target_language or 'en'
    # MyMemory expects language codes, e.g. en|hi.
    langs={'english':'en','hindi':'hi','telugu':'te','tamil':'ta','kannada':'kn','malayalam':'ml','marathi':'mr','bengali':'bn'}
    src=langs.get(src.lower(),src); dst=langs.get(dst.lower(),dst)
    try:
        query=urllib.parse.urlencode({'q':payload.text,'langpair':f'{src}|{dst}'})
        with urllib.request.urlopen('https://api.mymemory.translated.net/get?'+query,timeout=15) as r: data=json.loads(r.read().decode())
        translated=data.get('responseData',{}).get('translatedText')
        if not translated: raise ValueError('No translation returned')
        return {'translatedText':translated,'translated_text':translated}
    except Exception:
        raise HTTPException(status_code=502,detail='Translation service is temporarily unavailable.')

@app.post('/api/cattle')
def add_cattle(item:CattleCreate):
    with db() as c:
        cur=c.execute('INSERT INTO cattle(name,breed,age,sex,location,notes,created_at) VALUES(?,?,?,?,?,?,?)',(item.name,item.breed,item.age,item.sex,item.location,item.notes,datetime.now(timezone.utc).isoformat()))
        return {'id':cur.lastrowid,'message':'Cattle record saved'}

@app.get('/api/cattle')
def get_cattle(): return {'items':rows('SELECT * FROM cattle ORDER BY id DESC')}

@app.get('/api/cattle/{cattle_id}')
def one_cattle(cattle_id:int):
    found=rows('SELECT * FROM cattle WHERE id=?',(cattle_id,))
    if not found: raise HTTPException(404,'Cattle record not found')
    return found[0]

@app.post('/api/trials')
def add_trial(item:TrialCreate):
    with db() as c:
        cur=c.execute('INSERT INTO crop_trials(crop,breed,location,result,notes,created_at) VALUES(?,?,?,?,?,?)',(item.crop,item.breed,item.location,item.result,item.notes,datetime.now(timezone.utc).isoformat()))
        return {'id':cur.lastrowid,'message':'Trial saved'}

@app.get('/api/trials')
def get_trials(): return {'items':rows('SELECT * FROM crop_trials ORDER BY id DESC')}

@app.post('/api/services')
def add_service(item:ServiceCreate):
    with db() as c:
        cur=c.execute('INSERT INTO services(name,category,phone,location,description,created_at) VALUES(?,?,?,?,?,?)',(item.name,item.category,item.phone,item.location,item.description,datetime.now(timezone.utc).isoformat()))
        return {'id':cur.lastrowid,'message':'Service submitted for review'}

@app.get('/api/services')
def get_services(): return {'items':rows('SELECT * FROM services WHERE vet_verified=1 ORDER BY id DESC')}

@app.get('/api/services/pending')
def pending_services(): return {'items':rows('SELECT * FROM services WHERE vet_verified=0 ORDER BY id DESC')}

@app.patch('/api/services/{service_id}/verify')
def verify_service(service_id:int, x_reviewer_key:Optional[str]=Header(default=None)):
    if not x_reviewer_key or x_reviewer_key != REVIEWER_KEY: raise HTTPException(403,'Invalid reviewer key')
    with db() as c:
        cur=c.execute('UPDATE services SET vet_verified=1 WHERE id=?',(service_id,))
        if not cur.rowcount: raise HTTPException(404,'Service not found')
    return {'message':'Service verified'}

@app.get('/api/dashboard')
def dashboard():
    with db() as c:
        return {'cattle_count':c.execute('SELECT COUNT(*) FROM cattle').fetchone()[0], 'trial_count':c.execute('SELECT COUNT(*) FROM crop_trials').fetchone()[0], 'service_count':c.execute('SELECT COUNT(*) FROM services WHERE vet_verified=1').fetchone()[0]}

@app.get('/api/dashboard/recent')
def dashboard_recent():
    return {'cattle':rows('SELECT id,name,breed,created_at FROM cattle ORDER BY id DESC LIMIT 5'),'trials':rows('SELECT id,crop,location,created_at FROM crop_trials ORDER BY id DESC LIMIT 5')}

@app.get('/api/fieldguard')
def fieldguard(text:str=''):
    terms=['dry','drought','flood','heat','water','stress']
    flags=[t for t in terms if t in text.lower()]
    return {'risk_terms':flags,'note':'Keyword screening only. This is not a prediction, diagnosis, or substitute for local expert advice.'}

@app.get('/')
def home():
    index=DIST/'index.html'
    if index.exists(): return FileResponse(index)
    return {'name':'NativeBreed BioShield','status':'API running','frontend':'Build the frontend to create dist/','docs':'/docs'}

# Serve Vite's built assets and support client-side routes on the same domain.
if (DIST/'assets').is_dir():
    app.mount('/assets', StaticFiles(directory=DIST/'assets'), name='assets')

@app.get('/{full_path:path}')
def frontend_routes(full_path:str):
    candidate=(DIST/full_path).resolve()
    try: candidate.relative_to(DIST.resolve())
    except ValueError: raise HTTPException(404,'Not found')
    if candidate.is_file(): return FileResponse(candidate)
    index=DIST/'index.html'
    if index.is_file(): return FileResponse(index)
    raise HTTPException(404,'Not found')
