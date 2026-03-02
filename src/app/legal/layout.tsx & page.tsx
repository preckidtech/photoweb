"use client";

import { motion } from "framer-motion";

/**
 * Senior Engineering: This page provides the legal foundation for the brand.
 * It uses a high-readability layout to ensure clients understand their 
 * rights regarding image usage and privacy (NFR-201).
 */
export default function LegalPage() {
  const sections = [
    {
      title: "Intellectual Property",
      content: "All images captured by Benedicta Okhunlun remain the sole intellectual property of the photographer. Clients are granted a personal usage license for printing and social sharing. Commercial redistribution without written consent is strictly prohibited."
    },
    {
      title: "Data & Privacy",
      content: "We utilize industry-standard Bcrypt encryption for all private vaults. Your personal data and high-resolution assets are stored in secure, private cloud environments and are never shared with third-party advertisers."
    },
    {
      title: "Delivery & Archiving",
      content: "Digital vaults are guaranteed for 12 months from the date of the event. While we maintain redundant backups, clients are encouraged to download and back up their original assets locally upon delivery."
    }
  ];

  return (
    <div className="min-h-screen bg-brandWhite pt-40 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 border-b border-slate-200 pb-10"
        >
          <h1 className="text-4xl font-light text-brandBlue tracking-tight">Legal & Privacy</h1>
          <p className="text-slate-400 mt-4 uppercase tracking-[0.3em] text-[10px] font-bold">
            Terms of Service & Usage Agreements
          </p>
        </motion.div>

        {/* CONTENT */}
        <div className="space-y-16">
          {sections.map((section, index) => (
            <motion.section 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <h2 className="text-xs font-bold uppercase tracking-widest text-brandBlue mb-6 group-hover:translate-x-2 transition-transform">
                {section.title}
              </h2>
              <p className="text-slate-500 font-light leading-relaxed text-lg">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        {/* FOOTER CALL-TO-ACTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-24 p-10 bg-white rounded-[2.5rem] border border-slate-50 shadow-sm text-center"
        >
          <p className="text-sm text-slate-400 font-light mb-6">
            Have specific questions about your licensing?
          </p>
          <a 
            href="mailto:legal@benedicta.com"
            className="text-xs font-bold uppercase tracking-widest text-brandBlue hover:underline"
          >
            Contact Legal Desk
          </a>
        </motion.div>
      </div>
    </div>
  );
}