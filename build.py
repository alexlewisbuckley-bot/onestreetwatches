import os, shutil, re, hashlib
B='site/'; OUT='prod/'
# assets are served immutable for a year, so every filename must carry a
# content hash — otherwise a browser that has visited before will keep
# running last week's JS against this week's HTML.
shutil.rmtree(OUT+'assets', ignore_errors=True)
for d in ['', 'assets/css', 'assets/js', 'assets/fonts', 'assets/img']:
    os.makedirs(OUT+d, exist_ok=True)

def fingerprint(subdir, name):
    p = OUT+'assets/'+subdir+'/'+name
    h = hashlib.sha256(open(p,'rb').read()).hexdigest()[:10]
    stem, ext = os.path.splitext(name)
    new = f'{stem}.{h}{ext}'
    os.replace(p, OUT+'assets/'+subdir+'/'+new)
    return new

# ---------- fonts ----------
FONTS=[('200','inter-tight-latin-200-normal.woff2'),('300','inter-tight-latin-300-normal.woff2'),
       ('400','inter-tight-latin-400-normal.woff2'),('500','inter-tight-latin-500-normal.woff2')]
face=''
FONTOUT={}
for w,f in FONTS:
    src='node_modules/@fontsource/inter-tight/files/'+f
    if os.path.exists(src):
        shutil.copy(src, OUT+'assets/fonts/'+f)
        hf = fingerprint('fonts', f)
        FONTOUT[f] = hf
        face+=(f'@font-face{{font-family:"Inter Tight";font-style:normal;font-weight:{w};'
               f'font-display:swap;src:url("../fonts/{hf}") format("woff2");}}\n')

# ---------- images ----------
IMGMAP={'__LOGO__':'logo.png','__IMG_CAM1__':'boutique-salon.jpg','__IMG_CAM2__':'boutique-wall.jpg',
        '__IMG_CAM3__':'boutique-lounge.jpg','__IMG_CAM4__':'boutique-corridor.jpg',
        '__IMG_EXT__':'boutique-exterior.jpg','__W_HULK__':'rolex-submariner-hulk.webp',
        '__W_STAR__':'rolex-submariner-starbucks.webp','__W_SPRITE__':'rolex-gmt-sprite.webp',
        '__W_WG__':'rolex-submariner-white-gold.webp'}
SRC={'__LOGO__':'b/logo.png','__IMG_CAM1__':'b/cam1.jpg','__IMG_CAM2__':'b/cam2.jpg',
     '__IMG_CAM3__':'b/cam3.jpg','__IMG_CAM4__':'b/cam4.jpg','__IMG_EXT__':'b/ext.jpg',
     '__W_HULK__':'b/w-hulk.webp','__W_STAR__':'b/w-starbucks.webp',
     '__W_SPRITE__':'b/w-sprite.webp','__W_WG__':'b/w-wg.webp'}
for tok,name in IMGMAP.items():
    if os.path.exists(SRC[tok]):
        shutil.copy(SRC[tok], OUT+'assets/img/'+name)
        IMGMAP[tok] = fingerprint('img', name)
ALIAS={'__W_APOR__':'__W_WG__','__W_RM__':'__W_SPRITE__','__W_SANTOS__':'__W_STAR__'}

def img_path(tok, from_css=False):
    real=ALIAS.get(tok,tok)
    return ('../img/' if from_css else 'assets/img/')+IMGMAP[real]

# ---------- css ----------
CSSOUT={}
core=(open(B+'core.css').read()+'\n'+open(B+'mobile.css').read()).replace('/*FONTS*/','')
open(OUT+'assets/css/core.css','w').write(face+core)
CSSOUT['core.css']=fingerprint('css','core.css')
for f in ['page.css','shop.css','product.css','home.css','book.css']:
    if os.path.exists(B+f):
        css=open(B+f).read()
        for tok in list(IMGMAP)+list(ALIAS): css=css.replace(tok, img_path(tok, True))
        open(OUT+'assets/css/'+f,'w').write(css)
        CSSOUT[f]=fingerprint('css',f)

# ---------- js ----------
JSOUT={}
MOBILE_JS=open(B+'mobile.js').read()
for f in sorted(os.listdir(B)):
    if f.endswith('.js') and f!='mobile.js':
        js=open(B+f).read()
        if f=='core.js': js=js+'\n'+MOBILE_JS
        for tok in list(IMGMAP)+list(ALIAS): js=js.replace(tok, img_path(tok))
        open(OUT+'assets/js/'+f,'w').write(js)
        JSOUT[f]=fingerprint('js',f)

HEADER=open(B+'header.html').read()
FOOTER=open(B+'footer.html').read()
for tok in list(IMGMAP)+list(ALIAS):
    HEADER=HEADER.replace(tok, img_path(tok)); FOOTER=FOOTER.replace(tok, img_path(tok))
HEADER=HEADER.replace('<img class="logo"','<img class="logo" width="164" height="33"')

PAGES=[('home','index','One Street Watches — pre-owned Rolex, Patek Philippe & more in Dubai and the UK',
        'Pre-owned and vintage watches held in our own stock in Dubai and the United Kingdom. Authenticated at our own bench, priced against the live market, delivered insured.','home'),
       ('shop','shop','The case — every watch in stock | One Street Watches',
        'Browse 142 authenticated pre-owned watches held in Dubai and the UK. Filter by maison, price, dial, case size, box and papers.','shop'),
       ('product','product','Submariner “Hulk” 116610LV | One Street Watches',
        'Rolex Submariner “Hulk” 116610LV, 2019, full set, excellent condition. Authenticated at our own bench with a 24-month warranty.','shop'),
       ('sell','sell','Sell or part-exchange your watch | One Street Watches',
        'A firm offer within the hour and payment the same day, in Dubai and the United Kingdom. No fees, free insured collection.','sell'),
       ('sourcing','sourcing','Concierge watch sourcing | One Street Watches',
        'Name the reference and we will hunt it through our dealer network across four time zones. Average eleven days. No fee unless we find it.','sourcing'),
       ('servicing','servicing','Watch servicing, polishing & authentication | One Street Watches',
        'Swiss-trained watchmakers at our own bench in Dubai, with free insured collection in the UAE and UK. 24-month warranty on all work.','servicing'),
       ('visit','visit','Visit the boutique — Dubai & United Kingdom | One Street Watches',
        'Gold & Diamond Park, Building 5, Dubai — open daily. Private viewings by appointment in the United Kingdom.','visit'),
       ('book','book','Schedule a viewing | One Street Watches',
        'Book a viewing in Dubai, the United Kingdom or on a video call. Pick a date and time, and we will have the tray ready before you sit down.','visit'),
       ('journal','journal','The journal | One Street Watches',
        'Market notes, buying guides and what actually happens at the bench, written by the people who buy and sell these watches every day.',''),
       ('about','about','About One Street Watches',
        'A watch dealer in Dubai and the United Kingdom, founded in 2021. We hold our own stock and authenticate it at our own bench.',''),
       ('contact','contact','Contact One Street Watches',
        'WhatsApp, phone, email, or visit us in Dubai and the United Kingdom. A real person, seven days a week.','')]

SITE='https://onestreetwatches.com'
for slug,out,title,desc,nav in PAGES:
    body=open(B+slug+'.html').read()
    for tok in list(IMGMAP)+list(ALIAS): body=body.replace(tok, img_path(tok))
    page_css = slug+'.css' if slug in ('home','shop','product','book') else 'page.css'
    extra_css = f'<link rel="stylesheet" href="assets/css/{CSSOUT[page_css]}">' if page_css in CSSOUT else ''
    extra_js = f'<script src="assets/js/{JSOUT[slug+".js"]}" defer></script>' if slug+'.js' in JSOUT else ''
    canon = SITE+'/' if out=='index' else f'{SITE}/{out}'
    html=f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canon}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}/assets/img/{IMGMAP["__IMG_CAM1__"]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F7F4EF">
<link rel="icon" href="assets/img/{IMGMAP["__LOGO__"]}">
<link rel="preconnect" href="/">
<link rel="preload" href="assets/fonts/{FONTOUT.get('inter-tight-latin-300-normal.woff2','inter-tight-latin-300-normal.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/{CSSOUT['core.css']}">
{extra_css}
<script src="assets/js/{JSOUT['core.js']}" defer></script>
{extra_js}
</head>
<body data-page="{nav}">
{HEADER}
{body}
{FOOTER}
</body>
</html>'''
    open(OUT+out+'.html','w').write(html)

# lazy-load non-critical images
for f in os.listdir(OUT):
    if f.endswith('.html'):
        h=open(OUT+f).read()
        h=h.replace('<img class="logo"','<img class="logo" fetchpriority="high"')
        open(OUT+f,'w').write(h)

print('pages :', len([f for f in os.listdir(OUT) if f.endswith('.html')]))
print('css   :', os.listdir(OUT+'assets/css'))
print('js    :', len(os.listdir(OUT+'assets/js')), 'files')
print('img   :', len(os.listdir(OUT+'assets/img')), 'files')
tot=sum(os.path.getsize(os.path.join(dp,f)) for dp,_,fs in os.walk(OUT) for f in fs)
print('total :', round(tot/1024/1024,2),'MB   (was 10MB inlined)')
print('index :', round(os.path.getsize(OUT+'index.html')/1024,1),'KB  (was 2.7MB)')
