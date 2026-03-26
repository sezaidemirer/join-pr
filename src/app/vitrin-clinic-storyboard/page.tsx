import type { Metadata } from 'next';

type StoryFrame = {
  frame: string;
  scene: string;
  plan: string;
  title: string;
  detail: string;
  script?: string;
};

const frames: StoryFrame[] = [
  {
    frame: '01',
    scene: 'Sahne 1',
    plan: 'Plan 1',
    title: 'VIP varis anı',
    detail:
      'Siyah VIP arac kapisi acilir. Didem guven veren bir host esliginde iner; premium karsilama duygusu kurulur.',
    script: "There's always that one person you trust... Welcome to Vitrin Clinic.",
  },
  {
    frame: '02',
    scene: 'Sahne 1',
    plan: 'Plan 2',
    title: 'Klinige yaklasma',
    detail:
      'Didem cam cepheli ana girise dogru yurur. Klinik tabelasi ve mimari net gorunur; on cepheden giris etkisi verilir.',
  },
  {
    frame: '03',
    scene: 'Sahne 1',
    plan: 'Plan 3',
    title: 'Hizmet yelpazesi voiceover',
    detail:
      'Estetik gulus tasarimi, beyazlatma ve restoratif tedaviler tek dilde anlatilir. Teknoloji + sanat + hassasiyet vurgusu.',
    script:
      'Every procedure is planned specifically for you, bringing together precision, technology, and artistry.',
  },
  {
    frame: '04',
    scene: 'Sahne 1',
    plan: 'Plan 4',
    title: 'Lobi ve premium bekleme',
    detail:
      'Otomatik cam kapilar acilir; icerde hareketli bir hasta trafigi gorulur. Sicak isik, lounge atmosferi ve konfor on planda.',
  },
  {
    frame: '05',
    scene: 'Sahne 2',
    plan: 'Plan 1',
    title: 'Konforlu bekleyis',
    detail:
      'Didem rahat bir koltukta dergi/brosur inceler. Kamera konforu, sakinligi ve guveni destekleyecek kadraj kullanir.',
  },
  {
    frame: '06',
    scene: 'Sahne 3',
    plan: 'Plan 1',
    title: 'Akis gecisi',
    detail: 'Hasta yolculuguna giris oncesi yumusak gecis plani; mekan kimligi korunur.',
  },
  {
    frame: '07',
    scene: 'Sahne 4',
    plan: 'Plan 1',
    title: 'Danisma diyaloğu',
    detail:
      'Hasta X asistanla iletisimde. Didem anlatida donusum hikayelerine odaklanir: ozguvenle gulumseme.',
    script: 'Seeing our patients smile with confidence is what matters most.',
  },
  {
    frame: '08',
    scene: 'Sahne 4',
    plan: 'Plan 2',
    title: 'On goru hissi',
    detail:
      'Tedaviye baslamadan once olasi gulus sonucunu ongorme hissi anlatilir; guven duygusu artirilir.',
    script: 'There is ease in anticipating how your smile may look before treatment.',
  },
  {
    frame: '09',
    scene: 'Sahne 5',
    plan: 'Plan 1',
    title: 'Koridor akisi',
    detail: 'Hasta X asistanla koridorda ilerler. Didem arka planda gorunur; devamlilik etkisi saglanir.',
  },
  {
    frame: '10',
    scene: 'Sahne 5',
    plan: 'Plan 2',
    title: 'Hekim odasi girisi',
    detail: 'Bashekim odasi girisinde karar anina gecis kurulumu.',
  },
  {
    frame: '11',
    scene: 'Sahne 6',
    plan: 'Plan 1',
    title: 'Genis aci konusma',
    detail: 'Hasta X diyalogu genis acida; ekip uyumu ve sakin klinik dili korunur.',
  },
  {
    frame: '12',
    scene: 'Sahne 7',
    plan: 'Plan 1',
    title: 'Tedaviye gecis',
    detail: 'Muayene odasina baglanan gecis plani; hijyen ve teknolojiye hazirlik.',
  },
  {
    frame: '13',
    scene: 'Sahne 8',
    plan: 'Plan 1',
    title: 'Muayene + dijital ekran',
    detail:
      'Hasta dental koltukta incelenir. Yandaki dijital goruntuler teknoloji ve tanisal netligi destekler.',
  },
  {
    frame: '14',
    scene: 'Sahne 9',
    plan: 'Plan 1',
    title: 'X-ray / imaging',
    detail: 'Goruntuleme asamasi ile tedavi planinin bilimsel zemini anlatilir.',
  },
  {
    frame: '15',
    scene: 'Sahne 10',
    plan: 'Plan 1',
    title: 'Sinematik tedavi kadraji',
    detail: 'Gun isigi ve genis mekan kadrajiyla hasta konforu ve profesyonellik birlikte verilir.',
  },
  {
    frame: '16',
    scene: 'Sahne 11',
    plan: 'Plan 1',
    title: 'Hekimler arasi degerlendirme',
    detail: 'Doktorlar hastayi ve yöntemi birlikte degerlendirir; ekip uzmanligi gorunur.',
    script: 'No more anxiety. Every step is precise and comfortable.',
  },
  {
    frame: '17',
    scene: 'Sahne 12',
    plan: 'Plan 1',
    title: 'Hasta-hekim diyalogu',
    detail: 'Muzik altyapisinda guven veren iletisim; surecin insani yonu.',
  },
  {
    frame: '18',
    scene: 'Sahne 13',
    plan: 'Plan 1',
    title: 'Tedavi sonucu hazirlik',
    detail: 'Donusum noktasina baglanan duygusal ritim; finale gecis.',
  },
  {
    frame: '19',
    scene: 'Sahne 14',
    plan: 'Plan 1',
    title: 'Aynada ilk gulumseme',
    detail: 'Hasta aynada yeni gulusunu gorur. Memnuniyet ve ozguvenin ilk reaksiyonu yakalanir.',
  },
  {
    frame: '20',
    scene: 'Sahne 14',
    plan: 'Plan 2',
    title: 'Teras + Vitrin Cafe',
    detail:
      'Tedavi sonrasi dinlenme: klinik icindeki teras ve cafe deneyimi. Konfor yalnizca tedavide degil, tum yolculukta.',
  },
  {
    frame: '21',
    scene: 'Sahne 15-18',
    plan: 'Plan 1',
    title: 'Studio + AfterCare anlatisi',
    detail:
      'Yeni gulusu studioda kaydetme ve klinik sonrasi sureklilik icin AfterCare destegi birlikte verilir.',
    script: 'Your journey continues even after you leave.',
  },
  {
    frame: '22',
    scene: 'Final',
    plan: 'Sahne 19',
    title: 'Kapanis',
    detail: 'Didem kameraya sicak bir final cumlesiyle kapanis verir: guven hissi ana mesaj olur.',
    script: 'Vitrin Clinic... the place where you feel safe.',
  },
];

const moodboard = [
  {
    title: 'Styling / Hair / Makeup',
    points: [
      'Natural glow skin, temiz ve premium gorunum',
      'Soft wave veya duz parlak sac; klinik estetikle uyumlu',
      'Neutral tonlar + kamera dostu dokular',
    ],
  },
  {
    title: 'Costume & Accessory',
    points: [
      'Smart chic siluet: yalın ama guclu durus',
      'Minimal aksesuar: odakta ifade ve gulumseme',
      'Beyaz, bej, antrasit ve yumusak gold detaylar',
    ],
  },
  {
    title: 'Visual Tone',
    points: [
      'High-key klinik isik + sinematik gecis',
      'Teknoloji, hijyen, konfor ve guven dengesi',
      'Finalde duygusal ama premium kapanis',
    ],
  },
];

const pdfPages = Array.from({ length: 10 }, (_, idx) => ({
  label: `Sayfa ${idx + 1}`,
  src: `/vitrin-clinic-storyboard/page-${String(idx + 1).padStart(2, '0')}.jpg`,
}));

export const metadata: Metadata = {
  title: 'Vitrin Clinic Storyboard',
  description: 'Vitrin Clinic Story Board & Moodboard - TR dijital sunum sayfasi.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VitrinClinicStoryboardPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-100">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/40 p-8 text-center">
          <img src="/join_pr_logo_offical2.png" alt="Join PR" className="mx-auto mb-5 h-10 w-auto opacity-95" />
          <p className="text-xs uppercase tracking-[0.28em] text-zinc-400">Mood & Story Board</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-5xl">Vitrin Clinic</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm text-zinc-300 md:text-base">
            Bu ozel URL, PDF icerigini modern web sunumuna donusturur. Akis; varis anindan tedavi
            deneyimine, after-care surecine ve final mesaja kadar tum hikaye omurgasini kapsar.
          </p>
        </header>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold">Orijinal PDF Sayfalari</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">10 sayfa</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pdfPages.map((page) => (
              <a
                key={page.src}
                href={page.src}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 transition hover:border-sky-600/60"
              >
                <img
                  src={page.src}
                  alt={page.label}
                  className="h-[360px] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <p className="border-t border-zinc-800 px-4 py-2 text-sm text-zinc-300">{page.label}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold">Storyboard Akisi</h2>
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-400">{frames.length} frame</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {frames.map((item) => (
              <article
                key={item.frame}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-sky-600/60 hover:bg-zinc-900/70"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                  Frame {item.frame} - {item.scene} - {item.plan}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">{item.detail}</p>
                {item.script ? (
                  <blockquote className="mt-3 rounded-lg border border-zinc-700 bg-zinc-950/60 p-3 text-xs text-zinc-200">
                    &quot;{item.script}&quot;
                  </blockquote>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Moodboard Katmanlari</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {moodboard.map((block) => (
              <article key={block.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="text-base font-semibold">{block.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                  {block.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
          <h2 className="text-xl font-semibold">Final Mesaj</h2>
          <p className="mx-auto mt-3 max-w-3xl text-zinc-300">
            &quot;Vitrin Clinic... the place where you feel safe.&quot; Cikis cümlesi; marka algisinda guven,
            konfor ve estetik sonucu tek cizgide birlestirir.
          </p>
        </section>
      </div>
    </main>
  );
}

