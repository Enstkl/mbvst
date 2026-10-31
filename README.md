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
