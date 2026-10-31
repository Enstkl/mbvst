# Ürün gereksinimleri

Bu dosya, görüşmelerde kararlaştırılan ve ileride uygulanması gereken özellikleri korur. Yeni geliştirmelerde bu kayıt dikkate alınmalıdır.

## F-001 — Alış fiyatı geçmişi ve maliyete bağlı otomatik satış fiyatı

**Öncelik: önemli / veritabanı aşamasında mutlaka uygulanacak.**

**Durum:** Gereksinim olarak kaydedildi; mevcut statik prototipte uygulanmadı.

### Kullanıcının talebi

- Ürünlerin satın alma fiyatları saklanmalı ve raporlanmalı.
- Yeni bir alımda ürünün alış maliyeti arttığında, satış fiyatı kullanıcının belirlediği orana göre otomatik artırılabilmeli.
- Bu davranış, kalıcı veritabanı eklendiğinde ürünün bir özelliği olmalı; yalnızca geçici bir ekran hesabı olarak kalmamalı.

### Uygulamada karşılanacak davranış

- Her ürünün alış geçmişi ayrı kayıtlar halinde tutulur: tarih, tedarikçi/belge, miktar, birim, alış fiyatı, iskonto ve vergi bilgileri. Yeni fiyat eskisini silmez.
- Raporlarda ürünün tarih aralığına göre alış fiyatları ve maliyet değişimleri görülebilir; veriler dışa aktarılabilir.
- Otomatik fiyatlandırma ürün bazında açılıp kapatılabilir; kullanıcı hedef oranı belirler ve gerektiğinde satış fiyatını elle değiştirebilir.
- Onaylanan bir alış kaydı maliyeti artırdığında, otomatik fiyatlandırması açık üründe belirlenen kurala göre yeni satış fiyatı hesaplanır ve kaydedilir.
- Fiyat değişiminin gerekçesi, eski/yeni alış maliyeti, kullanılan oran, eski/yeni satış fiyatı ve zamanı izlenebilir.
- Geçmiş satışların gerçek satış fiyatı ve maliyet bilgisi korunur. Sonradan gelen alış fiyatı, eski satışların kârını geriye dönük değiştirmez.
- Alış maliyetleri, kâr oranları ve fiyatlandırma ayarları yalnızca yetkili hesaplara açılır; yalnızca satış yapan çalışan bunları görmez veya değiştiremez. Yetki kontrolü sunucuda da uygulanır.

### Veritabanı aşamasında netleştirilecek hesaplama kararları

Kullanıcının istediği otomatik artış davranışı kesindir; aşağıdaki ayrıntılar henüz kararlaştırılmadı:

- Seçilen yüzde, maliyet üzerine eklenen kâr oranı mı, satış üzerinden kâr marjı mı? Arayüzde bu iki anlam karıştırılmamalı.
- Hesaplamada son alış maliyeti mi, ağırlıklı ortalama maliyet mi kullanılacak?
- Vergi ve iskonto sonrası hangi maliyet esas alınacak; satış fiyatının vergi dahil/hariç durumu nasıl yönetilecek?
- Alış fiyatı düştüğünde satış fiyatı sabit mi kalacak, isteğe bağlı otomatik azalabilecek mi? Mevcut talep otomatik artıştır; otomatik düşüş talep edilmiş değildir.
- Yuvarlama, elle belirlenen fiyatın otomatik kuraldan önceliği ve mevcut stokların fiyatlandırılması nasıl yönetilecek?

Örnek (yalnızca maliyet üzerine ekleme seçilirse): maliyet 100 TL ve oran %30 iken satış fiyatı 130 TL olur. Esas alınan maliyet 120 TL'ye yükseldiğinde yeni satış fiyatı 156 TL olur. Bu örnek, henüz seçilmemiş hesaplama ayrıntılarını kesinleştirmez.

## F-002 — Satış yöntemi, POS kesintisi ve veresiye

**Durum:** Statik prototipte satış formu, işlem listesi, ödeme raporu ve CSV eklendi. Kalıcı kayıt veritabanıyla tamamlanmalı.

Satış yöntemi Nakit/POS/Veresiye olarak satış anında seçilmeli. POS cihazına ödeme gönderen bir entegrasyon değildir. POS için kullanıcının girdiği isteğe bağlı kesinti oranı, brüt satış, hesaplanan kesinti ve net tutar satışa ait ayrı alanlarda korunmalı; sonraki oran değişiklikleri geçmiş satışları değiştirmemeli. Veresiyede müşteri adı/ünvanı, telefon ve isteğe bağlı not saklanmalı; alacak tahsilat gibi gösterilmemeli. Yöntem ve tarih bazında raporlama/dışa aktarma sağlanmalı. Gelecekte F-001 kâr hesabı uygulanırken POS kesintisi ayrıca dikkate alınmalı ve aynı kesinti iki kez düşülmemeli.

## F-003 — Veresiye borç defteri, kişi arama ve tahsilatlar

**Durum:** Statik prototipte müşteri arama/filtreleme, kısmi-tam ödeme, FIFO borç dağıtımı, ödeme geçmişi, satışta mevcut kişi seçimi ve yetkiler eklendi. Veritabanında kalıcı müşteri/satış/tahsilat ve tahsilat dağıtım kayıtlarına taşınmalı. Tahsilat yeni satış sayılmamalı; stok değiştirmemeli. POS kesintisi borcu eksik kapatmamalı; işletmenin net tahsilatını azaltmalı. İlk satış kayıtları korunmalı, kalan borç tahsilatlardan hesaplanmalı. Borç görüntüleme ve ödeme kaydetme sunucuda ayrı yetkilerle denetlenmeli.

## F-004 — Tekil müşteri kartı ve iki ekrandan kayıt

**Durum:** Prototipte müşteriler ayrı sabit kimliklerle, bu tarayıcıya özel localStorage dizininde saklanıyor. Satış noktası ve Veresiye defteri müşteri oluşturma formunu açar; kayıtlı kişiler alfabetik listelenir ve ad/telefon ile bulunur. Normalleştirilmiş telefon aynıysa ikinci kart oluşturulmaz; aynı adı taşıyan farklı kişiler yalnızca ada göre birleştirilmez.

Veritabanı aşamasında işletmeye bağlı müşteri tablosu, işletme+normalleştirilmiş telefon için sunucu tekillik kontrolü ve satış/tahsilatlarda müşteri kimliği bağlantısı gereklidir. Kişi kaydı tüm yetkili cihazlar arasında ortak ve kalıcı olmalı; kayıt/arama yetkileri sunucuda denetlenmelidir. Tarayıcı dizini bu ortak veri tabanının yerine geçmez.

### F-004 arayüz netleştirmesi — satış noktasında tek müşteri alanı

Kayıtlı kişi seçme, ad yazma ve müşteri oluşturma ayrı kontroller değil, tek bir isim combobox bileşeni olmalıdır. Yazdıkça mevcut kişiler filtrelenir. Eşleşen kişi seçilir; kişi yoksa aynı bileşen içinde telefonla oluşturulur. Aynı telefon için yeni hesap açılmaz. Bu davranış prototipte uygulanmıştır; sunucuya taşınırken korunmalıdır.

## F-005 — Tek alanda ürün adı ve barkod arama

Satış noktası ürün adı, tam barkod ve barkodun son 4–5 hanesini aynı girişten kabul etmelidir. Tam kod eşleşmesi öncelikli olmalı; kısa kodla birden fazla ürün bulunduğunda kullanıcı seçim yapmadan sepete eklenmemelidir. Okuyucunun Enter girdisiyle hızlı satış korunmalıdır. Prototipte uygulanmıştır.

### F-002 arayüz netleştirmesi — POS neti yalnızca raporlarda

Satış yapan çalışan, POS seçtiğinde toplam satış fiyatından farklı ikinci bir net fiyat görmemelidir. Kesinti hesaplanıp kaydedilir; brüt, kesinti ve net tutar raporlarda görünür. Raporlara ayrıca ürün maliyeti ve POS kesintisi sonrası net satış kazancı eklenmiştir. Giderler dahil olmadığı açıkça belirtilir; maliyeti bilinmeyen kayıtlar kazanca dahil edilmez. Veritabanına taşınırken satış anındaki maliyet ve kesinti geçmişi korunmalıdır.
