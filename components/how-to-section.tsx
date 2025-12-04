'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MathRenderer } from './math-renderer';

export function HowToSection() {
  const [isOpen, setIsOpen] = useState(false);

  const content = `
<h3>Welcome to the Exceptional Advent</h3>

<p>This calendar invites you on a journey through the mathematical structures underlying particle physics. Whether you're already familiar with octonions and exceptional algebras or encountering them for the first time, each day offers a self-contained exploration. Together, the 27 sheets tell one coherent story:</p>

<ul>
  <li>that the Standard Model and gravity can be seen as low-energy expressions of a more rigid exceptional structure, and</li>
  <li>that many familiar "facts" of particle physics look less arbitrary when viewed from this perspective.</li>
</ul>

<p>Think of this as an exploratory expedition rather than a final theorem. The goal is to reveal a plausible algebraic backbone beneath the seemingly arbitrary collection of particles, forces, and symmetries we observe in nature.</p>

<h3>The Journey Through Four Weeks</h3>

<p>Each Advent Sunday opens a new chapter in our story:</p>

<dl style="margin-left: 1rem;">
  <dt style="font-weight: bold; margin-top: 0.75rem;"><strong>First Sunday (today):</strong></dt>
  <dd style="margin-left: 1.5rem; margin-bottom: 0.75rem;">We introduce the octonionic stage, the group $G_2$ and triality, and explain why an $8$-dimensional, nonassociative number system is a natural candidate for internal degrees of freedom.</dd>

  <dt style="font-weight: bold; margin-top: 0.75rem;"><strong>Second Sunday:</strong></dt>
  <dd style="margin-left: 1.5rem; margin-bottom: 0.75rem;">We move to the Albert algebra $H_3(\\mathbb{O})$, the unified transport equation $D\\Psi=0$ and the idea that Dirac, Yang–Mills and Einstein equations can all be read as projections or consistency conditions of this single operator.</dd>

  <dt style="font-weight: bold; margin-top: 0.75rem;"><strong>Third Sunday:</strong></dt>
  <dd style="margin-left: 1.5rem; margin-bottom: 0.75rem;">We look at flavour: three generations, CKM and PMNS mixing, and how these structures appear as different charts on the same internal exceptional space.</dd>

  <dt style="font-weight: bold; margin-top: 0.75rem;"><strong>Fourth Sunday:</strong></dt>
  <dd style="margin-left: 1.5rem; margin-bottom: 0.75rem;">We step back and ask what kind of "attractor universe" is selected by this geometry, and how robust the picture is under deformations.</dd>
</dl>

<p>Between these Sunday milestones, weekday sheets dive into specific mechanisms, numerical examples, and thought experiments exploring alternative algebraic foundations.</p>

<h3>What Awaits You</h3>

<p>This calendar balances ambition with humility:</p>

<ul>
  <li><strong>Modest</strong>, because it does not pretend to deliver a full, rigorous theory with all details worked out. Many steps are presented at the level of structure and plausibility rather than polished theorems.</li>
  <li><strong>Ambitious</strong>, because it aims to show that a surprisingly small set of algebraic ingredients — octonions, $H_3(\\mathbb{O})$, an $\\mathfrak{so}(8)$-connection and a vacuum configuration $\\langle H\\rangle$ — can organise a large portion of what we know as the Standard Model plus gravity.</li>
</ul>

<p>You should <em>not</em> expect precise numeric predictions for every mass and mixing angle on these pages. What you can expect are:</p>

<ol>
  <li>clear structural links: why three generations, why particular charge assignments, why certain patterns of couplings;</li>
  <li>concrete numerical prototypes: explicit eigenvalue patterns from simple vacua in $H_3(\\mathbb{O})$;</li>
  <li>a comparative view: what is lost when we replace the exceptional algebras by more conventional ones.</li>
</ol>

<h3>For Whom Is This Written?</h3>

<p>These sheets bridge the gap between research papers and popular science:</p>

<ul>
  <li><strong>For specialists:</strong> You'll find connections to familiar mathematical structures—Lie groups, representation theory, spectral geometry—presented in a new light.</li>
  <li><strong>For curious outsiders:</strong> Technical details serve as guideposts, not barriers. Follow the conceptual thread and discover how exceptional mathematics might organize our physical reality.</li>
</ul>

<p>Each sheet includes references to the research literature. These are optional reading—the calendar stands on its own—but they're there if you want to explore the connections to mainstream work in division algebras, Jordan algebras, and noncommutative geometry.</p>

<h3>An Invitation to Explore</h3>

<p>This calendar is a beginning, not an endpoint. Many questions remain open:</p>

<ul>
  <li>How unique is the proposed exceptional backbone?</li>
  <li>How far can numerical predictions match experimental data?</li>
  <li>Which aspects survive the transition to quantum theory?</li>
</ul>

<p>If by December 31st you find yourself pondering these questions, considering new connections, or simply seeing the Standard Model through fresh eyes, then this advent journey has succeeded.</p>
  `;

  return (
    <div className="my-8">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-between px-5 py-3 rounded-lg shadow-md transition-all"
        style={{ 
          backgroundColor: 'rgba(0, 102, 51, 0.15)',
          border: '1px solid rgba(0, 102, 51, 0.3)',
          color: '#003366'
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </motion.div>
          <span className="text-lg font-medium">Guide to the Calendar</span>
        </div>
        <div className="text-sm opacity-70">
          {isOpen ? 'Hide' : 'Read more'}
        </div>
      </motion.button>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div 
              className="mt-4 p-8 rounded-lg shadow-xl"
              style={{ 
                backgroundColor: '#FFFFFF',
                border: '3px solid rgba(0, 102, 51, 0.8)'
              }}
            >
              <div className="prose prose-lg max-w-none">
                <MathRenderer content={content} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
