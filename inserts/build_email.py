from PIL import Image, ImageDraw, ImageFont
F='/tmp/claude-0/-home-claude/029d9b45-41d6-5ea9-9540-ba9e11bee6ef/scratchpad/fonts/'
W,H=1200,800; M=64; CUT=0.085
wm=Image.open('/root/.claude/uploads/029d9b45-41d6-5ea9-9540-ba9e11bee6ef/7d2a02c6-image.png').convert('RGBA'); wm=wm.crop(wm.getbbox())
src=Image.open('/mnt/user-data/uploads/KAZi_1X5A8855.jpg').convert('RGB'); sw,sh=src.size
z=1-CUT; cw,ch=int(sw*z),int(sh*z); cx=(sw-cw)//2; cy=sh-ch
card=src.crop((cx,cy,cx+cw,cy+ch)).resize((W,H),Image.LANCZOS)
GH=290; g=Image.new('L',(W,H),0); gd=ImageDraw.Draw(g)
for y in range(H-GH,H): gd.line([(0,y),(W,y)],fill=int(215*((y-(H-GH))/GH)**1.2))
card=Image.composite(Image.new('RGB',(W,H),(6,6,6)),card,g); d=ImageDraw.Draw(card)
A=lambda s: ImageFont.truetype(F+'anton-latin-400-normal.ttf',s)
C=lambda s: ImageFont.truetype(F+'courier-prime-latin-700-normal.ttf',s)
R=lambda s: ImageFont.truetype(F+'archivo-latin-400-normal.ttf',s)
ink=(244,244,244); dim=(215,213,205)
WH=124; ww=int(wm.width*WH/wm.height); card.paste(wm.resize((ww,WH),Image.LANCZOS),(M,H-M-WH),wm.resize((ww,WH),Image.LANCZOS))
x=M+ww+36; xr=W-M; r1=H-M-60; r2=H-M-2
d.text((x,r1),"10% OFF YOUR NEXT ORDER",font=A(58),fill=ink,anchor="ls")
f=C(38); d.text((x,r2),"CODE:",font=f,fill=dim,anchor="ls"); d.text((x+f.getlength("CODE: "),r2),"RETRANSMIT",font=f,fill=ink,anchor="ls")
d.text((xr,r1),"@staticmassive",font=R(30),fill=dim,anchor="rs")
d.text((xr,r2),"staticmassive.com",font=C(30),fill=ink,anchor="rs")
print('row1 gap',(xr-R(30).getlength('@staticmassive'))-(x+A(58).getlength('10% OFF YOUR NEXT ORDER')),'row2 gap',(xr-C(30).getlength('staticmassive.com'))-(x+C(38).getlength('CODE: RETRANSMIT')))
out='/home/claude/webimages/inserts/retransmit-email-1200x800.jpg'
card.save(out,quality=82,optimize=True,progressive=True,dpi=(144,144))
import os; print(os.path.getsize(out)//1024,'KB')
