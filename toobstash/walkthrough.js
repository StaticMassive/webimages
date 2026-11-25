/* Toob Stash "How it works" walkthrough: five animated scenes drawn in HTML.
   Replaces the old screen-recording videos so everything stays sharp at any size.
   The page's own script toggles .tbs-on on each .tbs-stage child; this file
   builds a scene into every [data-tbsw] element and plays whichever one is on. */
(function () {
  "use strict";
  var IMG = window.TBSW_IMG || "https://staticmassive.github.io/webimages/toobstash/";
  var W = 1280, H = 680;
  var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var CSS = [
    ".tbs-stage>.tbsw,.tbsw{position:relative;width:min(100%,calc((100vh - 200px) * 1280 / 680));max-height:none;height:auto;aspect-ratio:1280/680;overflow:hidden;border-radius:12px;border:1px solid #262a33;background:#111317;font-family:var(--body,Inter,system-ui,-apple-system,'Segoe UI',sans-serif);color:#e8ecf3;-webkit-font-smoothing:antialiased;user-select:none}",
    ".tbsw *{box-sizing:border-box}",
    ".tbsw-app{position:absolute;left:0;top:0;width:1280px;height:680px;transform-origin:0 0;letter-spacing:0;line-height:1.2;font-size:15px}",
    ".tbsw-app [data-t]{transition:left .7s cubic-bezier(.45,.05,.3,1),top .7s cubic-bezier(.45,.05,.3,1),width .45s ease,opacity .35s,transform .35s,background .2s,border-color .2s,color .2s,box-shadow .45s,filter .45s}",
    ".tbsw-ff [data-t],.tbsw-ff *{transition:none!important;animation:none!important}",
    ".tbsw-p{position:absolute;background:#1b1e25;border-radius:14px}",
    ".tbsw-h{position:absolute;font-weight:700;font-size:17px;color:#e8ecf3}",
    ".tbsw-dim{color:#8a93a3}",
    /* top bar */
    ".tbsw-logo{position:absolute;left:20px;top:20px;width:26px;height:26px;border-radius:7px;background:#e8ecf3}",
    ".tbsw-name{position:absolute;left:58px;top:20px;font-weight:800;font-size:19px;letter-spacing:-.01em}",
    ".tbsw-name i{font-style:normal;color:#5b8cff}",
    ".tbsw-url{position:absolute;left:380px;top:16px;width:460px;height:36px;border-radius:18px;border:1px solid #363c4a;background:#12151a;padding:0 16px;display:flex;align-items:center;font-size:16px;color:#7d8696;white-space:nowrap;overflow:hidden}",
    ".tbsw-url.on{border-color:#5b8cff;color:#e8ecf3}",
    ".tbsw-btn{position:absolute;display:flex;align-items:center;justify-content:center;border-radius:9px;font-weight:600;font-size:16px;background:#262b35;color:#c6ccd6}",
    ".tbsw-btn.blue{background:#5b8cff;color:#0d1220}",
    ".tbsw-btn.red{background:#c9473f;color:#fff}",
    ".tbsw-btn.down{transform:scale(.95)}",
    ".tbsw-q{position:absolute;left:1212px;top:18px;width:32px;height:32px;border-radius:50%;background:#262b35;color:#c6ccd6;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px}",
    /* preview */
    ".tbsw-pic{position:absolute;left:300px;top:92px;width:600px;height:276px;border-radius:6px;overflow:hidden;background:#000}",
    ".tbsw-pic img{position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;opacity:0}",
    ".tbsw-pic img.on{opacity:1;animation:tbsw-kb 9s linear infinite alternate}",
    "@keyframes tbsw-kb{from{transform:scale(1)}to{transform:scale(1.06) translate(-1%,1%)}}",
    ".tbsw-vig{position:absolute;inset:0;box-shadow:inset 0 0 0 0 rgba(0,0,0,0);pointer-events:none}",
    ".tbsw-empty{position:absolute;left:300px;top:92px;width:600px;height:276px;display:flex;align-items:center;justify-content:center;color:#5d6575;font-size:16px}",
    ".tbsw-dots{position:absolute;left:556px;top:380px;display:flex;align-items:center;gap:22px}",
    ".tbsw-dots b{width:12px;height:12px;border-radius:3px;background:#3a404c;display:block}",
    ".tbsw-dots b.big{width:28px;height:28px;border-radius:50%;background:#5b8cff}",
    ".tbsw-sel{position:absolute;border:2px solid #5b8cff;pointer-events:none;opacity:0}",
    ".tbsw-sel i{position:absolute;width:12px;height:12px;background:#e8ecf3;border:2px solid #5b8cff;border-radius:2px}",
    ".tbsw-sel i:nth-child(1){left:-7px;top:-7px}.tbsw-sel i:nth-child(2){right:-7px;top:-7px}.tbsw-sel i:nth-child(3){left:-7px;bottom:-7px}.tbsw-sel i:nth-child(4){right:-7px;bottom:-7px}",
    ".tbsw-logo-ov{position:absolute;left:770px;top:110px;width:112px;height:56px;background:#eef1f6;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;letter-spacing:.12em;color:#14171c;opacity:0}",
    ".tbsw-title{position:absolute;left:300px;top:196px;width:600px;text-align:center;font-weight:800;font-size:40px;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.55);opacity:0;white-space:nowrap}",
    ".tbsw-title span{border-right:3px solid #5b8cff;padding-right:2px}",
    /* downloads */
    ".tbsw-dl{position:absolute;left:30px;width:224px;height:52px;display:flex;gap:12px;align-items:center;opacity:0}",
    ".tbsw-dl img,.tbsw-dl .w{width:64px;height:40px;border-radius:5px;object-fit:cover;flex:none;background:#eef1f6;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;letter-spacing:.1em;color:#14171c}",
    ".tbsw-dl b{display:block;font-size:16px;font-weight:600}",
    ".tbsw-dl small{display:block;font-size:13px;color:#8a93a3;margin-top:3px}",
    ".tbsw-dl small.go{color:#5b8cff}",
    ".tbsw-bar{position:absolute;left:30px;width:224px;height:3px;border-radius:2px;background:#2a2f3a;overflow:hidden;opacity:0}",
    ".tbsw-bar i{display:block;height:100%;width:0;background:#5b8cff}",
    /* right panel */
    ".tbsw-tabs{position:absolute;left:948px;top:88px;width:304px;height:36px;border-radius:9px;display:flex}",
    ".tbsw-tabs span{flex:1;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:600;color:#8a93a3;border-radius:8px}",
    ".tbsw-tabs span.on{background:#2a303c;color:#e8ecf3}",
    ".tbsw-pane{position:absolute;left:952px;top:144px;width:296px;opacity:0}",
    ".tbsw-pane.on{opacity:1}",
    ".tbsw-row{position:relative;height:44px;display:flex;align-items:center;font-size:16px;color:#c6ccd6}",
    ".tbsw-row .v{position:absolute;right:0;background:#12151a;border-radius:7px;padding:7px 14px;color:#e8ecf3;font-weight:600}",
    ".tbsw-sl{position:absolute;left:150px;right:4px;top:21px;height:3px;border-radius:2px;background:#323846}",
    ".tbsw-sl i{position:absolute;top:-8px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:#e8ecf3}",
    ".tbsw-chips{display:flex;gap:8px}",
    ".tbsw-chips span{padding:7px 12px;border-radius:7px;background:#12151a;color:#c6ccd6;font-size:14px;font-weight:600}",
    ".tbsw-chips span.on{background:#5b8cff;color:#0d1220}",
    ".tbsw-xbtn{position:absolute;left:952px;top:364px;width:296px;height:40px;border-radius:9px;background:#c9473f;color:#fff;font-weight:700;font-size:16px;display:flex;align-items:center;justify-content:center;overflow:hidden;opacity:0}",
    ".tbsw-xbtn i{position:absolute;left:0;top:0;bottom:0;width:0;background:rgba(255,255,255,.22)}",
    ".tbsw-xbtn span{position:relative}",
    ".tbsw-xbtn.done{background:#2f8f5b}",
    /* timeline */
    ".tbsw-tools{position:absolute;left:240px;top:442px;display:flex;gap:6px}",
    ".tbsw-tools span{width:32px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;color:#c6ccd6;font-weight:800;font-size:15px}",
    ".tbsw-tools span.on{background:#2a303c;color:#fff}",
    ".tbsw-tools svg{width:16px;height:16px;fill:currentColor}",
    ".tbsw-ticks{position:absolute;left:120px;top:490px;width:1132px;height:10px;background:repeating-linear-gradient(90deg,#4a5160 0 2px,transparent 2px 80px)}",
    ".tbsw-trk{position:absolute;left:120px;width:1132px;height:38px;border-radius:5px;background:#15181e}",
    ".tbsw-lab{position:absolute;left:40px;font-weight:700;font-size:17px}",
    ".tbsw-clip{position:absolute;height:34px;border-radius:5px;background:#3c4a8c;border:1px solid #5468c2;font-size:14px;font-weight:600;color:#e8ecf3;display:flex;align-items:center;padding:0 10px;white-space:nowrap;overflow:hidden;opacity:0}",
    ".tbsw-clip.a{background:#25664a;border-color:#2f8a61}",
    ".tbsw-clip.p{background:#5a4a9c;border-color:#7a66cc}",
    ".tbsw-clip.sel{box-shadow:0 0 0 2px #e8ecf3}",
    ".tbsw-clip.edge{box-shadow:inset -4px 0 0 #e8ecf3}",
    ".tbsw-ph{position:absolute;top:486px;width:2px;height:166px;background:#5b8cff;margin-left:-1px}",
    ".tbsw-ph:before{content:'';position:absolute;left:-6px;top:-2px;border:7px solid transparent;border-top:9px solid #5b8cff}",
    ".tbsw-mk{position:absolute;top:484px;width:10px;height:20px;border:3px solid #e8ecf3;opacity:0}",
    ".tbsw-mk.in{border-right:0;margin-left:-1px}.tbsw-mk.out{border-left:0;margin-left:-9px}",
    ".tbsw-shade{position:absolute;top:506px;height:144px;background:rgba(0,0,0,.45);opacity:0}",
    ".tbsw-menu{position:absolute;width:220px;padding:6px;border-radius:10px;background:#0f1115;border:1px solid #2c313c;box-shadow:0 12px 30px rgba(0,0,0,.5);opacity:0;transform:scale(.96);transform-origin:0 0}",
    ".tbsw-menu div{display:flex;justify-content:space-between;padding:7px 10px;font-size:14.5px;border-radius:6px;color:#dfe3ea}",
    ".tbsw-menu div em{font-style:normal;color:#7d8696}",
    ".tbsw-menu div.hi{background:#2a303c}",
    ".tbsw-menu hr{border:0;border-top:1px solid #2a2f3a;margin:4px 6px}",
    ".tbsw-split{position:absolute;top:556px;width:2px;height:90px;background:#fff;opacity:0}",
    /* cursor, ghost, keycap */
    ".tbsw-cur{position:absolute;width:26px;height:26px;margin:-3px 0 0 -5px;z-index:9;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))}",
    ".tbsw-cur svg{width:100%;height:100%;display:block}",
    ".tbsw-cur.down{transform:scale(.86)}",
    ".tbsw-rip{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:2px solid #5b8cff;opacity:0;z-index:8;pointer-events:none}",
    ".tbsw-rip.go{animation:tbsw-rip .45s ease-out}",
    "@keyframes tbsw-rip{from{opacity:.9;transform:scale(.3)}to{opacity:0;transform:scale(1.4)}}",
    ".tbsw-ghost{position:absolute;z-index:8;padding:6px 10px;border-radius:6px;background:#3c4a8c;border:1px solid #5468c2;font-size:14px;font-weight:600;opacity:0;margin:10px 0 0 12px;white-space:nowrap}",
    ".tbsw-ghost.w{background:#eef1f6;color:#14171c;border-color:#c9cfda}",
    ".tbsw-key{position:absolute;z-index:9;padding:6px 12px;border-radius:8px;background:#e8ecf3;color:#14171c;font-weight:800;font-size:18px;box-shadow:0 3px 0 #9aa3b2;opacity:0;transform:translateY(6px)}",
    ".tbsw-key.on{opacity:1;transform:none}"
  ].join("\n");

  function frame(o) {
    o = o || {};
    var arrow = '<svg viewBox="0 0 24 24"><path d="M5 3l14 9-6.2 1.4L16 20l-2.6 1.2-3.2-6.6L5 18z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg>';
    var blade = '<svg viewBox="0 0 24 24"><path d="M3 21l8-8 2 2-8 8zM13 3l8 8-6 2-4-4z"/></svg>';
    return '' +
      '<div class="tbsw-logo"></div><div class="tbsw-name">Toob Stash<i>.</i></div>' +
      '<div class="tbsw-url" data-t data-k="url">Paste a video link</div>' +
      '<div class="tbsw-btn" data-t data-k="look" style="left:852px;top:16px;width:108px;height:36px">Look up</div>' +
      '<div class="tbsw-q">?</div>' +
      '<div class="tbsw-p" style="left:16px;top:76px;width:248px;height:340px"></div><div class="tbsw-h" style="left:32px;top:92px">Downloads</div>' +
      '<div class="tbsw-p" style="left:280px;top:76px;width:640px;height:340px"></div>' +
      '<div class="tbsw-empty" data-t data-k="empty">' + (o.empty || "") + '</div>' +
      '<div class="tbsw-pic" data-k="pic"><img data-t data-k="img1" src="' + IMG + 'wt-tower.webp" alt=""><img data-t data-k="img2" src="' + IMG + 'wt-water.webp" alt=""><img data-t data-k="img3" src="' + IMG + 'wt-horizon.webp" alt=""><div class="tbsw-vig" data-t data-k="vig"></div></div>' +
      '<div class="tbsw-logo-ov" data-t data-k="logo">LOGO</div>' +
      '<div class="tbsw-title" data-t data-k="title"><span data-k="ttext">My title</span></div>' +
      '<div class="tbsw-sel" data-t data-k="sel"><i></i><i></i><i></i><i></i></div>' +
      '<div class="tbsw-dots"><b></b><b class="big"></b><b></b></div>' +
      '<div class="tbsw-p" style="left:936px;top:76px;width:328px;height:340px"></div>' +
      (o.right || "") +
      '<div class="tbsw-p" style="left:16px;top:432px;width:1248px;height:232px"></div><div class="tbsw-h" style="left:32px;top:447px">Timeline</div>' +
      '<div class="tbsw-tools"><span class="on" data-t data-k="tsel">' + arrow.replace('fill="#fff" stroke="#111" stroke-width="1.3"', 'fill="currentColor"') + '</span><span data-t data-k="tblade">' + blade + '</span><span><svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="6" rx="2"/></svg></span><span>T</span></div>' +
      '<div class="tbsw-ticks"></div>' +
      '<div class="tbsw-lab" style="left:40px;top:518px">V2</div><div class="tbsw-trk" style="top:510px"></div>' +
      '<div class="tbsw-lab" style="left:40px;top:566px">V1</div><div class="tbsw-trk" style="top:558px"></div>' +
      '<div class="tbsw-lab" style="left:40px;top:614px">A1</div><div class="tbsw-trk" style="top:606px"></div>' +
      '<div class="tbsw-shade" data-t data-k="shadeL" style="left:120px;width:0"></div><div class="tbsw-shade" data-t data-k="shadeR" style="left:1252px;width:0"></div>' +
      (o.clips || "") +
      '<div class="tbsw-split" data-t data-k="split"></div>' +
      '<div class="tbsw-mk in" data-t data-k="mkin"></div><div class="tbsw-mk out" data-t data-k="mkout"></div>' +
      '<div class="tbsw-ph" data-t data-k="ph" style="left:' + (o.ph || 150) + 'px"></div>' +
      (o.extra || "") +
      '<div class="tbsw-ghost" data-t data-k="ghost"></div>' +
      '<div class="tbsw-key" data-t data-k="key"></div>' +
      '<div class="tbsw-rip" data-k="rip"></div>' +
      '<div class="tbsw-cur" data-t data-k="cur" style="left:' + (o.cx || 640) + 'px;top:' + (o.cy || 260) + 'px">' + arrow + '</div>';
  }
  function slider(label, pos, k) {
    return '<div class="tbsw-row">' + label + '<div class="tbsw-sl"><i data-t data-k="' + k + '" style="left:' + pos + '%"></i></div></div>';
  }
  function tabs(on) {
    return '<div class="tbsw-tabs">' + ["Inspector", "Effects", "Export"].map(function (t) { return '<span data-t data-k="tab' + t + '"' + (t === on ? ' class="on"' : "") + '>' + t + '</span>'; }).join("") + '</div>';
  }
  var inspector = '<div class="tbsw-pane on" data-t data-k="pInspector">' + slider("Zoom", 30, "zoom") + slider("Rotation", 50, "rot") + slider("Opacity", 100, "opa") + '</div>';
  function clip(k, cls, left, top, width, label, show) {
    return '<div class="tbsw-clip ' + cls + '" data-t data-k="' + k + '" style="left:' + left + 'px;top:' + (top + 2) + 'px;width:' + width + 'px' + (show ? ';opacity:1' : '') + '">' + label + '</div>';
  }
  var dlSaved = '<div class="tbsw-dl" style="top:120px;opacity:1"><img src="' + IMG + 'wt-tower-thumb.webp" alt=""><div><b>Field day</b><small>Saved</small></div></div>';
  var dlLogo = '<div class="tbsw-dl" style="top:180px;opacity:1"><div class="w">LOGO</div><div><b>logo.png</b><small>Picture</small></div></div>';

  /* Each scene: html() builds the start state; steps run in order, [delayFromPrevious, action]. */
  var SCENES = [
    { /* 1 Get a video */
      html: function () {
        return frame({
          empty: "",
          right: '<div class="tbsw-h" style="left:952px;top:92px">Download settings</div>' +
            '<div class="tbsw-pane" data-t data-k="pDl" style="top:132px"><div class="tbsw-row">Save as<span class="v">Video</span></div><div class="tbsw-row" style="margin-top:8px">Quality<span class="v">Best</span></div></div>' +
            '<div class="tbsw-btn red" data-t data-k="dlbtn" style="left:952px;top:364px;width:296px;height:40px;opacity:.35">Download</div>',
          extra: '<div class="tbsw-dl" data-t data-k="item" style="top:120px"><img src="' + IMG + 'wt-tower-thumb.webp" alt=""><div><b>Field day</b><small class="go" data-k="itxt">Downloading 0%</small></div></div><div class="tbsw-bar" data-t data-k="bar" style="top:180px"><i data-k="barI"></i></div>',
          cx: 640, cy: 250
        });
      },
      steps: function (a) {
        return [
          [500, function () { a.move(560, 34); }],
          [800, function () { a.click(); a.cls("url", "on", true); }],
          [400, function () { a.key("⌘ V"); }],
          [350, function () { a.text("url", "https://video.example/watch"); }],
          [700, function () { a.key(); a.move(906, 34); }],
          [800, function () { a.click(); a.press("look"); a.cls("look", "blue", true); }],
          [500, function () { a.show("img1"); a.show("pDl"); a.css("dlbtn", "opacity", "1"); a.cls("look", "blue", false); }],
          [900, function () { a.move(1100, 384); }],
          [800, function () { a.click(); a.press("dlbtn"); }],
          [350, function () { a.css("item", "opacity", "1"); a.css("bar", "opacity", "1"); a.count("itxt", "barI", 2200); }],
          [2400, function () { a.text("itxt", "Saved · 24.6 MB"); a.cls("itxt", "go", false); a.css("bar", "opacity", "0"); a.move(700, 300); }],
          [3000, null]
        ];
      }
    },
    { /* 2 Build your timeline */
      html: function () {
        return frame({
          empty: "Drag a clip here",
          right: tabs("Inspector") + inspector,
          extra: dlSaved + dlLogo,
          clips: clip("v1", "", 122, 558, 0, "Field day") + clip("a1", "a", 122, 606, 0, "♪ Field day") + clip("v2", "p", 122, 510, 0, "logo.png"),
          cx: 640, cy: 300
        });
      },
      steps: function (a) {
        return [
          [500, function () { a.move(150, 146); }],
          [800, function () { a.down(); a.ghost("Field day", false, 150, 146); }],
          [300, function () { a.move(250, 577); a.moveGhost(250, 577); }],
          [900, function () { a.up(); a.hide("ghost"); a.show("v1"); a.css("v1", "width", "620px"); a.show("a1"); a.css("a1", "width", "620px"); a.hide("empty"); a.show("img1"); }],
          [900, function () { a.move(150, 206); }],
          [800, function () { a.down(); a.ghost("logo.png", true, 150, 206); }],
          [300, function () { a.move(820, 140); a.moveGhost(820, 140); }],
          [900, function () { a.up(); a.hide("ghost"); a.show("logo"); a.box("sel", 770, 110, 112, 56); a.show("sel"); a.show("v2"); a.css("v2", "width", "240px"); }],
          [900, function () { a.move(700, 300); }],
          [2200, null]
        ];
      }
    },
    { /* 3 Trim, cut and move */
      html: function () {
        return frame({
          right: tabs("Inspector") + inspector,
          extra: dlSaved + dlLogo +
            '<div class="tbsw-menu" data-t data-k="menu" style="left:306px;top:334px"><div>Cut<em>⌘X</em></div><div>Copy<em>⌘C</em></div><div class="hi">Paste at playhead<em>⌘V</em></div><div>Duplicate<em>⌘D</em></div><hr><div>Split here</div><div>Detach audio</div><div>Copy look</div></div>',
          clips: clip("v1", "", 122, 558, 720, "Field day", true) + clip("v1b", "", 470, 558, 0, "Field day") + clip("a1", "a", 122, 606, 720, "♪ Field day", true) + clip("a1b", "a", 470, 606, 0, "♪ Field day") + clip("v2", "p", 122, 510, 240, "logo.png", true),
          cx: 640, cy: 300, ph: 150
        });
      },
      steps: function (a) {
        return [
          [400, function () { a.show("img3"); a.show("logo"); }],
          [200, function () { a.move(840, 577); }],
          [800, function () { a.cls("v1", "edge", true); a.down(); }],
          [250, function () { a.move(700, 577); a.css("v1", "width", "580px"); a.css("a1", "width", "580px"); }],
          [800, function () { a.up(); a.cls("v1", "edge", false); a.move(292, 457); }],
          [800, function () { a.click(); a.cls("tblade", "on", true); a.cls("tsel", "on", false); }],
          [500, function () { a.move(470, 577); }],
          [800, function () {
            a.click(); a.box("split", 469, 556, 2, 90); a.show("split");
            a.css("v1", "width", "348px"); a.css("a1", "width", "348px");
            a.show("v1b"); a.css("v1b", "width", "232px"); a.show("a1b"); a.css("a1b", "width", "232px");
          }],
          [500, function () { a.hide("split"); a.move(256, 457); }],
          [700, function () { a.click(); a.cls("tsel", "on", true); a.cls("tblade", "on", false); }],
          [400, function () { a.move(560, 577); }],
          [700, function () { a.down(); a.cls("v1b", "sel", true); }],
          [250, function () { a.move(680, 577); a.css("v1b", "left", "590px"); a.css("a1b", "left", "590px"); }],
          [800, function () { a.up(); a.cls("v1b", "sel", false); a.move(300, 577); }],
          [800, function () { a.click(); a.cls("v1", "sel", true); a.show("menu"); a.css("menu", "transform", "none"); }],
          [2600, null]
        ];
      }
    },
    { /* 4 Make it look right */
      html: function () {
        return frame({
          right: tabs("Inspector") + inspector +
            '<div class="tbsw-pane" data-t data-k="pEffects">' + slider("Colour", 50, "col") + slider("Blur", 0, "blur") + slider("Sharpen", 0, "sharp") + slider("Vignette", 0, "vigk") + '</div>',
          extra: dlSaved + dlLogo,
          clips: clip("v1", "", 122, 558, 720, "Field day", true) + clip("a1", "a", 122, 606, 720, "♪ Field day", true) + clip("v2", "p", 122, 510, 240, "logo.png", true) + clip("v2t", "p", 380, 510, 0, "T My title"),
          cx: 640, cy: 300
        });
      },
      steps: function (a) {
        return [
          [300, function () { a.show("img1"); a.show("logo"); }],
          [300, function () { a.move(560, 250); }],
          [800, function () { a.click(); a.box("sel", 300, 92, 600, 276); a.show("sel"); }],
          [500, function () { a.move(900, 368); }],
          [800, function () { a.down(); }],
          [200, function () { a.move(840, 340); a.css("pic", "transform", "scale(.9)"); a.box("sel", 300, 92, 540, 248); a.css("zoom", "left", "18%"); }],
          [900, function () { a.up(); a.hide("sel"); a.move(1100, 106); }],
          [800, function () { a.click(); a.cls("tabInspector", "on", false); a.cls("tabEffects", "on", true); a.hide("pInspector"); a.show("pEffects"); }],
          [500, function () { a.move(1173, 166); }],
          [700, function () { a.down(); }],
          [200, function () { a.move(1216, 166); a.css("col", "left", "80%"); a.css("img1", "filter", "saturate(1.45) contrast(1.06)"); }],
          [800, function () { a.up(); a.move(952 + 150 + 0, 298); }],
          [700, function () { a.down(); }],
          [200, function () { a.move(1180, 298); a.css("vigk", "left", "55%"); a.css("vig", "box-shadow", "inset 0 0 90px 30px rgba(0,0,0,.7)"); }],
          [800, function () { a.up(); a.move(640, 300); a.key("T"); }],
          [600, function () { a.key(); a.show("title"); a.show("v2t"); a.css("v2t", "width", "200px"); }],
          [700, function () { a.type("ttext", "Golden hour", 900); }],
          [2400, null]
        ];
      },
      prep: function (a) { a.css("pic", "transform-origin", "0 0"); a.el("pic").setAttribute("data-t", ""); }
    },
    { /* 5 Export */
      html: function () {
        return frame({
          right: tabs("Inspector") + inspector +
            '<div class="tbsw-pane" data-t data-k="pExport"><div class="tbsw-row">Format</div><div class="tbsw-chips"><span class="on" data-t data-k="cMP4">MP4</span><span>MOV</span><span>M4A</span><span>MP3</span></div><div class="tbsw-row" style="margin-top:10px">Size<span class="v">16:9</span></div><div class="tbsw-row">Range<span class="v" data-k="range">Whole timeline</span></div></div>' +
            '<div class="tbsw-xbtn" data-t data-k="xbtn"><i data-t data-k="xfill"></i><span data-k="xtxt">Export</span></div>',
          extra: dlSaved + dlLogo,
          clips: clip("v1", "", 122, 558, 900, "Field day", true) + clip("a1", "a", 122, 606, 900, "♪ Field day", true) + clip("v2", "p", 122, 510, 240, "logo.png", true),
          cx: 640, cy: 300, ph: 150
        });
      },
      steps: function (a) {
        return [
          [300, function () { a.show("img1"); a.show("logo"); a.css("ph", "transition", "left 1.2s linear"); }],
          [300, function () { a.css("ph", "left", "330px"); }],
          [700, function () { a.hide("img1"); a.show("img2"); }],
          [600, function () { a.key("I"); a.box("mkin", 330, 484, 10, null); a.show("mkin"); a.css("shadeL", "width", "210px"); a.show("shadeL"); }],
          [700, function () { a.key(); a.css("ph", "left", "860px"); }],
          [700, function () { a.hide("img2"); a.show("img3"); }],
          [600, function () { a.key("O"); a.box("mkout", 860, 484, 10, null); a.show("mkout"); a.css("shadeR", "left", "860px"); a.css("shadeR", "width", "392px"); a.show("shadeR"); }],
          [700, function () { a.key(); a.move(1200, 106); }],
          [800, function () { a.click(); a.cls("tabInspector", "on", false); a.cls("tabExport", "on", true); a.hide("pInspector"); a.show("pExport"); a.show("xbtn"); a.text("range", "In to out · 1:06"); }],
          [600, function () { a.move(978, 194); }],
          [700, function () { a.click(); }],
          [400, function () { a.move(1100, 384); }],
          [800, function () { a.click(); a.press("xbtn"); a.text("xtxt", "Exporting…"); a.css("xfill", "transition", "width 2s linear"); a.css("xfill", "width", "100%"); }],
          [2100, function () { a.cls("xbtn", "done", true); a.css("xfill", "opacity", "0"); a.text("xtxt", "Saved to Downloads ✓"); a.move(760, 300); }],
          [2400, null]
        ];
      }
    }
  ];

  function Player(root, idx) {
    this.root = root; this.idx = idx; this.timers = []; this.playing = false;
    this.app = document.createElement("div"); this.app.className = "tbsw-app";
    root.appendChild(this.app);
    this.reset();
  }
  Player.prototype.reset = function () {
    this.app.innerHTML = SCENES[this.idx].html();
    this.k = {};
    var els = this.app.querySelectorAll("[data-k]");
    for (var i = 0; i < els.length; i++) this.k[els[i].getAttribute("data-k")] = els[i];
    if (SCENES[this.idx].prep) SCENES[this.idx].prep(this.api());
  };
  Player.prototype.api = function () {
    var p = this, k = this.k;
    var a = {
      el: function (n) { return k[n]; },
      css: function (n, prop, v) { if (k[n]) k[n].style.setProperty(prop, v); },
      show: function (n) { if (!k[n]) return; if (k[n].tagName === "IMG") k[n].classList.add("on"); else k[n].style.opacity = "1"; },
      hide: function (n) { if (!k[n]) return; if (k[n].tagName === "IMG") k[n].classList.remove("on"); else k[n].style.opacity = "0"; },
      cls: function (n, c, on) { if (k[n]) k[n].classList.toggle(c, on); },
      text: function (n, t) { if (k[n]) k[n].textContent = t; },
      box: function (n, x, y, w, h) { var s = k[n].style; s.left = x + "px"; s.top = y + "px"; if (w != null) s.width = w + "px"; if (h != null) s.height = h + "px"; },
      move: function (x, y) { k.cur.style.left = x + "px"; k.cur.style.top = y + "px"; },
      moveGhost: function (x, y) { k.ghost.style.left = x + "px"; k.ghost.style.top = y + "px"; },
      down: function () { k.cur.classList.add("down"); },
      up: function () { k.cur.classList.remove("down"); },
      click: function () {
        k.cur.classList.add("down"); a.ripple();
        p.later(function () { k.cur.classList.remove("down"); }, 160);
      },
      press: function (n) { k[n].classList.add("down"); p.later(function () { k[n].classList.remove("down"); }, 180); },
      ripple: function () {
        var r = k.rip; r.style.left = k.cur.style.left; r.style.top = k.cur.style.top;
        r.classList.remove("go"); void r.offsetWidth; r.classList.add("go");
      },
      ghost: function (t, white, x, y) {
        var g = k.ghost; g.textContent = t; g.classList.toggle("w", !!white);
        g.style.transition = "none"; g.style.left = x + "px"; g.style.top = y + "px"; void g.offsetWidth; g.style.transition = ""; g.style.opacity = "1";
      },
      key: function (t) {
        if (!t) { k.key.classList.remove("on"); return; }
        k.key.textContent = t; k.key.style.left = (parseFloat(k.cur.style.left) + 26) + "px"; k.key.style.top = (parseFloat(k.cur.style.top) - 40) + "px"; k.key.classList.add("on");
      },
      count: function (txt, bar, ms) {
        var t0 = Date.now();
        k[bar].style.transition = "width " + ms + "ms linear"; void k[bar].offsetWidth; k[bar].style.width = "100%";
        var tick = function () {
          var f = Math.min(1, (Date.now() - t0) / ms);
          k[txt].textContent = "Downloading " + Math.round(f * 100) + "%";
          if (f < 1) p.later(tick, 90);
        };
        tick();
      },
      type: function (n, t, ms) {
        var i = 0, step = Math.max(30, ms / t.length);
        k[n].textContent = "";
        var go = function () { i++; k[n].textContent = t.slice(0, i); if (i < t.length) p.later(go, step); };
        go();
      }
    };
    return a;
  };
  Player.prototype.later = function (fn, ms) { this.timers.push(setTimeout(fn, ms)); };
  Player.prototype.stop = function () {
    this.timers.forEach(clearTimeout); this.timers = []; this.playing = false;
  };
  Player.prototype.play = function () {
    if (this.playing) return;
    this.stop(); this.playing = true; this.reset();
    var p = this, steps = SCENES[this.idx].steps(this.api());
    if (RM) {
      this.root.classList.add("tbsw-ff");
      var fast = this.api(); fast.click = function () {}; fast.press = function () {};
      fast.count = function (txt, bar) { p.k[bar].style.width = "100%"; };
      fast.type = function (n, t) { p.k[n].textContent = t; };
      steps = SCENES[this.idx].steps(fast);
      steps.forEach(function (s) { if (s[1]) s[1](); });
      p.k.key && p.k.key.classList.remove("on");
      return;
    }
    var t = 0;
    steps.forEach(function (s) {
      t += s[0];
      if (s[1]) p.later(s[1], t);
    });
    this.later(function () { p.playing = false; p.play(); }, t);
  };

  function fit(root, app) {
    var w = root.clientWidth;
    if (w) app.style.transform = "scale(" + (w / W) + ")";
  }

  function init() {
    var hosts = document.querySelectorAll("[data-tbsw]");
    if (!hosts.length) return;
    if (!document.getElementById("tbsw-css")) {
      var st = document.createElement("style"); st.id = "tbsw-css"; st.textContent = CSS; document.head.appendChild(st);
    }
    var players = [], visible = false;
    [].forEach.call(hosts, function (h) {
      var idx = (parseInt(h.getAttribute("data-tbsw"), 10) || 1) - 1;
      if (!SCENES[idx] || h.__tbsw) return;
      h.classList.add("tbsw");
      var pl = new Player(h, idx); h.__tbsw = pl; players.push(pl);
      fit(h, pl.app);
      if ("ResizeObserver" in window) new ResizeObserver(function () { fit(h, pl.app); }).observe(h);
      else window.addEventListener("resize", function () { fit(h, pl.app); });
    });
    function sync() {
      players.forEach(function (pl) {
        var on = visible && !document.hidden && pl.root.classList.contains("tbs-on");
        if (on && !pl.playing) pl.play();
        else if (!on && pl.playing) { pl.stop(); pl.reset(); }
      });
    }
    var mo = new MutationObserver(sync);
    players.forEach(function (pl) { mo.observe(pl.root, { attributes: true, attributeFilter: ["class"] }); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; sync(); }).observe(players[0].root.parentNode);
    } else { visible = true; }
    document.addEventListener("visibilitychange", sync);
    sync();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
