from pathlib import Path
import re, json, base64, sys

p = Path(sys.argv[1] if len(sys.argv) > 1 else 'brain-training/index.html')
s = p.read_text(encoding='utf-8')

# Start directly on the menu without flashing the あの日、あの時 maker screen.
guard = '<style id="startup-guard">html.booting #runner{display:none!important}html.booting #frame{visibility:hidden!important}</style>'
if '<html' in s and 'class="booting"' not in s:
    s = s.replace('<html lang="ja">', '<html lang="ja" class="booting">', 1)
if 'id="startup-guard"' not in s:
    s = s.replace('</head>', guard + '</head>', 1)
boot = '''<script id="startup-menu-fix">(function(){function home(){var r=document.getElementById('runner'),f=document.getElementById('frame');if(f)f.srcdoc='';if(r){r.style.display='none';r.classList.remove('open')}window.scrollTo(0,0)}document.addEventListener('DOMContentLoaded',function(){home();requestAnimationFrame(function(){requestAnimationFrame(function(){document.documentElement.classList.remove('booting')})})});window.addEventListener('pageshow',function(){document.documentElement.classList.add('booting');home();requestAnimationFrame(function(){document.documentElement.classList.remove('booting')})});window.addEventListener('pagehide',home);})();</script>'''
if 'id="startup-menu-fix"' not in s:
    s = s.replace('</body>', boot + '</body>', 1)

# Gift-export fix. Old gifts restored their built-in questions on every launch.
# A gift now writes its built-in questions only once, then remembers that seed
# in the same IndexedDB store. Deleting a question therefore stays deleted.
m = re.search(r'const MODS=(\{.*?\});', s, re.S)
if m:
    mods = json.loads(m.group(1))
    if 'anohi' in mods:
        a = base64.b64decode(mods['anohi']).decode('utf-8')
        if 'const giftId="gift_"+Date.now()' not in a:
            a = a.replace(
                '    const payload=JSON.stringify(QS);\n    const whole=window.parent.document.documentElement.outerHTML;',
                '    const payload=JSON.stringify(QS);\n    const giftId="gift_"+Date.now()+"_"+Math.random().toString(36).slice(2);\n    const whole=window.parent.document.documentElement.outerHTML;',
                1,
            )
        if 'const GIFT_SEED_KEY=${JSON.stringify(giftId)};' not in a:
            a = a.replace(
                ' const GIFT_QS=${payload};\n function openGiftDB(){',
                ' const GIFT_QS=${payload};\n const GIFT_SEED_KEY=${JSON.stringify(giftId)};\n function openGiftDB(){',
                1,
            )
        old = ''' window.addEventListener("DOMContentLoaded",async()=>{\n   try{\n     const db=await openGiftDB();\n     await new Promise((resolve,reject)=>{\n       const tx=db.transaction("questions","readwrite");\n       tx.objectStore("questions").put(GIFT_QS,"all");\n       tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);\n     });\n   }catch(e){console.error(e)}\n });'''
        new = ''' window.addEventListener("DOMContentLoaded",async()=>{\n   try{\n     const db=await openGiftDB();\n     const already=await new Promise((resolve,reject)=>{\n       const tx=db.transaction("questions","readonly");\n       const req=tx.objectStore("questions").get(GIFT_SEED_KEY);\n       req.onsuccess=()=>resolve(!!req.result);\n       req.onerror=()=>reject(req.error);\n     });\n     if(already)return;\n     await new Promise((resolve,reject)=>{\n       const tx=db.transaction("questions","readwrite");\n       const store=tx.objectStore("questions");\n       store.put(GIFT_QS,"all");\n       store.put(true,GIFT_SEED_KEY);\n       tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);\n     });\n   }catch(e){console.error(e)}\n });'''
        if old in a:
            a = a.replace(old, new, 1)
        mods['anohi'] = base64.b64encode(a.encode('utf-8')).decode('ascii')
        newmods = json.dumps(mods, ensure_ascii=False, separators=(',', ':'))
        s = s[:m.start(1)] + newmods + s[m.end(1):]

p.write_text(s, encoding='utf-8')
