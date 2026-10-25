# Stokça — görsel uygulama taslağı

Belge fotoğrafından stok girişi, ürün takibi ve satış analizi fikrini gösteren, mobil uyumlu statik web arayüzü. **Gerçek işletme verisi, veritabanı veya yapay zekâ bağlantısı içermez.** Stokça geçici çalışma adıdır.

## Ekranlar

- Genel bakış: örnek finansal göstergeler, dönem seçimi, alış/satış grafiği, en çok satanlar ve azalan stoklar.
- Ürünler & stok: arama, kategori/stok filtresi, ürün ayrıntısı, örnek ürün ekleme.
- Alış belgeleri: yerel dosya seçimi ve örnek ürün eşleştirme akışı. Seçilen dosyalar okunmaz veya sunucuya yüklenmez.
- Satış noktası: ürün seçimi veya örnek barkod yazma, sepet ve oturum içi stok düşümü. Kamera/okuyucu entegrasyonu ve ödeme işlemi yoktur.
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
