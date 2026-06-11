export default function ContactPage() {
  return (
    <main className="min-h-screen pt-[120px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-primary mb-12">اتصل بنا</h1>
        <div className="max-w-2xl mx-auto bg-background-secondary p-8 md:p-10 rounded-2xl border border-primary/20">
          <form className="flex flex-col gap-6">
            <input 
              type="text" 
              placeholder="الاسم" 
              className="w-full p-4 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              className="w-full p-4 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
            <textarea 
              placeholder="رسالتك" 
              rows="5" 
              className="w-full p-4 bg-background border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
            ></textarea>
            <button className="btn-primary mt-2" type="button">إرسال</button>
          </form>
        </div>
      </div>
    </main>
  );
}
