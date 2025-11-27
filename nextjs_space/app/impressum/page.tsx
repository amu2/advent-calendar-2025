'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Snowflakes } from '@/components/snowflakes';

export default function ImpressumPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #003366 0%, #006633 100%)' }}>
      <Snowflakes />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold" style={{ color: '#FFD700', fontFamily: '"Times New Roman", Times, serif' }}>
              Impressum
            </h1>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', color: '#FFD700' }}
            >
              <Home className="w-5 h-5" />
              <span>Zurück zum Kalender</span>
            </Link>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-8 shadow-2xl"
          style={{ border: '3px solid rgba(0, 102, 51, 0.8)' }}
        >
          <div style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#003366' }}>Angaben gemäß § 5 TMG</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#006633' }}>Verantwortlich für den Inhalt</h3>
                <div className="text-gray-700 leading-relaxed space-y-1">
                  <p>Prof. Dr. Andreas Müller</p>
                  <p>Hochschule Kempten</p>
                  <p>Fakultät für Elektrotechnik</p>
                  <p>Bahnhofstraße 61</p>
                  <p>87435 Kempten (Allgäu)</p>
                  <p>Deutschland</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#006633' }}>Kontakt</h3>
                <div className="text-gray-700 leading-relaxed space-y-1">
                  <p>E-Mail: andreas.mueller@hs-kempten.de</p>
                  <p>Telefon: +49 (0)831 2523-0</p>
                  <p>Website: <a href="https://www.hs-kempten.de" className="text-blue-600 hover:underline">www.hs-kempten.de</a></p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#006633' }}>Haftungsausschluss</h3>
                
                <h4 className="font-semibold mt-4 mb-2">Haftung für Inhalte</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Haftung für Links</h4>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                </p>

                <h4 className="font-semibold mt-4 mb-2">Urheberrecht</h4>
                <p className="text-gray-700 leading-relaxed">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#006633' }}>Datenschutz</h3>
                <p className="text-gray-700 leading-relaxed">
                  Die Nutzung dieser Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf diesen Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
                </p>
              </div>

              <div className="text-sm text-gray-500 mt-8 pt-4 border-t">
                <p>Stand: November 2025</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
