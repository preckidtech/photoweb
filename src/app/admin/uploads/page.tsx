import { uploadPhotos } from "./action";

/**
 * Senior Engineering: This page provides Benedicta with a dedicated
 * interface for bulk-uploading original photography assets.
 */
export default function AdminUploads() {
  return (
    <div className="max-w-4xl">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-brandBlue">Asset Injection</h1>
        <p className="text-slate-400 text-sm mt-2 uppercase tracking-widest">Upload original high-res files</p>
      </header>

      <section className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-slate-100 shadow-sm text-center">
        <form action={uploadPhotos} className="flex flex-col items-center gap-6">
          {/* Gallery ID Selection (For now, a simple text input) */}
          <div className="w-full max-w-xs space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-widest">Target Gallery ID</label>
            <input 
              name="galleryId" 
              placeholder="Paste Gallery UUID" 
              className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brandBlue outline-none"
              required
            />
          </div>

          <div className="w-full py-20 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center gap-4 group hover:bg-slate-100 transition-colors cursor-pointer relative">
            <svg className="w-12 h-12 text-slate-300 group-hover:text-brandBlue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-sm font-medium text-slate-500">Drag images here or click to browse</p>
            <input 
              type="file" 
              name="files" 
              multiple 
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              required
            />
          </div>

          <button className="px-12 py-4 bg-brandBlue text-white font-bold rounded-full shadow-xl hover:bg-opacity-90 transition-all active:scale-95">
            Begin Secure Upload
          </button>
        </form>
      </section>
    </div>
  );
}