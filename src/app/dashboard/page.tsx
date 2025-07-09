"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";

const menuList = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "edit", label: "Edit Profil", icon: "✏️" },
  { key: "statistik", label: "Statistik", icon: "📊" },
  { key: "pengaturan", label: "Pengaturan", icon: "⚙️" },
  { key: "support", label: "Support", icon: "💬" },
  { key: "logout", label: "Logout", icon: "🚪" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true); // expanded by default on desktop
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Edit Profil State
  const [editNama, setEditNama] = useState("");
  const [editTanggalLahir, setEditTanggalLahir] = useState("");
  const [editFoto, setEditFoto] = useState("");
  const [editKelamin, setEditKelamin] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getUserAndProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        setUser(userData.user);
        // Ambil profil dari tabel profiles
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();
        setProfile(profileData);
        // Set state edit profil
        setEditNama(profileData?.nama || "");
        setEditTanggalLahir(profileData?.tanggal_lahir || "");
        setEditFoto(profileData?.foto || "");
        setEditKelamin(profileData?.kelamin || "");
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    getUserAndProfile();
  }, [router]);

  // Close mobile sidebar if click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setMobileSidebar(false);
      }
    }
    if (mobileSidebar) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileSidebar]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleMenuClick = (key: string) => {
    setMobileSidebar(false);
    if (key === "logout") {
      handleLogout();
    } else {
      setSelectedMenu(key);
    }
  };

  // Edit Profil Handler
  const handleEditProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    console.log("user.id", user.id);
    await supabase.from("profiles").upsert({
      id: user.id,
      nama: editNama,
      tanggal_lahir: editTanggalLahir,
      foto: editFoto,
      kelamin: editKelamin,
    });
    setSaving(false);
    setProfile({
      ...profile,
      nama: editNama,
      tanggal_lahir: editTanggalLahir,
      foto: editFoto,
      kelamin: editKelamin,
    });
    setSelectedMenu("dashboard"); // Kembali ke dashboard setelah edit
  };

  // Upload foto profil ke Supabase Storage
  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const fileExt = file.name.split('.')?.pop();
    const fileName = `profile-${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });
    if (error) {
      alert('Upload gagal: ' + error.message);
      setUploading(false);
      return;
    }
    // Ambil public URL
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    setEditFoto(urlData.publicUrl);
    setUploading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-pink-100 to-white">
      {/* Hamburger for mobile & desktop */}
      <button
        className="fixed top-4 left-4 z-30 bg-white rounded-full shadow p-2 text-2xl text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
        onClick={() => setMobileSidebar(true)}
        aria-label="Buka menu"
      >
        &#9776;
      </button>
      {/* Sidebar for desktop */}
      <aside
        className={`hidden md:flex flex-col py-8 px-2 gap-2 min-h-screen bg-white shadow-lg transition-all duration-200 ${sidebarOpen ? "w-56" : "w-16"}`}
      >
        <button
          className="flex items-center justify-center mb-8 w-full"
          onClick={() => setSidebarOpen((v) => !v)}
          aria-label="Toggle sidebar"
        >
          <span className="text-pink-500 text-2xl">&#9776;</span>
          {sidebarOpen && <span className="ml-2 font-bold text-pink-500 text-2xl">Menu</span>}
        </button>
        {menuList.map((menu) => (
          <button
            key={menu.key}
            onClick={() => handleMenuClick(menu.key)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left font-medium transition mb-1 w-full ${selectedMenu === menu.key ? "bg-pink-100 text-pink-600" : "text-gray-700 hover:bg-gray-100"} ${menu.key === "logout" ? "mt-auto text-red-500 hover:bg-red-100" : ""}`}
          >
            <span className="text-xl w-6 text-center">{menu.icon}</span>
            <span className={`transition-all duration-200 ${sidebarOpen ? "inline" : "hidden"}`}>{menu.label}</span>
          </button>
        ))}
      </aside>
      {/* Sidebar for mobile (drawer) */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/20" />
          {/* Sidebar */}
          <aside
            ref={sidebarRef}
            className="relative z-50 w-56 bg-white shadow-lg flex flex-col py-8 px-4 gap-2 min-h-full animate-slide-in-left"
          >
            <div className="flex items-center justify-between mb-8 text-center text-xl">
              <span className="font-bold text-pink-500">Menu</span>
              <button
                className="ml-2 bg-white rounded-full shadow p-1 text-xl text-gray-700 hover:bg-gray-100 focus:outline-none"
                onClick={() => setMobileSidebar(false)}
                aria-label="Tutup menu"
              >
                &#10005;
              </button>
            </div>
            {menuList.map((menu) => (
              <button
                key={menu.key}
                onClick={() => handleMenuClick(menu.key)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left font-medium transition mb-1 w-full ${selectedMenu === menu.key ? "bg-pink-100 text-pink-600" : "text-gray-700 hover:bg-gray-100"} ${menu.key === "logout" ? "mt-auto text-red-500 hover:bg-red-100" : ""}`}
              >
                <span className="text-xl w-6 text-center">{menu.icon}</span>
                <span>{menu.label}</span>
              </button>
            ))}
          </aside>
        </div>
      )}
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-start p-4 md:p-8 transition-all duration-200 md:ml-0" style={{ marginLeft: sidebarOpen ? 224 : 64 }}>
        <div className="bg-white rounded-xl shadow-lg w-full p-4 md:p-8 min-h-[300px] flex flex-col items-center ml-0">
          {selectedMenu === "dashboard" && (
            <>
              <h1 className="text-2xl font-bold mb-2 text-center">
                Selamat datang, {profile?.nama ? profile.nama : (user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email)}!
              </h1>
              <p className="mb-6 text-center text-gray-600">Yuk, mulai bikin project landing page/web kamu sendiri.</p>
              <button className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow mb-8 transition">Bikin Project</button>
              <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 mt-2">
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-2">📝</span>
                  <span className="text-sm text-gray-700 text-center">1. Isi data project<br/>(nama, link, dsb)</span>
                </div>
                <span className="text-2xl text-gray-400 hidden md:block">→</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-2">🎨</span>
                  <span className="text-sm text-gray-700 text-center">2. Pilih tema & warna</span>
                </div>
                <span className="text-2xl text-gray-400 hidden md:block">→</span>
                <div className="flex flex-col items-center">
                  <span className="text-4xl mb-2">🚀</span>
                  <span className="text-sm text-gray-700 text-center">3. Publish & bagikan link</span>
                </div>
              </div>
              <div className="w-full flex flex-col items-center mt-8 min-h-[120px]">
                {/* Tempat untuk gambar/foto step by step tambahan */}
              </div>
            </>
          )}
          {selectedMenu === "edit" && (
            <>
              <h1 className="text-2xl font-bold mb-4">Edit Profil</h1>
              <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleEditProfil}>
                <label className="flex flex-col gap-1">
                  Nama Lengkap
                  <input type="text" className="border rounded px-3 py-2" value={editNama} onChange={e => setEditNama(e.target.value)} required />
                </label>
                <label className="flex flex-col gap-1">
                  Tanggal Lahir
                  <input type="date" className="border rounded px-3 py-2" value={editTanggalLahir} onChange={e => setEditTanggalLahir(e.target.value)} required />
                </label>
                <label className="flex flex-col gap-1">
                  Foto Profil
                  {editFoto && (
                    <img src={editFoto} alt="Foto Profil" className="w-20 h-20 rounded-full object-cover mb-2" />
                  )}
                  <input type="file" accept="image/*" onChange={handleFotoChange} />
                  {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
                </label>
                <label className="flex flex-col gap-1">
                  Jenis Kelamin
                  <select className="border rounded px-3 py-2" value={editKelamin} onChange={e => setEditKelamin(e.target.value)} required>
                    <option value="">Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </label>
                <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded transition" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </form>
            </>
          )}
          {selectedMenu === "statistik" && (
            <>
              <h1 className="text-2xl font-bold mb-4">Statistik</h1>
              <div className="text-gray-500">(Fitur statistik klik link coming soon)</div>
            </>
          )}
          {selectedMenu === "pengaturan" && (
            <>
              <h1 className="text-2xl font-bold mb-4">Pengaturan</h1>
              <div className="text-gray-500">(Fitur pengaturan tema/warna coming soon)</div>
            </>
          )}
          {selectedMenu === "support" && (
            <>
              <h1 className="text-2xl font-bold mb-4">Support</h1>
              <div className="text-gray-500">(Fitur support/kontak coming soon)</div>
            </>
          )}
        </div>
      </main>
      <style jsx global>{`
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.2s ease;
        }
      `}</style>
    </div>
  );
} 