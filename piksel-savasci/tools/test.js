// Oyunu tarayıcı olmadan (jsdom + @napi-rs/canvas) çalıştırır, temel akışları dener ve ekran görüntüsü alır.
// Kullanım:  cd tools && npm install && node test.js
// Çıktı:     tools/out/*.png  ve konsolda her adımın sonucu. Bir "HATA" satırı varsa bir şey bozulmuş demektir.
const fs = require('fs'), path = require('path');
const { JSDOM } = require('jsdom');
const OUT = path.join(__dirname, 'out'); fs.mkdirSync(OUT, { recursive: true });
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8')
  .replace(/<script src=[^>]*><\/script>/, '').replace(/<link[^>]*>/g, '');
const dom = new JSDOM(html.replace(/<script>[\s\S]*<\/script>/, ''),
  { pretendToBeVisual: true, resources: 'usable', runScripts: 'outside-only', url: 'http://localhost/' });
const w = dom.window; w.focus = () => {};
if (!w.CanvasRenderingContext2D) w.CanvasRenderingContext2D = function () {};
let errors = 0;
w.addEventListener('error', e => { errors++; console.log('HATA', e.message, e.error && e.error.stack.split('\n').slice(0, 3).join(' | ')); });
w.eval(fs.readFileSync(require.resolve('phaser/dist/phaser.js'), 'utf8'));
// Oyun kodu: WebGL yerine Canvas çizici kullanılır, oyun nesnesi window.G olarak dışarı alınır
const js = html.match(/<script>([\s\S]*)<\/script>/)[1]
  .replace('type: Phaser.AUTO', 'type: Phaser.CANVAS')
  .replace('const startGame = () => new Phaser.Game(', 'const startGame = () => window.G = new Phaser.Game(');
w.eval(js + ';Object.assign(window,{Controls,PlayerData,ITEMS,WEAPON_CLASS,Shop,AvatarUI,AVATARS,Art});');

const snap = name => fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(w.G.canvas.toDataURL('image/png').split(',')[1], 'base64'));
const wait = ms => new Promise(r => setTimeout(r, ms));
const face = (sc, x, y) => { sc.dir = { x, y }; sc.facing = y > 0 ? 'down' : y < 0 ? 'up' : 'side'; sc.player.setFlipX(x < 0); };

(async () => {
  await wait(2500);
  const sc = w.G.scene.getScene('World'), d = sc.dummy, D = w.document, PD = w.PlayerData;
  console.log('Sahne açıldı. Nesne:', sc.props.length, 'ağaç:', sc.trees.length);

  // 1) Gezinti görüntüleri
  for (const [name, x, y] of [['meydan', 512, 400], ['tuccar', 920, 345], ['ev', 330, 235], ['tarla', 250, 470]]) {
    sc.player.setPosition(x, y); await wait(400); snap('yer_' + name);
  }

  // 2) Her silah: kuklaya vur, isabet sayısını yaz, saldırı anını görüntüle
  d.next = 1e12; // kukla bu sırada saldırmasın
  const ids = Object.keys(w.ITEMS).filter(k => w.WEAPON_CLASS[w.ITEMS[k].type]);
  for (const id of ids) {
    PD.equipped.weapon = id; PD.equipped.shield = null; sc.applyEquip();
    const A = w.WEAPON_CLASS[w.ITEMS[id].type], bow = A.anim === 'shoot';
    sc.player.setPosition(d.x - (bow ? 70 : Math.min(A.reach - 6, 22)), d.y - 1); face(sc, 1, 0);
    const g0 = PD.gold; await wait(350);
    if (bow) { w.Controls.atkHeld = true; await wait(700); snap('silah_' + id); w.Controls.atkHeld = false; await wait(800); }
    else { w.Controls.atkQueued = true; await wait(A.time * 0.55); snap('silah_' + id); await wait(A.time + 400); }
    const hits = (PD.gold - g0) / 2;
    console.log((hits > 0 ? 'tamam ' : 'HATA  ') + id.padEnd(14), A.anim.padEnd(7), 'isabet', hits); if (!hits) errors++;
  }

  // 3) Savunma: kuklaya dönük siper al, kırılana kadar bekle
  PD.equipped.weapon = 'sword_basic'; sc.applyEquip(); d.next = 0;
  sc.player.setPosition(d.x, d.y + 16); face(sc, 0, -1); w.Controls.guard = true;
  for (let i = 0; i < 12 && !sc.stats.guardBroken; i++) { await wait(700); if (Math.hypot(sc.player.x - d.x, sc.player.y - d.y) > 24) sc.player.setPosition(d.x, d.y + 16); }
  console.log((sc.stats.guardBroken ? 'tamam ' : 'HATA  ') + 'siper kırıldı:', sc.stats.guardBroken); if (!sc.stats.guardBroken) errors++;
  w.Controls.guard = false; d.next = 1e12;

  // 4) Tüccar ve avatar pencereleri
  sc.player.setPosition(sc.npc.x, sc.npc.y + 20); await wait(300); sc.tryOpenShop(true);
  console.log((w.Shop.open ? 'tamam ' : 'HATA  ') + 'tüccar açıldı, kart:', D.querySelectorAll('.item').length); w.Shop.hide();
  D.getElementById('btnAvatar').click(); D.querySelectorAll('.avatar')[3].click();
  console.log((PD.avatar === w.AVATARS[3].id ? 'tamam ' : 'HATA  ') + 'avatar seçildi:', PD.avatar); w.AvatarUI.hide();
  PD.avatar = 'farmer'; sc.applyEquip();

  // 5) Silah ikonları tek resimde
  const c = D.createElement('canvas'); c.width = 90 * 6; c.height = 70 * 2; const x = c.getContext('2d');
  x.fillStyle = '#7fa858'; x.fillRect(0, 0, c.width, c.height);
  ids.forEach((id, k) => x.drawImage(sc.textures.get('it_' + id).getSourceImage(), (k % 6) * 90 + 4, Math.floor(k / 6) * 70 + 4));
  fs.writeFileSync(path.join(OUT, 'silah_ikonlari.png'), Buffer.from(c.toDataURL('image/png').split(',')[1], 'base64'));

  console.log(errors ? '\nSONUÇ: ' + errors + ' HATA var.' : '\nSONUÇ: hepsi tamam. Görüntüler tools/out klasöründe.');
  process.exit(errors ? 1 : 0);
})();
