# Finish the deck that build.js wrote: editable photo crops (srcRect), the film's entrance
# animations (timed from each slide's start, no clicks), and fade-through-black transitions
# with auto-advance, so the deck plays like the film and every step stays editable.
#   py -3.13 post.py
import json, os, re, shutil, zipfile
from lxml import etree

HERE = os.path.dirname(os.path.abspath(__file__))
DECK = os.path.join(HERE, 'Mahmoud-Alyosify-Introduction.pptx')
meta = json.load(open(os.path.join(HERE, 'build-meta.json'), encoding='utf-8'))
NS = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
P, A_ = '{%s}' % NS['p'], '{%s}' % NS['a']

ids = iter(range(10 ** 9))
def cid(): return str(next(ids) + 3)

def tgt(spid): return f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>'
def show(spid): return (f'<p:set><p:cBhvr><p:cTn id="{cid()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
                        f'{tgt(spid)}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>')
def effect(spid, filt, dur): return f'<p:animEffect transition="in" filter="{filt}"><p:cBhvr><p:cTn id="{cid()}" dur="{dur}"/>{tgt(spid)}</p:cBhvr></p:animEffect>'
def prop(spid, attr, a, b, dur): return (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr><p:cTn id="{cid()}" dur="{dur}" fill="hold"/>{tgt(spid)}'
                                         f'<p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst>'
                                         f'<p:tav tm="0"><p:val><p:strVal val="{a}"/></p:val></p:tav><p:tav tm="100000"><p:val><p:strVal val="{b}"/></p:val></p:tav></p:tavLst></p:anim>')

# type -> (presetID, presetClass, presetSubtype, behaviours)
def behaviours(kind, spid, dur, a):
    if kind in ('fade', 'letters'): return 10, 'entr', 0, show(spid) + effect(spid, 'fade', dur)
    if kind == 'wipeL': return 22, 'entr', 8, show(spid) + effect(spid, 'wipe(left)', dur)
    if kind == 'wipeR': return 22, 'entr', 2, show(spid) + effect(spid, 'wipe(right)', dur)
    if kind == 'wipeB': return 22, 'entr', 4, show(spid) + effect(spid, 'wipe(down)', dur)
    if kind == 'wipeT': return 22, 'entr', 1, show(spid) + effect(spid, 'wipe(up)', dur)
    if kind == 'rise':  return 42, 'entr', 0, show(spid) + effect(spid, 'fade', dur) + prop(spid, 'ppt_y', '#ppt_y+0.02', '#ppt_y', dur)
    if kind == 'zoom':  return 53, 'entr', 16, (show(spid) + effect(spid, 'fade', dur) + prop(spid, 'ppt_w', '#ppt_w*0.94', '#ppt_w', dur)
                                               + prop(spid, 'ppt_h', '#ppt_h*0.94', '#ppt_h', dur))
    if kind == 'grow':  return 6, 'emph', 0, (f'<p:animScale><p:cBhvr><p:cTn id="{cid()}" dur="{dur}" fill="hold"/>{tgt(spid)}</p:cBhvr>'
                                              f'<p:by x="{a["scale"] * 1000}" y="{a["scale"] * 1000}"/></p:animScale>')
    if kind == 'dim':   return 9, 'emph', 0, (f'<p:set><p:cBhvr><p:cTn id="{cid()}" dur="{dur}" fill="hold"/>{tgt(spid)}<p:attrNameLst>'
                                              f'<p:attrName>style.opacity</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="0.15"/></p:to></p:set>'
                                              f'<p:animEffect filter="image" prLst="opacity: 0.15"><p:cBhvr rctx="IE"><p:cTn id="{cid()}" dur="{dur}" fill="hold"/>{tgt(spid)}</p:cBhvr></p:animEffect>')
    raise ValueError(kind)

def timing(anims, shapes):
    global ids
    ids = iter(range(10 ** 9))
    body, grp, bld = [], {}, []
    anims = sorted(anims, key=lambda a: a['delay'])
    for i, a in enumerate(anims):
        spid, is_sp = shapes[a['name']]
        g = grp[spid] = grp.get(spid, -1) + 1
        pid, cls, sub, beh = behaviours(a['type'], spid, a['dur'], a)
        it = '<p:iterate type="lt"><p:tmPct val="10000"/></p:iterate>' if a['type'] == 'letters' else ''
        body.append(f'<p:par><p:cTn id="{cid()}" presetID="{pid}" presetClass="{cls}" presetSubtype="{sub}" fill="hold" grpId="{g}" '
                    f'nodeType="{"afterEffect" if i == 0 else "withEffect"}"><p:stCondLst><p:cond delay="{a["delay"]}"/></p:stCondLst>'
                    f'{it}<p:childTnLst>{beh}</p:childTnLst></p:cTn></p:par>')
        if is_sp: bld.append(f'<p:bldP spid="{spid}" grpId="{g}" animBg="1"/>')
    root_id, seq_id, click_id, grp_id = '1', '2', cid(), cid()
    return (f'<p:timing xmlns:p="{NS["p"]}"><p:tnLst><p:par><p:cTn id="{root_id}" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
            f'<p:seq concurrent="1" nextAc="seek"><p:cTn id="{seq_id}" dur="indefinite" nodeType="mainSeq"><p:childTnLst>'
            f'<p:par><p:cTn id="{click_id}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="{seq_id}"/></p:cond></p:stCondLst><p:childTnLst>'
            f'<p:par><p:cTn id="{grp_id}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>'
            + ''.join(body) +
            '</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn>'
            '<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
            '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>'
            '</p:childTnLst></p:cTn></p:par></p:tnLst>' + (f'<p:bldLst>{"".join(bld)}</p:bldLst>' if bld else '') + '</p:timing>')

def transition(kind, advance):
    inner = {'fade': '<p:fade/>', 'black': '<p:fade thruBlk="1"/>', 'none': ''}[kind]
    return f'<p:transition xmlns:p="{NS["p"]}" spd="slow" advTm="{advance}">{inner}</p:transition>'

work = os.path.join(HERE, '_unpacked')
shutil.rmtree(work, ignore_errors=True)
with zipfile.ZipFile(DECK) as z: z.extractall(work)
names = []
for sl in meta['slides']:
    f = os.path.join(work, 'ppt', 'slides', f'slide{sl["n"]}.xml')
    tree = etree.parse(f); root = tree.getroot()
    shapes = {}
    for el in root.iter(P + 'sp', P + 'pic', P + 'cxnSp'):
        nv = el.find('.//' + P + 'cNvPr')
        if nv is not None: shapes[nv.get('name')] = (nv.get('id'), el.tag == P + 'sp')
    # editable crops
    for pic in root.iter(P + 'pic'):
        name = pic.find('.//' + P + 'cNvPr').get('name')
        if name in meta['crops']:
            c = meta['crops'][name]; bf = pic.find(P + 'blipFill')
            for old in bf.findall(A_ + 'srcRect'): bf.remove(old)
            rect = etree.SubElement(bf, A_ + 'srcRect', {k: str(v) for k, v in c.items()})
            bf.remove(rect); bf.insert(list(bf).index(bf.find(A_ + 'blip')) + 1, rect)
    missing = [a['name'] for a in sl['anims'] if a['name'] not in shapes]
    if missing: raise SystemExit(f'slide {sl["n"]}: no shape named {missing}')
    for old in root.findall(P + 'transition') + root.findall(P + 'timing'): root.remove(old)
    anchor = root.find(P + 'clrMapOvr') if root.find(P + 'clrMapOvr') is not None else root.find(P + 'cSld')
    pos = list(root).index(anchor) + 1
    root.insert(pos, etree.fromstring(transition(sl['transition'], sl['advance'])))
    if sl['anims']: root.insert(pos + 1, etree.fromstring(timing(sl['anims'], shapes)))
    tree.write(f, xml_declaration=True, encoding='UTF-8', standalone=True)
    names.append(f'{sl["n"]}: {len(sl["anims"])} animations, {sl["transition"]}, {sl["advance"]} ms')

# store each image once: the portrait and the emblem recur on many slides
import hashlib
media = os.path.join(work, 'ppt', 'media'); first = {}; alias = {}
for fn in sorted(os.listdir(media)):
    h = hashlib.md5(open(os.path.join(media, fn), 'rb').read()).hexdigest()
    if h in first: alias[fn] = first[h]
    else: first[h] = fn
for d, _, fs in os.walk(os.path.join(work, 'ppt')):
    for fn in fs:
        if fn.endswith('.rels'):
            f = os.path.join(d, fn); t = open(f, encoding='utf-8').read()
            t2 = re.sub(r'(Target="\.\./media/)([^"]+)"', lambda m: m.group(1) + alias.get(m.group(2), m.group(2)) + '"', t)
            if t2 != t: open(f, 'w', encoding='utf-8').write(t2)
for fn in alias: os.remove(os.path.join(media, fn))
names.append(f'images stored once: {len(alias)} duplicates removed')

os.remove(DECK)
with zipfile.ZipFile(DECK, 'w', zipfile.ZIP_DEFLATED) as z:
    # [Content_Types].xml first, as Office writes it
    order = sorted((os.path.relpath(os.path.join(d, fn), work) for d, _, fs in os.walk(work) for fn in fs), key=lambda p: (p != '[Content_Types].xml', p))
    for rel in order: z.write(os.path.join(work, rel), rel.replace(os.sep, '/'))
shutil.rmtree(work)
print('\n'.join(names))
