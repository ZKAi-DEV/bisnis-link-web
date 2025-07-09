import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4">
      {/* Header: Foto Profil & Nama */}
      <div className="flex flex-col items-center mt-8 mb-4">
        <Image
          src="/zk (2).png" // Ganti dengan logo baru
          alt="Zkai Studios Logo"
          width={80}
          height={80}
          className="rounded-full border-4 border-pink-200 shadow-md"
        />
        <h1 className="mt-4 text-xl font-bold text-gray-800">@zkaistudios</h1>
        <p className="text-center text-gray-600 mt-2 max-w-xs">
          Halo teman-teman, selamat datang di halaman web Zkai Studios. Abadikan momenmu, cek juga layanan dan portofolio kami!
        </p>
        {/* Ikon Media Sosial */}
        <div className="flex gap-4 mt-3">
          <a href="https://www.instagram.com/saya_humoris" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:scale-110 transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" width={28} height={28} />
          </a>
          <a href="https://www.tiktok.com/@bekyfttiktok?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:scale-110 transition">
            <img src="https://static.cdnlogo.com/logos/t/60/tiktok.svg" alt="TikTok" width={28} height={28} />
          </a>
          <a href="https://www.youtube.com/@YusufUbaidilahMustain" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:scale-110 transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" alt="YouTube" width={28} height={28} />
          </a>
        </div>
      </div>

      {/* Tombol Pilihan */}
      <div className="flex flex-col gap-4 w-full max-w-md mt-6">
        <a
          href="https://wa.me/6285712354914?text=Halo%20Zkai%20Studios%2C%20saya%20tertarik%20dengan%20jasa%20Anda!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-green-200 hover:bg-green-300 transition rounded-xl p-4 shadow group"
        >
          <div className="flex items-center gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width={32} height={32} />
            <span className="font-semibold text-green-900">WhatsApp</span>
          </div>
          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Chat</span>
        </a>
        <a
          href="https://zkaistudio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-blue-200 hover:bg-blue-300 transition rounded-xl p-4 shadow group"
        >
          <div className="flex items-center gap-3">
            <Image src="/zk (2).png" alt="Zkai Studios" width={32} height={32} />
            <span className="font-semibold text-blue-900">Zkai Studios</span>
          </div>
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Website</span>
        </a>
        <a
          href="https://hamarnabumbon.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-yellow-100 hover:bg-yellow-200 transition rounded-xl p-4 shadow group"
        >
          <div className="flex items-center gap-3">
            <Image src="/bumbon.svg" alt="Hamarna Bumbon" width={32} height={32} />
            <span className="font-semibold text-yellow-900">Hamarna Bumbon</span>
          </div>
          <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Website</span>
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-xs text-gray-500">
        <div>Dibuat oleh Zkai Studios &copy; 2024</div>
        <div>Lisensi: Creative Commons BY-NC-SA</div>
        <a
          href="/login"
          className="inline-block mt-2 px-4 py-2 rounded bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition"
        >
          Ingin membuat web seperti ini?
        </a>
      </footer>
    </div>
  );
}
