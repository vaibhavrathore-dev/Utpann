from PIL import Image,ImageDraw,ImageFilter,ImageFont
import math,random,os
out=os.path.join(os.path.dirname(os.path.dirname(__file__)),'assets','images');os.makedirs(out,exist_ok=True)
S=720
font_path='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font=ImageFont.truetype(font_path,18)

def base(col1,col2):
    im=Image.new('RGB',(S,S));p=im.load()
    for y in range(S):
      for x in range(S):
        t=min(1,math.hypot((x-S*.25)/S*.9,(y-S*.18)/S*.9))
        p[x,y]=tuple(int(a*(1-t)+b*t) for a,b in zip(col1,col2))
    return im

def shade(poly,fg,shadow=16):
    layer=Image.new('RGBA',(S,S));d=ImageDraw.Draw(layer);d.polygon([(a+17,b+20) for a,b in poly],fill=(2,2,12,150));blur=layer.filter(ImageFilter.GaussianBlur(shadow));return blur

def plank(d,x,y,w,h,depth=24,c=(193,147,106)):
    dr=tuple(max(0,round(v*.66)) for v in c);top=tuple(min(255,round(v*1.18)) for v in c)
    d.polygon([(x,y),(x+depth,y-depth//2),(x+w+depth,y-depth//2),(x+w,y)], fill=top)
    d.polygon([(x+w,y),(x+w+depth,y-depth//2),(x+w+depth,y+h-depth//2),(x+w,y+h)],fill=dr)
    d.rounded_rectangle((x,y,x+w,y+h),fill=c,radius=3)
    for yy in (y+int(h*.35), y+int(h*.7)):
        d.line((x+7,yy,x+w-7,yy),fill=tuple(min(255,int(v*1.06)) for v in c),width=2)

def shelf():
    im=base((48,38,54),(15,21,33))
    lay=Image.new('RGBA',(S,S));d=ImageDraw.Draw(lay)
    d.ellipse((155,550,606,654),fill=(0,0,0,130));im=Image.alpha_composite(im.convert('RGBA'),lay.filter(ImageFilter.GaussianBlur(29)))
    d=ImageDraw.Draw(im)
    d.polygon([(200,210),(498,154),(566,184),(267,244)],fill=(217,168,118))
    d.polygon([(200,210),(267,244),(267,525),(200,500)],fill=(159,103,75))
    d.polygon([(498,154),(566,184),(566,470),(498,500)],fill=(122,79,59))
    for sy in (285,397,500):
        d.polygon([(218,sy),(497,sy-45),(553,sy-19),(271,sy+28)],fill=(236,192,146))
        d.polygon([(271,sy+28),(553,sy-19),(553,sy+1),(271,sy+47)],fill=(151,92,66))
        d.line((218,sy,497,sy-45),fill=(255,214,165),width=5)
    d.polygon([(194,201),(506,145),(569,178),(266,239)],fill=(247,202,153))
    for x,y in [(244,275),(468,235),(246,390),(467,355)]:d.ellipse((x-3,y-3,x+3,y+3),fill=(86,56,49))
    return im.convert('RGB')

def boards():
    im=base((47,45,70),(15,18,33)); d=ImageDraw.Draw(im)
    d.ellipse((130,542,610,648),fill=(21,20,35))
    for j in range(4):
        x,y=140+j*15,460-j*54
        d.polygon([(x,y),(x+348,y-57),(x+410,y-38),(x+59,y+24)],fill=(209-j*9,163-j*7,126-j*5))
        d.polygon([(x+59,y+24),(x+410,y-38),(x+410,y-10),(x+59,y+51)],fill=(149-j*8,93-j*5,73-j*4))
        d.polygon([(x,y),(x+59,y+24),(x+59,y+51),(x,y+26)],fill=(178-j*8,112-j*4,85-j*3))
    return im

def organizer():
    im=base((24,34,49),(14,16,28));d=ImageDraw.Draw(im)
    d.ellipse((170,570,560,635),fill=(17,18,26))
    d.rounded_rectangle((205,200,480,558),radius=7,fill=(207,165,134))
    d.rectangle((225,221,460,529),fill=(32,40,52))
    for top in (270,373,476):
        d.polygon([(216,top),(466,top-23),(466,top),(216,top+24)],fill=(224,187,149))
        d.line((217,top,467,top-23),fill=(248,220,183),width=6)
    d.rounded_rectangle((235,236,280,288),radius=4,fill=(147,184,151))
    d.rounded_rectangle((295,245,325,300),radius=3,fill=(182,168,207))
    d.rounded_rectangle((340,226,404,290),radius=2,fill=(221,193,139))
    d.ellipse((395,432,451,490),fill=(117,166,135));d.rectangle((415,481,434,510),fill=(191,161,128))
    return im

def room():
    im=base((38,42,56),(10,15,27)); d=ImageDraw.Draw(im)
    d.polygon([(0,120),(490,0),(490,460),(0,600)],fill=(59,61,68))
    d.polygon([(490,0),(720,75),(720,550),(490,460)],fill=(42,47,58))
    d.polygon([(0,600),(490,460),(720,550),(720,720),(0,720)],fill=(90,73,68))
    d.line([(490,0),(490,460)],fill=(114,103,105),width=4)
    d.rectangle((88,220,255,425),fill=(84,107,114));d.rectangle((102,229,241,412),fill=(174,205,195))
    d.line((172,229,172,412),fill=(85,96,98),width=9)
    d.rounded_rectangle((340,300,554,558),radius=3,fill=(196,159,119))
    d.rectangle((355,315,539,542),fill=(45,50,56))
    for sy in (375,455): d.polygon([(355,sy),(539,sy),(539,sy+20),(355,sy+20)],fill=(233,193,150))
    return im

for name,fn in [('shelf',shelf),('boards',boards),('organizer',organizer),('room',room)]:
    fn().save(os.path.join(out,name+'.jpg'),quality=91,optimize=True)
print('created assets:',os.listdir(out))
