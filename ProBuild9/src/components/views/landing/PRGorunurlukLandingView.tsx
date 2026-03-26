'use client';

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react';
import Image from 'next/image';
import { ReferanslarSection } from '@/components/ReferanslarSection';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Video ID'yi buradan değiştirebilirsiniz (YouTube: watch?v=XXXXX içindeki XXXXX)
const EXPLAINER_VIDEO_ID = 'al-D_BC5cYc';

const HIZMET_SECIMI = [
  'Influencer Marketing',
  'Celebrity Marketing',
  'Dijital PR',
  'Medya İlişkileri',
  'Etkinlik ve Proje Yönetimi',
  'Sponsorluk İletişimi',
  'Genel Bilgi',
];

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
};

const INITIAL_STATE: FormState = {
  name: '',
  company: '',
  email: '',
  phone: '',
  topic: '',
  message: '',
};

const SEKTOREL_SLIDES = [
  { src: '/reklam_pr_gorunurluk/trafel.webp', alt: 'Turizm' },
  { src: '/reklam_pr_gorunurluk/premium_product.webp', alt: 'Premium tüketim' },
  { src: '/reklam_pr_gorunurluk/beauty_wellness.webp', alt: 'Beauty / Wellness' },
  { src: '/reklam_pr_gorunurluk/fly.webp', alt: 'Havacılık' },
  { src: '/reklam_pr_gorunurluk/kurumsal.webp', alt: 'Kurumsal markalar' },
  { src: '/reklam_pr_gorunurluk/luxury.webp', alt: 'Lüks otel' },
  { src: '/reklam_pr_gorunurluk/lifestyle.webp', alt: 'Lifestyle' },
];

export function PRGorunurlukLandingView() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sektorelSlide, setSektorelSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setSektorelSlide((i) => (i + 1) % SEKTOREL_SLIDES.length);
    }, 4500);
    return () => clearInterval(t);
  }, [SEKTOREL_SLIDES.length]);

  const onChange = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    try {
      const apiUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? '/sendmail.php' : '/api/contact';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, topic: form.topic || 'PR / Influencer / Celebrity Marketing' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback(data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        setIsSubmitting(false);
        return;
      }
      setForm(INITIAL_STATE);
      setTimeout(() => router.push('/thankyou'), 500);
    } catch {
      setFeedback('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* 1. HERO */}
      <section className="relative overflow-hidden border-b border-white/10 bg-zinc-950 px-6 py-16 md:py-24 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(20,184,166,0.12),_transparent_50%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="space-y-8">
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-[2.75rem]">
              Görünürlük tesadüf değil, strateji işidir.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-white">
              Influencer, celebrity ve medya etkisini tek kampanyada birleştirin. Markanızı sadece görünür değil, konuşulur hale getirin.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#form"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-teal-500/25 transition-all hover:opacity-95 hover:shadow-teal-500/30"
              >
                Teklif Al
              </Link>
              <Link
                href="#form"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:border-white/40 hover:bg-white/10"
              >
                Strateji Görüşmesi Planla
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-4 text-sm text-white">
              <span className="flex items-center gap-2">Doğru isim · Doğru mecra</span>
              <span className="flex items-center gap-2">Ölçülebilir kampanya</span>
              <span className="flex items-center gap-2">PR + Influencer + Celebrity</span>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50">
            <Image
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80"
              alt="Stratejik iletişim"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent" />
          </div>
        </div>
      </section>

      <ReferanslarSection />

      {/* VIDEO: Nasıl çalışıyor? / Tanıtım */}
      <section className="border-b border-white/10 bg-zinc-900/30 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Join Pr | Deneyimi Stratejiye Dönüştürür
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white">
            Stratejimizi ve sürecimizi kısa videolarla keşfedin.
          </p>
          <div className="mt-10 aspect-video overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-xl">
            {EXPLAINER_VIDEO_ID ? (
              <iframe
                title="Join PR tanıtım"
                src={`https://www.youtube.com/embed/${EXPLAINER_VIDEO_ID}?rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-teal-950/40 to-zinc-900 text-white">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/5">
                  <svg className="h-10 w-10 text-teal-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <p className="text-lg font-medium">Tanıtım videomuz yakında</p>
                <p className="max-w-sm text-center text-sm text-white/80">YouTube veya Vimeo linkinizi EXPLAINER_VIDEO_ID ile ekleyebilirsiniz.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. PROBLEM */}
      <section className="border-b border-white/10 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Markaların yaşadığı gerçek problemler
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white">
            Görünürlük ve etki arayan markaların sıkça yaptığı hatalar.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[180px] bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
                alt="Ekip toplantısı ve strateji"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90 md:text-base">Doğru strateji olmadan görünürlük hedefe ulaşmaz.</p>
            </div>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Yanlış influencer seçimi', desc: 'Yüksek erişim, doğru etki anlamına gelmez. Marka ile uyumsuz seçimler, kampanyayı görünür kılsa bile istenen algıyı oluşturmayabilir.', img: '/gorunurluk-influencer-kutu-1.png' },
              { title: 'Görünür ama fark edilmez', desc: 'İçerikler yayındadır; ancak dönüşüm, itibar ve ölçülebilir etki üretmeyen iletişim markaya gerçek bir değer kazandırmaz.', img: '/gorunurluk-kutu-2.png' },
              { title: 'Plansız PR çalışmaları', desc: 'Basın bültenleri ve medya ilişkileri stratejik bir planla ilerlemediğinde, iletişim süreklilik kazanmaz ve marka değeri oluşturmakta yetersiz kalır.', img: '/gorunurluk-kutu-3.png' },
              { title: 'Ölçümsüz kampanyalar', desc: 'Etkisinin ne kadar olduğu bilinmeyen kampanyalar, markaya net bir yön göstermez. Raporlama ve analiz eksik olduğunda başarı da sağlıklı biçimde değerlendirilemez.', img: '/gorunurluk-kutu-4.png' },
              { title: 'Premium algıya zarar', desc: 'Tutarsız mesajlar ve dağınık iletişim, markanın değer algısını aşağı çeker. Premium bir konumlanma, ancak tutarlı bir dil ve güçlü bir iletişim yapısıyla korunabilir.', img: '/gorunurluk-kutu-5.png' },
              { title: 'Tek kanal odaklılık', desc: 'Sadece tek bir kanala yaslanan iletişim, markanın etkisini sınırlar. Entegre görünürlük olmadan güçlü sonuç üretmek zordur.', img: '/gorunurluk-kutu-6.png' },
            ].map((item, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors hover:border-teal-500/20 hover:bg-white/[0.07]"
              >
                <div className="relative aspect-square w-full">
                  <Image src={item.img} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUTION */}
      <section className="border-b border-white/10 bg-gradient-to-b from-teal-950/20 to-zinc-950 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Join PR yaklaşımı
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white">
            Görünürlük, etki ve marka değerini tek stratejide birleştiren hizmetler.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[180px] bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80"
                alt="Join PR strateji ve ekip"
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white/90 md:text-base">PR, influencer ve celebrity tek çatıda.</p>
            </div>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Influencer Marketing', desc: 'Doğru isim, doğru kitle, doğru mesaj. Sadece paylaşım değil, stratejik eşleşme.', img: '/reklam_pr_gorunurluk/influencer.webp' },
              { title: 'Celebrity Marketing', desc: 'Prestij ve güven odaklı celebrity iş birlikleri. Marka uyumu ve ölçülebilir etki.', img: '/reklam_pr_gorunurluk/celebrity.webp' },
              { title: 'Dijital PR', desc: 'Online görünürlük ve itibar yönetimi. Medya ve dijital kanallar birlikte.', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80' },
              { title: 'Medya İlişkileri', desc: 'Basın, yayın ve dijital medya ile sürdürülebilir ilişki. Doğru an, doğru mecralar.', img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80' },
              { title: 'Etkinlik ve Proje Yönetimi', desc: 'Lansman, etkinlik ve özel projelerde iletişim ve görünürlük yönetimi.', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80' },
              { title: 'Sponsorluk İletişimi', desc: 'Sponsorluk yatırımının marka değerine dönüşmesi. Mesaj ve kapsam stratejisi.', img: '/reklam_pr_gorunurluk/sponsored.webp' },
            ].map((item, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-teal-500/20 bg-teal-500/5 transition-colors hover:border-teal-500/30 hover:bg-teal-500/10"
              >
                <div className="relative aspect-square w-full">
                  <Image src={item.img} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY IT WORKS */}
      <section className="border-b border-white/10 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Join Pr Etkisi
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Mesajı, doğru isim, doğru mecra ve doğru zamanla buluşturur.',
              'Premium marka uyumu: Markayı, premium kimliğine uygun isimler ve içeriklerle konumlandırır.',
              'Tek kanal değil çok katmanlı iletişim: Markayı, tek kanalla değil çok katmanlı bir iletişim yapısıyla büyütür.',
              'Ölçülebilir kampanya kurgusu: Kampanyayı, ölçülebilir hedefler ve net çıktılarla yapılandırır.',
              'PR + influencer + celebrity entegrasyonu: PR, influencer ve celebrity iletişimini tek stratejide birleştirir.',
              'İtibar ve görünürlük birlikte yönetilir: İtibarı ve görünürlüğü aynı stratejik çizgide birlikte yönetir.',
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </span>
                <p className="text-sm font-medium text-white">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SEKTÖREL ODAK */}
      <section className="border-b border-white/10 bg-white/[0.02] px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Sektörel odak
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white">
            Özellikle bu sektörlerde güçlü bir iletişim ortağıyız.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[21/9] w-full min-h-[180px] bg-zinc-900">
              {SEKTOREL_SLIDES.map((slide, i) => (
                <div
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    i === sektorelSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    unoptimized
                  />
                </div>
              ))}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-zinc-950/80 via-zinc-950/30 to-transparent pointer-events-none" />
              <p className="absolute bottom-10 left-4 right-4 text-center text-sm font-medium text-white/90 md:text-base z-20 pointer-events-none">Turizm, otel, havacılık, lifestyle, beauty ve premium markalar.</p>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2 pointer-events-auto">
                {SEKTOREL_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSektorelSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === sektorelSlide ? 'w-6 bg-teal-400' : 'w-2 bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {['Turizm', 'Otelcilik', 'Havacılık', 'Lifestyle', 'Beauty / Wellness', 'Premium tüketim markaları', 'Kurumsal markalar'].map((s, i) => (
              <span
                key={i}
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-teal-500/30 hover:bg-teal-500/10"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CASE / SOCIAL PROOF */}
      <section className="border-b border-white/10 bg-gradient-to-b from-zinc-900/50 to-zinc-950 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Başarı hikayeleri
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white">
            Marka görünürlüğü ve kampanya etkisi.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { sector: 'Turizm & Otel', title: 'Lüks otel lansmanı', reach: '2.4M', engagement: '%4.2', note: 'Influencer + basın entegrasyonu', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80' },
              { sector: 'Lifestyle', title: 'Premium marka kampanyası', reach: '1.8M', engagement: '%5.1', note: 'Celebrity iş birliği ve dijital PR', img: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=80' },
              { sector: 'Havacılık', title: 'Rota tanıtım projesi', reach: '3.1M', engagement: '%3.8', note: 'Medya + etkinlik yönetimi', img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&q=80' },
            ].map((c, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="relative aspect-square w-full">
                  <Image src={c.img} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-teal-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">{c.sector}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">{c.title}</h3>
                  <p className="mt-2 text-sm text-white">{c.note}</p>
                  <div className="mt-6 flex gap-6 border-t border-white/10 pt-4">
                    <div>
                      <p className="text-2xl font-bold text-white">{c.reach}</p>
                      <p className="text-xs text-white">Erişim</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-teal-300">{c.engagement}</p>
                      <p className="text-xs text-white">Etkileşim</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="border-b border-white/10 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-semibold text-white md:text-4xl">
            Sıkça sorulan sorular
          </h2>
          <div className="mt-12 space-y-4">
            {[
              { q: 'Hangi markalar için uygun?', a: 'Turizm, otel, havacılık, lifestyle, beauty, wellness ve premium tüketim markaları ile kurumsal firmalar. Görünürlük ve itibar hedefleyen her marka için uygundur.' },
              { q: 'Sadece influencer kampanyası mı yapılıyor?', a: 'Hayır. Influencer, celebrity, dijital PR, medya ilişkileri ve etkinlik yönetimini tek stratejide birleştiriyoruz.' },
              { q: 'Celebrity çalışmaları nasıl planlanıyor?', a: 'Marka uyumu ve hedef kitle örtüşmesine göre isim belirlenir. Sözleşme, kullanım hakları ve ölçümleme baştan netleştirilir.' },
              { q: 'PR ve dijital görünürlük birlikte kurgulanabiliyor mu?', a: 'Evet. Basın, online yayınlar ve sosyal kanallar tek kampanya çatısında yönetilir; mesaj ve ton tutarlı kalır.' },
              { q: 'Kampanya süresi nasıl belirleniyor?', a: 'Hedefe ve sektöre göre değişir. Kısa dönem lansmanlardan uzun dönem itibar projelerine kadar esnek süreçler sunuyoruz.' },
              { q: 'Raporlama yapılıyor mu?', a: 'Evet. Erişim, etkileşim, medya kapsamı ve marka etkisi düzenli raporlanır; sonuçlar ölçülebilir şekilde paylaşılır.' },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  <span className="text-teal-400">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="border-t border-white/10 px-6 py-4 text-sm text-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="relative border-b border-white/10 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 px-6 py-16 md:py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.15),_transparent_60%)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold text-white md:text-4xl">
            Markanızı görünürlükten etkiye taşıyın
          </h2>
          <p className="mt-4 text-lg text-white">
            Teklif alın veya strateji görüşmesi planlayın. Aşağıdaki formu doldurmanız yeterli.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="#form"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:opacity-95"
            >
              Teklif Al
            </Link>
            <Link
              href="#form"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10"
            >
              Strateji Görüşmesi Planla
            </Link>
          </div>
        </div>
      </section>

      {/* 9. CONTACT / LEAD FORM */}
      <section id="form" className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
            İletişim formu
          </h2>
          <p className="mt-2 text-center text-white">
            Teklif veya strateji görüşmesi için bilgilerinizi bırakın.
          </p>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 p-4 md:p-6">
            <iframe
              aria-label="Join-Form-Landing"
              frameBorder="0"
              style={{ height: 500, width: '99%', border: 'none' }}
              src="https://forms.joinpr.com.tr/joinus1/form/JoinFormLanding/formperma/I50RnMGr5e2CLfOswetbEV7jdQ_N9gkidjRZUcvnfl0"
              title="Join CRM Form"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FormField({
  label,
  type = 'text',
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
      />
    </div>
  );
}
