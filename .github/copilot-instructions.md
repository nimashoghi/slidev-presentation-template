# Comprehensive Slidev Presentation Style Guide with Neversink Theme

## Core Principles of Effective Presentations

1. **One Message Per Slide**: Each slide should communicate exactly one clear concept
2. **Visual Hierarchy**: Guide audience attention through deliberate size, color, and placement choices
3. **Progressive Disclosure**: Reveal information sequentially to maintain focus and build understanding
4. **Text Minimalism**: Use only essential text, letting visuals carry the narrative burden
5. **Speaker Notes as Content Repository**: Slides are visual aids, notes hold your complete message

## Markdown-First Philosophy

Slidev with Neversink thrives on Markdown's simplicity. Prioritize Markdown over HTML:

```markdown
# Findings from Experiment 3

- Success rate increased by **42%** compared to baseline
- Error variance decreased significantly (*p < 0.01*)
- System maintained stability across all test conditions
```

Reserve HTML for specialized layout needs only:

```markdown
<div class="flex justify-between">
<div>Left side content</div>
<div>Right side content</div>
</div>
```

> **CRITICAL:** Never indent HTML in Slidev markdown files. Always start HTML tags flush left (no spaces/tabs before tags).

## Structuring Your Presentation

### Establishing the Presentation

```markdown
---
theme: neversink
neversink_slug: 'Neural Networks in Medical Imaging'
---

# Deep Learning Approaches for Medical Image Analysis
Dr. Jane Researcher | University Medical Center

---
```

### Narrative Flow Organization

Structure your presentation with a clear throughline:

1. **Opening**: Problem statement and motivation (cover layout)
2. **Background**: Contextual information (section layout + default layouts)
3. **Approach**: Your methods (two-column layouts)
4. **Results**: Your findings (side-title layouts with visualizations)
5. **Discussion**: Implications (quote layout for key takeaways)
6. **Conclusion**: Summary and next steps (section layout)

## Neversink Layouts Mastery

Neversink offers specialized layouts that enhance visual communication:

### Title Slide (Cover Layout)

```markdown
---
layout: cover
color: navy
---

# Quantum Computing Applications in Drug Discovery
**Dr. Alex Chen** | Molecular Systems Lab

:: note ::

This presentation covers our 3-year research program on quantum computing applications
in pharmaceutical research, highlighting three breakthrough algorithms.
```

### Standard Content (Default Layout)

```markdown
---
layout: default
color: blue-light
---

# Challenges in Current Approaches

- Classical algorithms struggle with protein folding simulations
- Exponential complexity limits molecular docking calculations
- Accuracy-performance tradeoff restricts practical applications

<!--
[click] Classical algorithms can only model simple proteins efficiently
[click] Even supercomputers require weeks for complex molecular docking
[click] Industry currently sacrifices accuracy for speed in drug screening
-->
```

### Two-Column Comparison (Two-Cols-Title Layout)

```markdown
---
layout: two-cols-title
columns: is-5
align: c-lt-lt
color: teal-light
---

:: title ::

# Classical vs. Quantum Approaches

:: left ::

## Classical Computing
- Sequential processing
- Binary bit-based
- Deterministic algorithms
- O(2^n) complexity scaling
- Limited by Moore's Law

:: right ::

## Quantum Computing
- Parallel processing
- Quantum bit (qubit) based
- Probabilistic algorithms
- O(n) potential scaling
- Limited by coherence time
```

### Side-Anchored Title (Side-Title Layout)

```markdown
---
layout: side-title
color: purple
titlewidth: is-4
side: l
align: rm-lt
---

:: title ::

# Key Results

:: content ::

Our quantum algorithm demonstrated:

- **100x** speed improvement for molecular docking
- **32%** increased accuracy in binding predictions
- Feasible simulation of compounds with **>200 atoms**
- Linear scaling with molecular complexity

![Results Comparison](/images/quantum-speedup-graph.png)
```

### Section Divider

```markdown
---
layout: section
color: indigo
---

# Quantum Algorithm Design
Building computational advantage through entanglement
```

### Quote Highlight

```markdown
---
layout: quote
color: sky-light
author: "Dr. Richard Feynman"
---

"Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical."
```

### Top Title with Two Columns

```markdown
---
layout: top-title-two-cols
columns: is-6
align: l-lt-lt
color: amber-light
---

:: title ::

# Implementation Challenges

:: left ::

## Technical Barriers
- Quantum decoherence
- Error correction overhead
- Limited qubit connectivity
- Temperature requirements

:: right ::

## Our Solutions
- Noise-resilient algorithm design
- Hybrid classical-quantum approach
- Optimized circuit depth
- Strategic qubit allocation
```

### Full Layout for Complex Visuals

```markdown
---
layout: full
---

<div class="grid grid-cols-2 gap-4">
<div>

## Quantum Circuit Design
![Circuit Diagram](/images/quantum-circuit.png)

</div>
<div>

## Resulting Energy Landscape
![Energy Graph](/images/energy-landscape.png)

</div>
</div>
```

## Color Psychology and the Neversink Color System

Neversink's color schemes convey meaning:

- **Blues (blue, sky, cyan)**: Trust, stability, data-focused content
- **Greens (green, emerald, teal)**: Growth, success, positive results
- **Reds/Oranges (red, orange, amber)**: Warnings, problems, challenges
- **Purples (purple, violet, indigo)**: Creativity, innovation, theory
- **Neutrals (white, light, dark, black)**: Foundational information

Apply color consistently across related slides:

```markdown
---
layout: section
color: red
---

# Challenges and Limitations

---

layout: default
color: red-light
---

# Four Key Challenges

1. Limited quantum coherence time
2. Noise contamination in measurements
3. Circuit depth constraints
4. Scaling issues beyond 100 qubits
```

## Animation and Progressive Disclosure

Reveal information strategically to control narrative:

### Bullet Point Animation

```markdown
# Key Findings

<v-clicks>

- Quantum approach shows exponential speedup
- Error rates remain within acceptable bounds
- System scales linearly with problem size
- Method generalizes to other molecular systems

</v-clicks>
```

### Grouped Revelations

```markdown
<v-clicks>

## Algorithm Performance
- Maintains coherence through 20 quantum gates
- Achieves 95% fidelity in final results

</v-clicks>

<v-clicks>

## Practical Implications
- Enables drug discovery for previously intractable targets
- Reduces screening time from months to days

</v-clicks>
```

### Code Walkthrough

````markdown
```python {1-2|4-6|8-10|all}
import qiskit
from qiskit import QuantumCircuit, execute, Aer

# Create quantum circuit with 3 qubits
circuit = QuantumCircuit(3, 3)
circuit.h(0)  # Hadamard gate on qubit 0

# Create entanglement between qubits
circuit.cx(0, 1)  # CNOT with control=0, target=1
circuit.cx(0, 2)  # CNOT with control=0, target=2
```
````

## Neversink Components for Visual Enhancement

### Admonitions for Important Points

```markdown
<AdmonitionType type="important" width="90%">

Our quantum algorithm requires at least 20 qubits with >99% gate fidelity to demonstrate advantage over classical methods.

</AdmonitionType>
```

### Speech Bubbles for Commentary

```markdown
<SpeechBubble position="r" color="cyan" shape="round" maxWidth="300px">

This unexpected phase transition occurs only in the quantum regime and has no classical analogue.

</SpeechBubble>
```

### Sticky Notes for Supplementary Information

```markdown
<StickyNote color="amber-light" textAlign="left" width="200px" title="Historical Note">

Feynman first proposed quantum computers specifically to simulate quantum physics in 1982.

</StickyNote>
```

### QR Codes for Resources

```markdown
<div class="flex justify-between items-center">
<div>

## Access Our Dataset
Scan to download complete experimental results and code repository

</div>
<QRCode value="https://github.com/your-repo/quantum-drug-discovery" :size="200" />
</div>
```

## Typography Best Practices

### Hierarchy Through Type

- **Slide Titles**: 32-40px (Default Neversink h1)
- **Section Headers**: 24-28px (Default Neversink h2)
- **Body Text**: 18-22px (Default Neversink paragraph)
- **Captions/Notes**: 14-16px (Use smaller text classes)

```markdown
# Primary Title

## Secondary Heading

Regular body text appears at this size.

<div class="text-sm">Smaller text for references or technical details</div>
```

### Highlighting Key Text

```markdown
This approach works in standard conditions, but ==fails dramatically in edge cases== where quantum effects dominate.
```

## Visual Design Principles for Academic Presentations

### Data Visualization

Present data clearly and honestly:

```markdown
<div class="flex justify-center">
<div class="w-4/5">
<img v-click src="/algorithm-comparison.png" class="w-full" />
</div>
</div>

<div class="grid grid-cols-3 gap-4 mt-4">
<div v-click class="bg-green-50 p-2 rounded text-center">
<div class="text-xl font-bold text-green-700">99.3%</div>
<div class="text-sm">Accuracy</div>
</div>
<div v-click class="bg-blue-50 p-2 rounded text-center">
<div class="text-xl font-bold text-blue-700">100x</div>
<div class="text-sm">Speed Improvement</div>
</div>
<div v-click class="bg-purple-50 p-2 rounded text-center">
<div class="text-xl font-bold text-purple-700">5x</div>
<div class="text-sm">Energy Efficiency</div>
</div>
</div>
```

### White Space

Embrace emptiness for clarity:

```markdown
---
layout: default
color: light
---

<div class="py-10">

# Simplicity Enhances Comprehension

Our most important finding is that quantum algorithms provide exponential speedup for molecular simulations.

</div>
```

### Rule of Thirds

Position key elements at natural focus points:

```markdown
---
layout: full
---

<div class="grid grid-cols-3 grid-rows-3 h-full">
<div class="col-span-2 row-span-2">
<img src="/main-diagram.png" class="h-full w-full object-contain" />
</div>
<div class="col-start-3 row-start-1">
<h2>Key Components</h2>
</div>
<div class="col-start-3 row-start-2">

- Entanglement generator
- Error correction module
- Measurement system

</div>
<div class="col-start-1 col-span-3 row-start-3">
<p class="text-center pt-4">Our architecture integrates these components to achieve quantum advantage</p>
</div>
</div>
```

## Practical Slide Patterns for Academic Presentations

### Problem Statement Slide

```markdown
---
layout: default
color: red-light
---

# The Molecular Docking Challenge

<div class="grid grid-cols-2 gap-4">
<div>
<v-clicks>

- Drug discovery requires evaluating billions of molecular interactions
- Classical algorithms scale exponentially with molecule size
- Current approaches limited to ~100 atom systems
- Industry relies on severe approximations

</v-clicks>
</div>

<div class="flex items-center justify-center">
<img v-click src="/molecular-complexity.png" class="h-60 rounded shadow" />
</div>
</div>
```

### Methods Slide

```markdown
---
layout: top-title-two-cols
columns: is-4
align: l-lt-lt
color: blue-light
---

:: title ::

# Quantum Phase Estimation Approach

:: left ::

## Core Algorithm Steps
<v-clicks>

1. Initialize quantum register to reference state
2. Apply molecular Hamiltonian evolution
3. Perform quantum Fourier transform
4. Measure energy eigenvalues
5. Post-process results classically

</v-clicks>

:: right ::

<div class="flex justify-center items-center h-full">
<img src="/circuit-diagram.png" class="max-h-80 max-w-full" />
</div>
```

### Results Comparison Slide

```markdown
---
layout: side-title
color: green
titlewidth: is-3
side: l
align: rm-lt
---

:: title ::

# Performance Comparison

:: content ::

<div class="grid grid-cols-2 gap-8">
<div>

## Classical Approach
- Processing time: 72 hours
- Accuracy: 76%
- Energy resolution: ±0.5 kcal/mol
- Max molecule size: 100 atoms

</div>
<div>

## Our Quantum Approach
- Processing time: 45 minutes
- Accuracy: 94%
- Energy resolution: ±0.1 kcal/mol
- Max molecule size: 300 atoms

</div>
</div>

<div class="pt-8">
<img src="/performance-graph.png" class="w-4/5 mx-auto" />
</div>
```

### Implications/Discussion Slide

```markdown
---
layout: quote
color: purple-light
quotesize: text-xl
authorsize: text-lg
---

<div class="py-4">

"Our quantum approach fundamentally changes what's possible in computational drug discovery, potentially reducing development timelines from years to months."

</div>

<div class="pt-4 text-right">
<AdmonitionType type="tip" width="60%" class="ml-auto">

This could enable targeting of previously "undruggable" proteins associated with major diseases.

</AdmonitionType>
</div>
```

### Future Work/Conclusion Slide

```markdown
---
layout: default
color: indigo-light
---

# Future Directions

<div class="grid grid-cols-3 gap-4">
<div class="bg-white bg-opacity-50 p-4 rounded-lg shadow">
<h3 class="text-indigo-700 mb-2">Hardware Scaling</h3>
Extend to 100+ qubit systems with improved coherence times
</div>

<div class="bg-white bg-opacity-50 p-4 rounded-lg shadow">
<h3 class="text-indigo-700 mb-2">Algorithm Refinement</h3>
Optimize circuit depth and error mitigation techniques
</div>

<div class="bg-white bg-opacity-50 p-4 rounded-lg shadow">
<h3 class="text-indigo-700 mb-2">Clinical Applications</h3>
Partner with pharmaceutical companies for real-world testing
</div>
</div>

<div class="mt-8 text-center">
<QRCode value="https://example.com/contact" :size="120" class="inline-block" />
<p class="mt-2">Scan to collaborate with our team</p>
</div>
```

## Advanced Slidev Techniques

### Custom Component Positioning

```markdown
---
layout: full
---

<StickyNote color="blue-light" width="200px" v-drag="[150,120,200,150]">
This interaction is key to quantum advantage
</StickyNote>

<ArrowDraw color="red" v-drag="[350,250,200,100]"/>

<div class="flex justify-center items-center h-full">
<img src="/complex-diagram.png" class="max-h-80 max-w-full" />
</div>
```

### Tailwind Utility Classes for Layout

```markdown
<div class="flex justify-between items-center p-4 bg-blue-50 rounded-lg shadow">
<div class="text-xl font-bold text-blue-800">Key Finding</div>
<div class="text-4xl">→</div>
<div>Quantum systems provide exponential speedup</div>
</div>
```

Common useful Tailwind classes in Neversink:
- Flexbox: `flex`, `justify-between`, `items-center`
- Grid: `grid`, `grid-cols-2`, `gap-4`
- Spacing: `p-4`, `mt-8`, `mb-2`
- Styling: `rounded-lg`, `shadow`, `bg-opacity-50`

## Common Pitfalls and Solutions

1. **Overcrowded Slides**
   - Solution: Split content across multiple slides
   - Rule: Max 5 bullet points per slide, 25 words per bullet

2. **Text-Heavy Presentation**
   - Solution: Convert text to visuals, diagrams, and icons
   - Rule: If you're reading directly from slides, redesign them

3. **Inconsistent Design**
   - Solution: Use consistent layouts for similar content types
   - Rule: Define color scheme and layout patterns before creating content

4. **Poor Contrast**
   - Solution: Use Neversink's paired color schemes
   - Rule: Test readability by viewing slides from 10 feet away

5. **Gratuitous Animations**
   - Solution: Use animations purposefully to reveal logical progression
   - Rule: Animations should reveal meaningful information, not distract

## Conclusion

Effective presentations with Slidev and Neversink combine:

1. **Clear content strategy**: One message per slide, logical flow throughout
2. **Visual design principles**: Hierarchy, contrast, white space, rule of thirds
3. **Neversink's layout system**: Leverage purpose-built layouts for different content types
4. **Progressive disclosure**: Reveal information in a measured, logical sequence
5. **Markdown-first approach**: Keep slides clean and maintainable
6. **Visual components**: Enhance with Neversink components for emphasis and clarity

Remember that slides support your presentation—they are not the presentation itself. Design them to complement and enhance your spoken narrative, not replace it.
