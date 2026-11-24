# Piksel Savaşçı — proje rehberi

Bu dosya, projeye yeni başlayan Claude için yazıldı. Oyun buraya kadar claude.ai sohbetinde, telefondan
geliştirildi. Aşağıdakiler o sohbetin özeti: oyun ne, kod nasıl kurulu, kullanıcı nasıl çalışıyor, sırada ne var.

## Kullanıcı ve çalışma şekli

- Kullanıcı **Türkçe** konuşur. Her zaman Türkçe cevap ver. Koddaki yorumlar ve oyundaki tüm yazılar da Türkçe.
- **Programcı değil.** Kod göstermeni değil, sonucu istiyor. Ne yaptığını oyuncu gözüyle anlat: "şu tuşa basınca şu oluyor".
- Çoğunlukla **telefondan** çalışır ve sesle yazdırır. Mesajları dağınık olabilir, bazen ilk/ikinci fotoğrafı
  karıştırır. Niyetini bağlamdan çıkar, emin olamadığın yerde nasıl anladığını cevabında açıkça söyle.
- İsteklerini **referans fotoğrafla** anlatır ("şu fotoğraftaki gibi olsun"). Referanslar `referans/` klasöründe.
- **Adım adım** ilerler. "Sen daha bunları ekleme" dediği şeyleri ekleme. Uzun vadeli planı not al, ama sadece
  o an istenen şeyi yap. İstenmeyen yeni mekanik ekleme.
- Vermesi gereken bir kararı sen verdiysen (fiyat, başlangıç silahı, bir şeyi silmek yerine taşımak gibi)
  cevabında bunu ayrıca belirt ki istemezse geri aldırabilsin.
- **Doğrula, sonra "oldu" de.** Her değişiklikten sonra `tools/test.js` çalıştır ve gerekiyorsa ekran görüntüsüne
  bak. Göremediğin şeyi (dokunmatik his, telefondaki yazı tipi, gerçek cihazda akıcılık) göremediğini söyle.
- **Telif konusunda dürüst ol.** Referansların çoğu satılık çizim paketlerinin önizlemesi. Onları kopyalama,
  aynı tarzda özgün çizim yap ve "birebir aynısı" istendiğinde nedenini açıkla: kodla piksel piksel kopya
  yapılamaz, yapılsa bile Play Store'da telif şikâyetiyle oyun kaldırılabilir. Birebir için tek yol paketi
  satın alıp orijinal PNG'leri projeye koymak. Kullanıcı bu konuda birkaç kez ısrar etti, sabırla ama net anlat.

## Oyun nedir

Yukarıdan bakışlı (kuş bakışı) 2D piksel aksiyon-RPG. Hedef platform Android / Play Store, yatay ekran.

**Uzun vadeli vizyon** (kullanıcının anlattığı, çoğu henüz yok):

- Karakter ortaçağda bir **köylü** olarak başlar; tarım ve balıkçılık yapabilir, düşmanlarla savaşır.
- Zamanla **asker** olur, yeteneklerini geliştirir.
- Mobları kestikçe **XP** kazanır. XP ile **silahlar seviye atlar** (1-8) ve her seviyede görünüşleri değişir.
- **Element taşları** bulunur ve zırha takılır. Taş zırhın rengini değiştirir ve yeni özellik kazandırır.
- **Farklı dünyalar** olur, meydandaki portaldan geçilir.
- Yayından sonra **online**: PvP, sıralama, kurucuların başlattığı turnuvalar.

## Şu an oyunda olanlar

- **Dünya:** 64x44 karoluk tek harita ("Dünya 1 / Yeşil Vadi"): çimen, toprak yollar, taş meydan, iki gölet,
  çitli tarla, kamp alanı, üç ortaçağ evi, kuyu, fenerler, oturaklar, yapraklı ağaçlar ve çamlar, kayalar,
  kütükler, çiçekler, kelebekler. Meydanın ortasında mor portal (henüz işlevsiz).
- **Karakter:** 7 seçilebilir köylü avatarı (sağ üstteki "Karakter" tuşu). 3 yön (ön, arka, yan), yürüme animasyonu.
  Silah tutan kol gövdeden ayrı parça, omuzdan döner.
- **Kontroller:** Ekranın sol yarısında dokunulan yerde beliren hareket kolu. Sağda VUR, SİPER (basılı tut),
  ATIL. Klavye: WASD/oklar, J/Boşluk vur, K/Shift siper, L atıl, E tüccar.
- **Dövüş:** 12 silah türü, her birinin kendi animasyonu (aşağıdaki tablo). Siper: basılı tutunca savunur,
  siper sağlığı savunma yayının kısalıp soluklaşmasıyla görünür, bitince kırılır ve dolana kadar kullanılamaz.
  Kalkan kuşanılıysa savunmayı kalkan yapar.
- **Göstergeler:** Karakterin başının üstünde tek gösterge: ince can çubuğu, tam üstünde saydam turuncu
  **denge** katmanı, altında yeşil enerji. Can çubuğunda "gecikmeli soluk parça" efekti var.
- **Enerji:** Atılma harcar, zamanla dolar.
- **Denge:** Hasar aldıkça azalır. Bitince 3 saniye "savunmasız" olunur, o sırada yenen vuruş 2 kat hasar verir.
- **Ölüm:** Karakter devrilir, hayaleti yükselir, meydanda yeniden doğar.
- **Silah Tüccarı:** Yolun doğu ucunda taş dükkân. Tüccara dokununca pencere açılır. Sekmeler: Yakın,
  Uzun saplı, Zincir ve yay, Kalkan, Zırh. Silahlar şu an ücretsiz, kalkan ve zırh altınla.
- **Zırh:** Kuşanınca avatar plaka zırh giyer; göğsünde element taşı var (şimdilik sönük).
- **Antrenman kuklası:** Kuzeybatı evinin sağında. Oyundaki tek "düşman". Vurulabilir, yaklaşınca önce "!"
  ile uyarıp vurur. Her vuruş 2 altın verir (geçici, test için).
- **Kayıt:** Cihazda `localStorage`. Altın, sahip olunanlar, kuşanılanlar, avatar, konum.

### Silahlar

| Kimlik | Ad | Animasyon (`anim`) |
|---|---|---|
| sword_basic | Kılıç (başlangıç) | slash: hızlı yay |
| axe_war | El Baltası | chop: geriye gerilip indirme |
| mace_iron | Topuz | smash: tepeden vuruş, şok halkası |
| claw_steel | Pençe | claw: çift pençe; ele giyilidir |
| spear_wood | Mızrak | thrust: saplama |
| trident_sea | Yaba | thrust |
| glaive_moon | Kargı | sweep: geniş savurma |
| poleaxe_long | Uzun Balta | sweep |
| twin_crescent | Çift Ağızlı Teber | spin: tam tur |
| flail_spike | Zincirli Gürz | flail: zincir ucunda dönen top |
| whip_chain | Zincirli Hançer | whip: fırlayıp geri dönen bıçak |
| bow_hunter | Yay | shoot: basılı tut, bırakınca at |

Hepsi **1. seviye** görünüşünde. `PlayerData.weaponLevel`, `WEAPON_MAX_LEVEL = 8` ve `weaponDmg()` hazır,
ama seviyeyi artıran bir sistem ve 2-8. seviye çizimleri yok. Kullanıcı XP sistemini istediğinde eklenecek.

## Teknik yapı

- **Tek dosya:** `index.html`. HTML + CSS + JavaScript hepsi içinde, yaklaşık 2300 satır.
- **Motor:** Phaser 3.80.1, jsDelivr CDN'den yüklenir. Yazı tipi: Fredoka (Google Fonts).
- **Görsel dosyası yok.** Bütün grafikler açılışta kodla çizilir (`Art` nesnesi) ve Phaser dokusuna dönüştürülür.
- **Her zaman yatay:** `Screen` nesnesi, telefon dik tutulursa `#wrap`'i CSS ile 90° döndürür. Bu yüzden
  dokunmatik kontroller Phaser girdisi değil, **DOM öğeleridir** ve koordinatlar `Screen.toLocal()` ile çevrilir.
- **Kare hızı:** `fixedStep: false`, fps sınırı yok (titremeyi çözmek için kaldırıldı). Silah, kol, gölge ve
  göstergeler fizik adımından sonra `syncVisuals()` içinde hizalanır (`postupdate` olayı).

### Piksel yoğunluğu (önemli)

Oyun mantığı "dünya birimi" kullanır: karo 16 birim, görünen yükseklik 152 birim.

- Kamera `Screen.zoom` (6 ya da 3) kat büyütür.
- Dünya dokuları **2 kat** yoğunlukta çizilir, 0.5 ölçekte gösterilir. `Art.canvas()` eski çizim kodunu
  otomatik 2 kat büyütüp doku ekler; `Art.canvasHi()` / `Art.hiDraw()` doğrudan yüksek yoğunlukta çizer.
- Karakter ve silahlar **48x64 piksel** çizilir, 3/8 (0.375) ölçekte gösterilir (`Art.scales`).
- `create()` içinde `this.add.image` sarmalanmıştır: `Art.hi` kümesindeki dokular kendiliğinden küçültülür.
  Efekt dokuları (`Art.lo`) eski yoğunluktadır. Yeni doku eklerken hangi kümede olduğuna dikkat et.
- Yazılar büyük çizilip `1/zoom` ile küçültülür (`makeText`). `setResolution` kullanma, yanlış boyut veriyordu.

### Kod haritası (`index.html` içinde sırayla)

- `CONFIG`, `COMBAT`: genel ve dövüş ayarları.
- `ITEMS`: tüm eşyalar (silah, kalkan, zırh). Denge ayarı buradan yapılır.
- `WEAPON_CLASS`: silah türüne göre animasyon, süre, menzil, vuruş anı, kabza yeri.
- `PlayerData`: oyuncunun kaydedilen durumu. `ELEMENTS`, `AVATARS`.
- `PALETTE`: zemin ve doğa renkleri.
- `Screen`, `SaveService`, `Hud`.
- `Art`: bütün çizimler. Önemli parçalar: `human()` (karakter), `bevel()` (otomatik hacim), `outline()`,
  `armSheet()`, `weapons()`, `nature()`, `furniture()`, `house()`, `market()`, `tilesHi()`.
- `WorldGen`: harita verisi ve nesne yerleşimi (tohumlu rastgele, hep aynı harita).
- `Controls`: hareket kolu, tuşlar, dokunma algılama.
- `Shop`, `AvatarUI`: DOM pencereleri.
- `WorldScene`: oyun sahnesi. `create`, `update`, `syncVisuals` (kol/silah duruşları), `attack`, `strike`,
  `updateChain` (zincir fiziği), `releaseArrow`, `dummyStrike`, `die`, `applyEquip`, `drawBars`.

### Renk kuralı

Zemin ve süsler doğal, hafif soluk tonlarda. Oyuncu açık renk kıyafet ve koyu dış çizgiyle öne çıkar.
**Mor** düşmanlara ayrılmıştır (portal bilinçli istisna). Ödüller parlak sarı.

## Test

```
cd tools
npm install
node test.js
```

`tools/test.js` oyunu tarayıcı olmadan çalıştırır: sahneyi açar, her silahla kuklaya vurur, siperi kırar,
tüccar ve avatar pencerelerini dener. Her adım için `tamam` ya da `HATA` yazar ve `tools/out/` klasörüne
ekran görüntüsü kaydeder. Görsel bir değişiklikten sonra ilgili görüntüyü aç ve bak.

Sınırları: Canvas çizici kullanır (gerçekte WebGL). `setTint` gibi renklendirmeler görüntüde çıkmaz. CSS,
DOM tuşlarının görünümü ve dokunmatik his test edilemez. Sürümler sabitlenmiştir (jsdom 31.0.1,
@napi-rs/canvas 1.1.1); başka sürümlerde "Expected DOMMatrix" hatası alınıyor.

Gerçek cihazda denemek için `index.html` bir tarayıcıda açılır (internet gerekir: Phaser ve yazı tipi CDN'den gelir).

## Bilinen eksikler ve geçici çözümler

- Binalar, tüccar dükkânı, çadırlar ve portal eski detay seviyesinde (otomatik büyütülmüş); karakter ve
  doğa kadar detaylı değil.
- Tek düşman antrenman kuklası. Altın sadece ona vurarak kazanılıyor.
- Silahlar ücretsiz. Bu geçici bir karar; XP sistemiyle birlikte gözden geçirilecek.
- Tezgâhtaki iksirler süs, satılmıyor. Avatarların meslek adları sadece isim, fark yaratmıyor.
- Element renkleri çizimde hazır (`ELEMENTS`, `PlayerData.element`) ama oyunda elde edilemiyor.
- CSS içinde artık kullanılmayan eski çubuk kuralları kalmış olabilir.
- Referanslardan henüz eklenmeyenler: balıkçı iskelesi ve tekneler, saksılar, saman, hedef tahtaları,
  mezar taşları, heykeller, köprüler, fırın.

## Sıradaki işler (kullanıcının söylediği sırayla değil, bekleyenler)

1. XP sistemi ve mob/düşmanlar; silahların seviye atlaması ve 2-8. seviye görünüşleri.
2. Element taşları ve zırha takılması.
3. Tarım ve balıkçılık.
4. Portal ile ikinci dünya.
5. Firebase: Google ile giriş ve buluta kayıt (`SaveService` bunun için ayrı katman).
6. Capacitor ile Android paketi, Play Store kapalı test ve yayın.
7. Yayından sonra online: asenkron PvP, sıralama, turnuvalar.

## Play Store ve online için daha önce konuşulan kararlar

- **Kayıt:** Play Games yerine Firebase (Authentication + Firestore). Ücretsiz planla başlanacak. Sunucuda
  doğrulama gerektiren işler (PvP sonucu, ödül) için Cloud Functions ve kartlı plan gerekecek.
- **Elmas iddiası riski:** Kullanıcı PvP'de elmasla iddia istiyor (100 koy, kazanan 200 alsın). Elmas gerçek
  parayla satılırsa bu kumar politikalarına takılabilir. Önerilen: satın alınamayan ayrı bir PvP parası ya da
  sabit ödüllü turnuvalar; karar öncesi hukuki görüş. Bu konu açıldığında riski tekrar hatırlat.
- **Paketleme:** Capacitor. Yatay kilit uygulama ayarından yapılacak, o zaman CSS döndürme gereksizleşir.
- **Performans:** fps sınırı kaldırıldığı için 120 Hz ekranlarda ısınma olabilir; yayın öncesi ele alınacak.

## Dosyalar

- `index.html`: oyunun tamamı.
- `tools/`: test aracı.
- `ekran-goruntuleri/`: bu rehber yazıldığındaki görünüm (meydan, tüccar, ev, tarla, silahlar, avatarlar).
- `referans/`: kullanıcının referans fotoğrafları için (boş gelir, kullanıcı doldurur).
- `PROMPT.md`: kullanıcının ilk mesaj olarak yapıştıracağı metin.
