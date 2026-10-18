from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random
F='/tmp/claude-0/-home-claude/029d9b45-41d6-5ea9-9540-ba9e11bee6ef/scratchpad/fonts/'
A=lambda s: ImageFont.truetype(F+'anton-latin-400-normal.ttf',s)
C=lambda s: ImageFont.truetype(F+'courier-prime-latin-700-normal.ttf',s)
P='/home/claude/webimages/photos/'
W,H=1200,520
random.seed(7)
# concrete-ish dark background with grain
bg=Image.new('L',(W,H),24)
n=Image.effect_noise((W,H),40).filter(ImageFilter.GaussianBlur(0.6))
bg=Image.blend(bg,n,0.18).convert('RGB')
def fit(f,w,h):
    im=Image.open(P+f).convert('RGB');r=max(w/im.width,h/im.height)
    im=im.resize((int(im.width*r)+1,int(im.height*r)+1),Image.LANCZOS)
    x=(im.width-w)//2;y=(im.height-h)//2;return im.crop((x,y,x+w,y+h))
def printcard(img,b=16,bb=46):
    c=Image.new('RGB',(img.width+2*b,img.height+b+bb),(242,239,232));c.paste(img,(b,b));return c
def place(card,ang,cx,cy):
    card=card.convert('RGBA').rotate(ang,Image.BICUBIC,expand=True)
    sh=Image.new('RGBA',card.size,(0,0,0,0));sh.putalpha(card.getchannel('A').point(lambda a:int(a*0.6)))
    sh=Image.composite(Image.new('RGBA',card.size,(0,0,0,255)),sh,sh).filter(ImageFilter.GaussianBlur(10))
    x=cx-card.width//2;y=cy-card.height//2
    bg.paste(sh,(x+8,y+12),sh);bg.paste(card,(x,y),card)
def tape(cx,cy,ang,w=110,h=34):
    t=Image.new('RGBA',(w,h),(225,220,200,170));tt=t.rotate(ang,Image.BICUBIC,expand=True)
    bg.paste(tt,(cx-tt.width//2,cy-tt.height//2),tt)
a=printcard(fit('hdr-prints-500-feet-below.jpg',250,330))
b=printcard(fit('hdr-prints-full-throttle.jpg',330,330))
place(a,4,190,262); place(b,-3,480,258)
tape(190,58,-6); tape(480,62,5)
d=ImageDraw.Draw(bg)
# handwritten-ish captions on print borders (courier)
x0=700
d.text((x0,120),"ORIGINAL",font=A(78),fill=(245,243,236),anchor="ls")
d.text((x0,200),"PHOTOGRAPHY",font=A(78),fill=(245,243,236),anchor="ls")
d.text((x0,250),"shot in the field. no stock.",font=C(26),fill=(170,168,160),anchor="ls")
d.text((x0,284),"pin one up in the shop.",font=C(26),fill=(170,168,160),anchor="ls")
# button
bx,by,bw,bh=x0,330,300,70
d.rectangle((bx,by,bx+bw,by+bh),fill=(245,243,236))
d.text((bx+bw//2,by+bh//2),"SHOP PRINTS  >",font=A(36),fill=(20,20,20),anchor="mm")
wm=Image.open('/root/.claude/uploads/029d9b45-41d6-5ea9-9540-ba9e11bee6ef/7d2a02c6-image.png');wm=wm.crop(wm.getchannel('A').getbbox())
lh=70;wm=wm.resize((int(wm.width*lh/wm.height),lh),Image.LANCZOS);bg.paste(wm,(W-wm.width-36,H-lh-30),wm)
d.text((x0,H-40),"staticmassive.com",font=C(24),fill=(170,168,160),anchor="ls")
bg.save('prints-email-footer-1200x520.jpg',quality=84,optimize=True,progressive=True)
bg.resize((600,260),Image.LANCZOS).save('/tmp/claude-0/-home-claude/029d9b45-41d6-5ea9-9540-ba9e11bee6ef/scratchpad/pr600.png')
