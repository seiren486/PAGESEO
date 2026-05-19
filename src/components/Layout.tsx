import { Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Top AppBar */}
      <header className="h-16 flex items-center justify-between px-6 md:px-12 bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <h1 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            SEO Manager
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container font-label-bold text-label-bold py-2 px-4 rounded-lg transition-colors shadow-sm text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            다시 업로드 하기
          </button>
          
          <button className="flex items-center justify-center gap-2 bg-primary-container text-on-primary font-label-bold text-label-bold py-2 px-4 rounded-lg hover:brightness-95 transition-colors shadow-sm text-sm">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            생성하기
          </button>
        </div>
      </header>

      {/* Main Canvas - Full width center layout */}
      <main className="flex-1 p-4 md:p-container-margin overflow-y-auto flex justify-center w-full">
        <Outlet />
      </main>
    </div>
  );
}
