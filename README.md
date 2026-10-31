# Stokça — görsel uygulama taslağı

Belge fotoğrafından stok girişi, ürün takibi ve satış analizi fikrini gösteren, mobil uyumlu statik web arayüzü. **Gerçek işletme verisi, veritabanı veya yapay zekâ bağlantısı içermez.** Stokça geçici çalışma adıdır.

## Ekranlar

- Genel bakış: örnek finansal göstergeler, dönem seçimi, alış/satış grafiği, en çok satanlar ve azalan stoklar.
- Ürünler & stok: arama, kategori/stok filtresi, ürün ayrıntısı, örnek ürün ekleme.
- Stok ekle: gerçek kamera önizlemesi, belge fotoğrafı çekimi, çok sayfalı fotoğraf listesi, yerel dosya seçimi ve örnek ürün eşleştirme akışı. Fotoğraflar Gemini ile okunmaz veya sunucuya yüklenmez.
- Satış noktası: ZXing ile kameradan gerçek barkod okuma, barkod cihazı/elle giriş alanı, Türkçe karakter ve büyük/küçük harf toleranslı ürün adı arama, sonuçlardan sepete ekleme, örnek okutma, sepet ve satış öncesi/sonrası stok karşılaştırması. Tanınmayan barkod örnek bir ürüne bağlanabilir. USB/Bluetooth okuyucular klavye gibi kod ve Enter gönderiyorsa odaklanmış alandan kullanılabilir; özel cihaz sürücüsü entegrasyonu ve ödeme işlemi yoktur.
- Raporlar: Excel ile açılabilen örnek CSV indirmeleri. Gerçek XLSX üretilmez.

Tüm değişiklikler yalnızca sayfa belleğindedir; yenilemede sıfırlanır. Dashboard göstergeleri sabit dönem örnekleridir; oturumda yapılan işlemlerle finansal olarak yeniden hesaplanmaz. Stok toplamı ve son işlemler örnek etkileşimleri yansıtır. Sayfadaki kişi ve işletme adları örnektir.

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
