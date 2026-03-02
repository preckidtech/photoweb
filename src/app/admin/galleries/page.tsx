import { createGallery } from "./action";

/**
 * This page allows Benedicta to generate new private 
 * vaults for her photography clients.
 */
export default function AdminGalleries() {
  return (
    <div className="max-w-4xl">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-brandBlue">Client Vaults</h1>
        <p className="text-slate-400 text-sm mt-2 uppercase tracking-widest">Manage security and access</p>
      </header>

      {/* Creation Form */}
      <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm max-w-md">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Create New Vault</h2>
        <form action={createGallery} className="space-y-4">
          <input 
            name="name" 
            placeholder="Client or Event Name" 
            className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brandBlue outline-none"
            required
          />
          <input 
            name="password" 
            type="text" 
            placeholder="Set Access Passcode" 
            className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brandBlue outline-none font-mono"
            required
          />
          <button className="w-full py-4 bg-brandBlue text-white font-bold rounded-xl shadow-lg hover:bg-opacity-90 transition-all">
            Generate Vault
          </button>
        </form>
      </section>
    </div>
  );
}