from PIL import Image,ImageDraw,ImageFont,ImageFilter
from pathlib import Path
import math
root=Path(__file__).resolve().parents[1]
out=Path('/mnt/data/RAY-Mobile-UI-Concept.png')
S=2
W=420;H=900
bg='#090A10';panel='#161923';white='#F7F5F0';lav='#C4B2FF';dim='#A5A8B7'
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
light='/usr/share/fonts/truetype/noto/NotoSansDisplay-Regular.ttf'
medium='/usr/share/fonts/truetype/noto/NotoSansDisplay-Medium.ttf'

def f(n,med=False):return ImageFont.truetype(medium if med else light,int(n*S))
def canvas():
 im=Image.new('RGB',(W*S,H*S),bg);return im,ImageDraw.Draw(im)
def rect(d,box,fill,r=0,width=0,outline=None):
 bb=tuple(int(v*S) for v in box);d.rounded_rectangle(bb,radius=int(r*S),fill=fill,outline=outline,width=width*S)
def t(d,pos,content,size,color,med=False):d.text((int(pos[0]*S),int(pos[1]*S)),content,font=f(size,med),fill=color)
def imgcard(im,filename,box,rad=16):
 x,y,w,h=box;src=Image.open(root/'assets/images'/filename).convert('RGB').resize((w*S,h*S))
 mask=Image.new('L',src.size);ImageDraw.Draw(mask).rounded_rectangle((0,0,w*S,h*S),radius=rad*S,fill=255)
 im.paste(src,(x*S,y*S),mask)

def chrome(im,d,title,subtitle):
 rect(d,(22,22,67,67),panel,11,1,'#43414E');t(d,(32,30),'R.',26,white,True);t(d,(165,37),title,12,white,True);rect(d,(357,24,399,65),panel,22,1,'#333642');t(d,(369,35),'≡',18,white)

def home():
 im,d=canvas();chrome(im,d,'RAY / STUDIO','');t(d,(25,96),'THE CREATION LAB',10,lav,True);t(d,(305,96),'EST. 2026  01-04',9,dim)
 cx,cy=210,346
 for r in (76,132,181):
  d.ellipse(((cx-r)*S,(cy-r)*S,(cx+r)*S,(cy+r)*S),outline='#272432',width=2)
 imgcard(im,'boards.jpg',(18,166,118,130));imgcard(im,'shelf.jpg',(290,187,113,135));imgcard(im,'room.jpg',(15,435,118,124));imgcard(im,'organizer.jpg',(294,449,111,120))
 rect(d,(25,271,404,423),'#090A1044',18)
 t(d,(93,290),'MATERIAL-AWARE CREATION',9,lav,True)
 t(d,(100,316),'Make room',43,white,True);t(d,(126,369),'for more.',40,lav,True)
 t(d,(136,590),'EXPLORE THE POSSIBILITIES  ↓',9,dim)
 rect(d,(25,635,64,638),lav)
 t(d,(25,661),"Don't just imagine.",28,white,True);t(d,(25,700),'See what fits.',29,lav,True)
 t(d,(25,754),'Measure your space. Add what you own.',13,dim)
 t(d,(25,778),'Explore a personalized 3D design.',13,dim)
 rect(d,(25,815,395,876),lav,19);t(d,(116,835),'Start creating     ↗',16,bg,True)
 return im

def space():
 im,d=canvas();chrome(im,d,'SPACE / 01','');t(d,(24,105),'STEP ONE / SET YOUR BOUNDARIES',10,lav,True)
 t(d,(24,139),'Every great idea',36,white,True);t(d,(24,183),'starts somewhere.',34,lav,True)
 t(d,(24,249),'Use your camera for context,',14,dim);t(d,(24,271),'then confirm your measurements.',14,dim)
 imgcard(im,'room.jpg',(24,322,372,255),23)
 rect(d,(38,340,227,371),'#12131CD9',8);t(d,(51,350),'SPACE VISUALIZATION',10,white,True)
 d.rectangle((int(95*S),int(368*S),int(332*S),int(535*S)),outline=lav,width=2)
 t(d,(28,607),'CONFIRMED DIMENSIONS',11,lav,True)
 for x,label,value in [(24,'WIDTH','75'),(155,'HEIGHT','55'),(286,'DEPTH','35')]:
  t(d,(x,645),label,10,lav,True);rect(d,(x,665,x+111,729),panel,13,1,'#393842');t(d,(x+13,675),value,26,white,True);t(d,(x+77,694),'cm',11,dim)
 rect(d,(24,757,396,804),panel,12);t(d,(38,771),'◎  Measurements remain editable.',12,dim)
 rect(d,(24,820,396,881),lav,18);t(d,(95,839),'Continue to materials     ↗',15,bg,True)
 return im

def model():
 im,d=canvas();chrome(im,d,'MODEL STUDIO','')
 t(d,(24,100),'OFFLINE SCENE DEMO / INTERACTIVE',10,lav,True)
 t(d,(24,133),'Modular desk organizer',27,white,True)
 rect(d,(16,190,403,587),panel,22);imgcard(im,'organizer.jpg',(26,200,368,370),18)
 rect(d,(34,216,209,249),'#14151FCC',10);t(d,(42,225),'TRUE SCALE · cm / 100',10,'#D9F4BF',True)
 rect(d,(24,610,396,614),lav)
 t(d,(24,639),'ASSEMBLY STORY',10,lav,True);t(d,(362,639),'1 / 4',11,dim)
 t(d,(24,672),'Inspect your materials',24,white,True)
 t(d,(24,713),'Check board dimensions and condition',13,dim)
 t(d,(24,736),'before proceeding.',13,dim)
 rect(d,(24,783,199,831),panel,14);t(d,(82,796),'Previous',13,white,True)
 rect(d,(211,783,396,831),lav,14);t(d,(264,796),'Next part',13,bg,True)
 rect(d,(24,841,199,887),panel,14);t(d,(75,851),'Save concept',12,white,True)
 rect(d,(211,841,396,887),lav,14);t(d,(271,851),'View in AR',12,bg,True)
 return im

screens=[home(),space(),model()]
margin=28
sheet=Image.new('RGB',(len(screens)*W*S+(len(screens)+1)*margin*S,H*S+110*S),'#090A10')
d=ImageDraw.Draw(sheet)
for i,sc in enumerate(screens):
 x=(i*W+(i+1)*margin)*S;y=56*S
 sheet.paste(sc,(x,y));d.rounded_rectangle((x-1,y-1,x+W*S+1,y+H*S+1),radius=22*S,outline='#3C394C',width=3)
 t(d,(x/S+15,15),['RAY / HOME','RAY / MEASURE','RAY / MODEL'][i],14,'#D9D1FB',True)
sheet.save(out,optimize=True)
print(out,sheet.size)
