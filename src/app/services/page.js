export default function ServicesPage() {
  const services = [
    { title: 'أفلام الحماية PPF', desc: 'حماية متكاملة لطلاء السيارة من الخدوش والعوامل الجوية.' },
    { title: 'العناية الداخلية (حمام داخلي)', desc: 'تنظيف عميق وتعقيم لمقصورة السيارة.' },
    { title: 'نانو سيراميك', desc: 'طبقة حماية زجاجية تمنح سيارتك لمعاناً دائماً.' },
    { title: 'عازل حراري', desc: 'حماية من أشعة الشمس وتقليل حرارة المقصورة.' },
    { title: 'بوليش (تلميع)', desc: 'إزالة الخدوش السطحية واستعادة لمعان الوكالة.' },
    { title: 'غسيل VIP', desc: 'غسيل تفصيلي يشمل جميع أجزاء السيارة بدقة عالية.' },
    { title: 'تجديد النيكل', desc: 'استعادة بريق وتألق قطع النيكل الخارجية والداخلية.' }
  ];

  return (
    <main className="min-h-screen pt-[120px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-primary mb-12">خدماتنا</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div key={idx} className="bg-background-secondary p-8 rounded-xl border border-primary/20 hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-bold text-primary mb-4">{srv.title}</h3>
              <p className="text-text-muted leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
