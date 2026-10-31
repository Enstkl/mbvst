# Stokça — görsel uygulama taslağı

Belge fotoğrafından stok girişi, ürün takibi ve satış analizi fikrini gösteren, mobil uyumlu statik web arayüzü. **Gerçek işletme verisi, veritabanı veya yapay zekâ bağlantısı içermez.** Stokça geçici çalışma adıdır.

## Ekranlar

- Genel bakış: örnek finansal göstergeler, dönem seçimi, alış/satış grafiği, en çok satanlar ve azalan stoklar.
- Ürünler & stok: arama, kategori/stok filtresi, ürün ayrıntısı, örnek ürün ekleme.
- Stok ekle: gerçek kamera önizlemesi, belge fotoğrafı çekimi, çok sayfalı fotoğraf listesi, yerel dosya seçimi ve örnek ürün eşleştirme akışı. Fotoğraflar Gemini ile okunmaz veya sunucuya yüklenmez.
- Satış noktası: ZXing ile kameradan gerçek barkod okuma, barkod cihazı/elle giriş alanı, Türkçe karakter ve büyük/küçük harf toleranslı ürün adı arama, sonuçlardan sepete ekleme, örnek okutma, sepet ve satış öncesi/sonrası stok karşılaştırması. Tanınmayan barkod örnek bir ürüne bağlanabilir. USB/Bluetooth okuyucular klavye gibi kod ve Enter gönderiyorsa odaklanmış alandan kullanılabilir; özel cihaz sürücüsü entegrasyonu ve ödeme işlemi yoktur.
- Raporlar: Excel ile açılabilen örnek CSV indirmeleri. Gerçek XLSX üretilmez.

Ürün, satış, tahsilat ve çalışan değişiklikleri sayfa belleğindedir; yenilemede sıfırlanır. Müşteri kartları ise bu tarayıcının localStorage alanında kalıcı saklanır. Dashboard göstergeleri sabit dönem örnekleridir; oturumda yapılan işlemlerle finansal olarak yeniden hesaplanmaz. Stok toplamı ve son işlemler örnek etkileşimleri yansıtır. Sayfadaki kişi ve işletme adları örnektir.

## Yerel önizleme

Bağımlılık veya derleme gerektirmez. Bu klasörde:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Ardından `http://127.0.0.1:4173` adresini açın. Dosyalar doğrudan `index.html` açılarak da görüntülenebilir. Google Fonts erişilemezse sistem yazı tipleri kullanılır.

## GitHub Pages

`.github/workflows/pages.yml` dosyası `main` dalına gönderildiğinde statik dosyaları GitHub Pages'e dağıtır. Reponun **Settings → Pages → Source** ayarı **GitHub Actions** olmalıdır.

Beklenen adres: https://enstkl.github.io/mbvst/ (yayın başarılı olduğunda kullanılabilir).

Fiş Takip uygulamasının kaynakları değiştirilmemiştir. Bu repo ayrı bir arayüz çalışmasıdır.

## Kamera ve barkod

Kamera yalnızca kullanıcı düğmeye bastığında ve tarayıcı izniyle açılır. HTTPS veya localhost gerekir. Kamera kapatıldığında, ekran değiştiğinde, sekme arka plana gittiğinde veya barkod okunduğunda akış durdurulur. Belge fotoğrafları tam kare olarak alınır ve bu sekmede geçici tutulur. AI ürün okuma bağlı değildir; inceleme listesi açıkça örnek olarak işaretlidir. Fiziksel kamera/okuyucu davranışı cihaz ve tarayıcıya bağlıdır.

Barkod çözümleme kütüphanesi: `@zxing/browser` 0.1.5 (yerel `vendor/` klasörü, MIT lisansı).

## Elle ürün ekleme ve etiket yazdırma

`#new-product` sayfasında ürün adı, açıklama, kategori, adet/set/paket birimi, başlangıç miktarı ve alış/satış fiyatı girilir. Her kayıt için kriptografik rastgele kaynaktan 12 haneli, mevcut listedeki kodlarla çakışmayan işletme içi bir kod oluşturulur; CODE128 olarak çizilir. Bu kod GS1/EAN tahsisi değildir.

`#labels` sayfasında barkodlu ürün seçilip 1–100 kopya yazdırılabilir. A4 (3 sütun) ve 50 × 30 mm termal etiket düzenleri vardır; fiyat isteğe bağlıdır. Yazıcı ayarları %100 ölçek ve uygun kağıt boyutuyla yapılmalıdır. Barkod numarası tekrar yazdırıldığında değişmez.

Ürün listesindeki Yazdır düğmeleri ve ürün ayrıntısı etiket sayfasına gider. Eklenen ürün adı veya barkoduyla satış sepetine alınabilir. Kayıtlar mevcut prototip gibi yalnızca açık sekmede tutulur; yenilemede silinir.

Barkod üretimi: JsBarcode 3.11.6, MIT lisansı (`vendor/jsbarcode-LICENSE.txt`).

### Ürün eklerken kamerayla barkod okutma

`#new-product` sayfasında Kameradan barkod okut düğmesi mevcut kamera okuyucusunu açar. Okunan kod, yazılmış ad/fiyat/miktar alanları korunarak forma ve etiket önizlemesine aktarılır; satış sepetine eklenmez. Kodu elle yazmak veya barkodsuz ürün için yeni iç barkod oluşturmak da mümkündür. Kayıtlı barkodla ikinci ürün oluşturulmaz. Barkoddan ürün adı/fiyat sorgulayan harici veri kaynağı yoktur. Kayıtlar halen sekme belleğindedir.

## Barkodla mevcut stoğa ekleme

`#documents` (Stok ekle) varsayılan olarak Barkodla ekle sekmesini açar. Kamera, klavye gibi çalışan barkod okuyucu veya numara girişiyle mevcut ürün bulunur; eklenecek miktar elle girilir. Mevcut miktar + yeni miktar önizlemesi gösterilir; onayda stok artırılır. Ürün bulunamazsa barkodu yeni ürün formuna taşımak mümkündür. Aynı sayfada Belgeden toplu ekle sekmesi mevcut fatura akışını korur. Bu işlem alış faturası veya maliyet kaydı değildir; işlem geçmişinde Stok girişi olarak görünür. Tüm kayıtlar halen açık sekmede tutulur.

## Çalışanlar ve yetkiler (arayüz prototipi)

`#team` ekranında örnek çalışan hesabı oluşturma, hazır rol seçme, hesap bazında izinleri düzenleme ve hesabı devre dışı bırakma bulunur. İşletme sahibi hesabı değiştirilemez; çalışan yöneten hesap kendi kapsamından daha geniş yetki veremez.

Hazır roller:
- Sadece satış: satış ekranı. Stok miktarı, alış maliyeti, stok değişimleri, raporlar ve çalışan yönetimi gösterilmez.
- Stok sorumlusu: stok görüntüleme/ekleme, ürün oluşturma ve maliyetler.
- Yönetici: satış, stok, rapor ve indirme; çalışan yönetimi kapalı.
- Muhasebe: stok, maliyet ve raporları okuma/indirme; satış ve veri değiştirme kapalı.

Üstteki Rolü dene veya hesap satırındaki Rolü dene, o kişinin arayüzüne geçer. Önizlemeyi bitir, işletme sahibine döner. Önizleme değişiminde satış sepeti temizlenir. Menü ve doğrudan sayfa rotaları izinlere göre filtrelenir; işlem ve dışa aktarma eylemleri de kontrol edilir. Maliyet görme izni olmayan stok kullanıcısının stok CSV çıktısına maliyet sütunu konmaz.

**Bu bir güvenlik sınırı değildir.** Kullanıcılar, yetkiler ve ürünler tarayıcı belleğindedir; kaynak kod ve örnek veriler istemciye indirilir. Gerçek kullanıcı kaydı, parola, oturum, davet e-postası, veritabanı veya sunucu tarafı erişim kontrolü yoktur. Gerçek çalışan kullanımından önce kimlik doğrulama ve işletme/rol bazında veri denetimi sunucuda uygulanmalıdır. Hesaplar yenilemede sıfırlanır.

Regresyon kontrolleri: `node tests/team-access.test.cjs`. Fiziksel cihaz ve görsel tarayıcı kontrolü bu değişiklikte yapılmadı.

## Gelecek geliştirmeler

Veritabanı aşamasında uygulanacak önemli özellikler [PRODUCT_REQUIREMENTS.md](PRODUCT_REQUIREMENTS.md) dosyasında tutulur. Özellikle **F-001: alış fiyatı geçmişi, raporlama ve maliyet artınca kullanıcının belirlediği orana göre otomatik satış fiyatı güncelleme** unutulmamalıdır. Bu özellik mevcut prototipte henüz uygulanmış değildir.

## Nakit, POS ve veresiye satış kaydı

Satış noktasında satış tamamlanmadan Nakit/POS/Veresiye seçilir. Bu özellik ödeme almaz, POS cihazına bağlanmaz; dışarıda yapılmış satışın yöntemini kaydeder.

- Nakit: tutar nakit tahsilat kaydı olarak saklanır.
- POS: isteğe bağlı 0–100% kesinti girilir. Virgül veya nokta kabul edilir. Kesinti brüt satıştan kuruş bazında hesaplanır; brüt, oran, kesinti ve net satış anında ayrı saklanır. Oran girilmediyse net brüt kabul edilir ve raporda bu varsayım belirtilir.
- Veresiye: müşteri adı/ünvanı ve telefon zorunlu, not isteğe bağlıdır. Brüt tutar alacak olarak kaydedilir, tahsilat sıfırdır. Borç tahsilatı/kapatma Veresiye defteri sayfasında yapılır.

Son işlemlerde yöntem rozeti; raporlarda nakit toplamı, POS brüt/kesinti/net tutarları ve açık veresiye alanı vardır. Rapor dönemi Europe/Istanbul takvimine göre filtrelenir. Ödeme yöntemi filtresi ve CSV aynı kayıtları kullanır. Veresiye kişi bilgileri ilgili satır ve satış ayrıntısında görünür. Çalışan kimliği ve satış tarihi de kaydedilir.

Ödeme raporu sekmede gerçekten kayıtlı işlemlerden hesaplanır; genel demo grafikler ve göstergeler halen örnektir. İki başlangıç demo satışı açık Nakit/POS metaverisiyle hazırlanmıştır. Satış yöntemi/müşteri bilgileri rol önizlemesi değişince formdan temizlenir. Yetkisiz çalışan raporlara ve CSV çıktısına erişemez. Tüm veriler halen sekme belleğindedir.

Testler: `node tests/sale-payments.test.cjs` ve `node tests/team-access.test.cjs`.

## Veresiye defteri ve ödeme kaydı

`#credit` sayfasında müşteri adı/ünvanı veya telefonla arama, borcu olan/kısmen ödenen/tamamen ödenen/tüm kişiler filtresi ve borç/ad/tarih sıralaması bulunur. Müşteri bazında toplam borç, ödenen ve kalan tutarlar gösterilir. Ayrıntıda veresiye satışları ve ödeme geçmişi vardır.

Nakit veya POS ile alınmış kısmi/tam ödeme kaydedilebilir. Ödeme en eski açık satıştan başlayarak dağıtılır. Sıfır/negatif/hatalı tutar ve kalan borcu aşan ödeme reddedilir. POS kesintisi varsa borç brüt ödeme kadar azalır; kesinti işletmenin net tahsilatından düşer. Ödemeler ayrı defterde ve işlem geçmişinde tahsilat olarak tutulur; yeni satış veya stok hareketi yaratılmaz. İlk veresiye satışının tutarı/müşteri bilgisi korunur; açık bakiye ödeme kayıtlarından hesaplanır.

Satış noktasında Veresiye seçilince kayıtlı kişi ad/telefonla aranıp form alanlarına aktarılabilir. Müşteriler bu prototipte telefon numarasıyla gruplanır; Türkiye için +90 ve baştaki 0 gösterimleri eşleştirilir. Aynı adlı farklı telefonlar ayrı tutulur. Veritabanı aşamasında kalıcı müşteri kimliği kullanılmalıdır.

Veresiyeleri gör ve Veresiye ödemesi kaydet ayrı izinlerdir. Yönetici ikisine de, Muhasebe yalnızca görüntülemeye sahiptir. Sadece satış rolü yeni satışta kişi seçebilir ama borç bakiyelerini göremez veya tahsilat kaydedemez. İsteğe bağlı olarak bu yetkiler ayrıca verilebilir.

Ödeme raporlarında kalan alacak güncellenir; dönemdeki veresiye tahsilat brüt/net tutarları ve tahsilat POS kesintisi ayrı gösterilir. Borç defteri tüm tarihlerdeki kayıtları kapsar; CSV seçili müşteri filtrelerini uygular. Gerçek para transferi yapılmaz. Veriler halen açık sekmede tutulur ve yenilemede sıfırlanır.

Test: `node tests/credit-ledger.test.cjs`.

## Kalıcı müşteri kartları (tarayıcıya özel)

Veresiye müşterileri artık borçtan ayrı bir kişi dizininde sabit kimlikle saklanır. Satış noktasında ve Veresiye defterinde Yeni müşteri düğmesi form açar. Satış noktasındaki ad/telefon alanları Müşteriyi kaydet ile satıştan bağımsız kaydedilebilir; veresiye satış kaydedilirken de kişi kartı yoksa oluşturulur. Kayıtlı kişiler A–Z seçim listesinde ve ad yazdıkça çıkan önerilerde gösterilir. Seçilen kişinin ad/telefonu değiştirilmez; yeni kişi için seçim temizlenebilir veya yeni müşteri formu açılır.

Tekilleştirme normalleştirilmiş telefon numarasına göredir. 05xx ve +90 5xx aynı numara kabul edilir; mevcut telefon için aynı kişi kimliği kullanılır, adı/notu sessizce değiştirilmez. Aynı adlı farklı telefonlar farklı kişiler olabilir; yalnızca ada bakılarak birleştirilmez. Borçsuz kişiler de defterde Borç kaydı yok durumuyla görünür.

Kişi kartları `stokca.mbvst.customers.v1` anahtarında sürümlü JSON olarak localStorage içinde tutulur. Sayfa yenilendiğinde korunur; tarayıcı verilerini silmek, başka tarayıcı/cihaz veya başka site adresi aynı kişi listesine erişmez. Bu bir sunucu veritabanı veya yedek değildir. Borçlar, satışlar ve tahsilatlar halen geçicidir; müşteri kartında bu finansal kayıtlar saklanmaz. Depolama kapalı/dolu/bozuksa kayıt hatası gösterilir; kaydedilemeyen yeni kişiyle satış/stok hareketi oluşturulmaz.

Satış yetkisi veya tahsilat kaydetme yetkisi olan hesaplar müşteri oluşturabilir. Salt görüntüleme yetkisi olan hesap oluşturamaz. Müşteri listesi çalışan hesaplarından ayrıdır. Test: `node tests/customer-directory.test.cjs`.

## Satışta birleşik müşteri alanı

Veresiye seçildiğinde tek Müşteri combobox alanı görünür. Ad yazıldıkça kayıtlı kişiler alfabetik filtrelenir; tıklama veya ok/Enter tuşlarıyla seçilir. Seçimde aynı müşteri kimliği ve telefon kullanılır. Adı düzenlemek mevcut seçimi ve önceki telefonu temizler; böylece yanlış kişinin telefonuyla yeni isim kaydedilmez.

Tam adı kayıtlı bir kişiyle eşleşirse dropdown yeni kart oluşturmayı önermez; mevcut kişi seçilir. Eşleşmeyen ad için dropdown içinde Yeni kişi oluştur seçeneği çıkar. Aynı bileşenin altında telefon girilip Kaydet ve seç ile kayıt yapılır; ayrı kişi seçme/ad/kaydetme blokları kaldırılmıştır. Aynı telefonla yeni kart oluşturma engeli sürer. Veresiye defterindeki bağımsız Yeni müşteri formu korunur; aynı adı taşıyan farklı kişiler gerektiğinde telefonla ayırt edilebilir.
