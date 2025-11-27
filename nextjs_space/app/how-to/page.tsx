'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { MathRenderer } from '@/components/math-renderer';
import { Snowflakes } from '@/components/snowflakes';

export default function HowToPage() {
  const content = `
### How to read this Advent calendar

This Advent calendar is written for readers who are comfortably fluent in theoretical physics and mathematics, but who may or may not have worked with octonions and exceptional algebras before. Each day is a self-contained sheet, but together they tell a single story:

- that the Standard Model and gravity can be seen as low-energy expressions of a more rigid exceptional structure, and
- that many familiar "facts" of particle physics look less arbitrary when viewed from this perspective.

You do *not* need to accept every step as "the" final truth to benefit from the journey. The purpose is to make plausible that there is a coherent algebraic backbone behind the zoo of fields, couplings and generations.

### Structure of the four weeks

The four Advent Sundays mark the main milestones:

**First Sunday:** We introduce the octonionic stage, the group $G_2$ and triality, and explain why an $8$-dimensional, nonassociative number system is a natural candidate for internal degrees of freedom.

**Second Sunday:** We move to the Albert algebra $H_3(\\mathbb{O})$, the unified transport equation $D\\Psi=0$ and the idea that Dirac, Yang–Mills and Einstein equations can all be read as projections or consistency conditions of this single operator.

**Third Sunday:** We look at flavour: three generations, CKM and PMNS mixing, and how these structures appear as different charts on the same internal exceptional space.

**Fourth Sunday:** We step back and ask what kind of "attractor universe" is selected by this geometry, and how robust the picture is under deformations.

In between the Sundays, the weekday sheets focus on specific mechanisms, numerical prototypes and "what-if" universes based on alternative algebras.

### What you can expect (and what not)

This calendar is intentionally modest and ambitious at the same time:

- **Modest**, because it does not pretend to deliver a full, rigorous theory with all details worked out. Many steps are presented at the level of structure and plausibility rather than polished theorems.
- **Ambitious**, because it aims to show that a surprisingly small set of algebraic ingredients — octonions, $H_3(\\mathbb{O})$, an $\\mathfrak{so}(8)$-connection and a vacuum configuration $\\langle H\\rangle$ — can organise a large portion of what we know as the Standard Model plus gravity.

You should *not* expect precise numeric predictions for every mass and mixing angle on these pages. What you can expect are:

1. clear structural links: why three generations, why particular charge assignments, why certain patterns of couplings;
2. concrete numerical prototypes: explicit eigenvalue patterns from simple vacua in $H_3(\\mathbb{O})$;
3. a comparative view: what is lost when we replace the exceptional algebras by more conventional ones.

### Who this is written for

These sheets deliberately sit in between a technical paper and a popular article:

- If you are a working physicist or mathematician, you will find enough structure to connect the ideas to your own toolbox: Lie groups, representation theory, spectral geometry, operator algebras.
- If you come from a neighbouring field, you might treat the technical points as signposts rather than obstacles, and focus on the emerging picture: a universe whose internal order is exceptional in a very literal sense.

References at the bottom of each sheet point to the underlying literature. You do not need to read them to follow the calendar, but they are there if you want to see how the pieces connect to mainstream work on division algebras, Jordan algebras and noncommutative geometry.

### An invitation rather than a conclusion

Finally, this Advent calendar should be read as an invitation, not as a finished doctrine. There are many open questions:

- How unique is the proposed exceptional backbone?
- How far can the numerical fits to real-world data be pushed?
- Which aspects of the nonassociative structure survive quantisation?

If, by Christmas, you feel that these questions are worth spending serious time on, the calendar has achieved its goal.
  `;

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
              Advent Calendar 2025
            </h1>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', color: '#FFD700' }}
            >
              <Home className="w-5 h-5" />
              <span>Back to Calendar</span>
            </Link>
          </div>
          <h2 className="text-2xl font-semibold" style={{ color: '#B3001B', fontFamily: '"Times New Roman", Times, serif' }}>
            An exceptional algebraic walk through particle physics
          </h2>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-8 shadow-2xl"
          style={{ border: '3px solid rgba(0, 102, 51, 0.8)' }}
        >
          <div className="advent-content prose prose-lg max-w-none" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            <MathRenderer content={content} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
