'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MathRenderer } from './math-renderer';

export function HowToSection() {
  const [isOpen, setIsOpen] = useState(false);

  const content = `
## How to read this Advent calendar

This Advent calendar is written for readers who are comfortably fluent in theoretical physics and mathematics, but who may or may not have worked with octonions and exceptional algebras before. Each day is a self-contained sheet, but together they tell a single story:

- that the Standard Model and gravity can be seen as low-energy expressions of a more rigid exceptional structure, and
- that many familiar "facts" of particle physics look less arbitrary when viewed from this perspective.

You do *not* need to accept every step as "the" final truth to benefit from the journey. The purpose is to make plausible that there is a coherent algebraic backbone behind the zoo of fields, couplings and generations.

## Structure of the four weeks

The four Advent Sundays mark the main milestones:

**First Sunday:** We introduce the octonionic stage, the group $G_2$ and triality, and explain why an $8$-dimensional, nonassociative number system is a natural candidate for internal degrees of freedom.

**Second Sunday:** We move to the Albert algebra $H_3(\\mathbb{O})$, the unified transport equation $D\\Psi=0$ and the idea that Dirac, Yang–Mills and Einstein equations can all be read as projections or consistency conditions of this single operator.

**Third Sunday:** We look at flavour: three generations, CKM and PMNS mixing, and how these structures appear as different charts on the same internal exceptional space.

**Fourth Sunday:** We step back and ask what kind of "attractor universe" is selected by this geometry, and how robust the picture is under deformations.

In between the Sundays, the weekday sheets focus on specific mechanisms, numerical prototypes and "what-if" universes based on alternative algebras.

## What you can expect (and what not)

This calendar is intentionally modest and ambitious at the same time:

- **Modest**, because it does not pretend to deliver a full, rigorous theory with all details worked out. Many steps are presented at the level of structure and plausibility rather than polished theorems.
- **Ambitious**, because it aims to show that a surprisingly small set of algebraic ingredients — octonions, $H_3(\\mathbb{O})$, an $\\mathfrak{so}(8)$-connection and a vacuum configuration $\\langle H\\rangle$ — can organise a large portion of what we know as the Standard Model plus gravity.

You should *not* expect precise numeric predictions for every mass and mixing angle on these pages. What you can expect are:

1. clear structural links: why three generations, why particular charge assignments, why certain patterns of couplings;
2. concrete numerical prototypes: explicit eigenvalue patterns from simple vacua in $H_3(\\mathbb{O})$;
3. a comparative view: what is lost when we replace the exceptional algebras by more conventional ones.

## Who this is written for

These sheets deliberately sit in between a technical paper and a popular article:

- If you are a working physicist or mathematician, you will find enough structure to connect the ideas to your own toolbox: Lie groups, representation theory, spectral geometry, operator algebras.
- If you come from a neighbouring field, you might treat the technical points as signposts rather than obstacles, and focus on the emerging picture: a universe whose internal order is exceptional in a very literal sense.

References at the bottom of each sheet point to the underlying literature. You do not need to read them to follow the calendar, but they are there if you want to see how the pieces connect to mainstream work on division algebras, Jordan algebras and noncommutative geometry.

## An invitation rather than a conclusion

Finally, this Advent calendar should be read as an invitation, not as a finished doctrine. There are many open questions:

- How unique is the proposed exceptional backbone?
- How far can the numerical fits to real-world data be pushed?
- Which aspects of the nonassociative structure survive quantisation?

If, by Christmas, you feel that these questions are worth spending serious time on, the calendar has achieved its goal.
  `;

  return (
    <div className="my-8">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between px-6 py-4 rounded-lg shadow-lg transition-all"
        style={{ 
          backgroundColor: 'rgba(0, 51, 102, 0.9)',
          color: '#FFFFFF'
        }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </motion.div>
          <span className="text-xl font-semibold">How to read this Advent calendar</span>
        </div>
        <div className="text-sm opacity-80">
          {isOpen ? 'Click to close' : 'Click to open'}
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
