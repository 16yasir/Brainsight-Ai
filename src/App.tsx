import { useState } from 'react'
import type { CSSProperties } from 'react'
import Brain from '@/components/Brain'
import { PulseBeams } from '@/components/ui/pulse-beams'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Brain as BrainIcon, Activity, Zap, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const stats = [
  { value: '$5M+', label: 'Pre-Series A Raised' },
  { value: '12+', label: 'Hospital Partners' },
  { value: '4', label: 'Compliance Certifications' },
  { value: "ET '24", label: 'Top Innovator Award' },
]

const features = [
  {
    id: '01',
    title: 'Upload DICOM Files',
    description:
      'Choose tractography, parcellation, and tumour segmentation workflows for each clinical case.',
  },
  {
    id: '02',
    title: 'AI Generates Your Connectome',
    description:
      'VoxelBox processes MRI connectivity data in minutes and builds clinically useful brain maps.',
  },
  {
    id: '03',
    title: 'Download Reports & Results',
    description:
      'Receive digitally signed reports and export-ready outputs in formats your workflow already uses.',
  },
]

const products = [
  {
    name: 'VB Clinical',
    title: 'Precision Maps For The Operating Room.',
    body:
      'Built for tumour resection, epilepsy surgery, and deep brain stimulation workflows that depend on high-confidence navigation.',
    points: ['Overview panel', 'Clinical indications', 'Signed report output'],
  },
  {
    name: 'VoxelBox Explore',
    title: 'Research-Grade Connectomics At Clinical Speed.',
    body:
      'Advanced brain mapping, multi-modal parcellation, and rs-fMRI analysis in a workspace designed for investigators.',
    points: ['Dynamic tract layers', 'Parcellation views', 'Export-ready maps'],
  },
]

const capabilities = [
  'Perform robust anatomical, functional, structural and multi-modal parcellations based on the latest literature.',
  'Obtain AI-informed tumour delineation and intra-tumour segmentation to aid pre-surgical planning.',
  'Automatically generate 7+ functional and cognitive maps in 10 minutes using rs-fMRI.',
  'Generate heat maps, brain masks, z-score voxels, and tract outputs in clinical file formats.',
]

const partners = [
  'Ramaiah Memorial Hospital',
  'AIG Hospitals',
  'MS Centre',
  'Aster DM Healthcare',
  'MAX Healthcare',
  'Sparsh Hospital',
]

const heroButtonBeams = [
  {
    path: 'M180 102H22C15.3726 102 10 107.373 10 114V180',
    gradientConfig: {
      initial: { x1: '0%', x2: '0%', y1: '80%', y2: '100%' },
      animate: {
        x1: ['0%', '0%', '200%'],
        x2: ['0%', '0%', '180%'],
        y1: ['80%', '0%', '0%'],
        y2: ['100%', '20%', '20%'],
      },
      transition: {
        duration: 1.9,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'linear' as const,
        repeatDelay: 0,
        delay: 0,
      },
    },
    connectionPoints: [
      { cx: 10, cy: 180, r: 4.5 },
      { cx: 180, cy: 102, r: 4.5 },
    ],
  },
  {
    path: 'M196 102H340C346.627 102 352 96.6274 352 90V18',
    gradientConfig: {
      initial: { x1: '20%', x2: '0%', y1: '80%', y2: '100%' },
      animate: {
        x1: ['20%', '100%', '100%'],
        x2: ['0%', '90%', '90%'],
        y1: ['80%', '80%', '-20%'],
        y2: ['100%', '100%', '0%'],
      },
      transition: {
        duration: 2.05,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'linear' as const,
        repeatDelay: 0,
        delay: 0.45,
      },
    },
    connectionPoints: [
      { cx: 352, cy: 18, r: 4.5 },
      { cx: 196, cy: 102, r: 4.5 },
    ],
  },
  {
    path: 'M180 118V145C180 151.627 174.627 157 168 157H52C45.3726 157 40 162.373 40 169V188',
    gradientConfig: {
      initial: { x1: '40%', x2: '50%', y1: '160%', y2: '180%' },
      animate: {
        x1: '0%',
        x2: '10%',
        y1: '-40%',
        y2: '-20%',
      },
      transition: {
        duration: 1.75,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'linear' as const,
        repeatDelay: 0,
        delay: 0.9,
      },
    },
    connectionPoints: [
      { cx: 40, cy: 188, r: 4.5 },
      { cx: 180, cy: 118, r: 4.5 },
    ],
  },
]

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.25,
        ease: 'easeOut' as const
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.25,
        ease: 'easeOut' as const
      }
    }
  }

  return (
    <div className="app-shell">
      <header
        className="site-header page-load-fade relative z-[100]"
        style={{ ['--load-delay' as string]: '0.02s' } as CSSProperties}
      >
        <a className="brand" href="#hero">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">
            BrainSight<span>AI</span>
          </span>
        </a>

        <nav className="site-nav !hidden md:!flex" aria-label="Primary">
          <a href="#platform">Platform</a>
          <a href="#products">Products</a>
          <a href="#capabilities">Capabilities</a>
          <a href="#partners">Partners</a>
        </nav>

        <div className="flex items-center gap-4">
          <a className="header-cta" href="#contact">
            Request Demo
          </a>
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full left-0 right-0 bg-[#0a0014] border-b border-[#FF1493]/20 flex flex-col md:hidden z-50 overflow-hidden"
            >
              {[
                { label: 'Platform', href: '#platform' },
                { label: 'Products', href: '#products' },
                { label: 'Capabilities', href: '#capabilities' },
                { label: 'Partners', href: '#partners' }
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block w-full px-6 py-4 text-white text-base cursor-pointer border-b border-white/5 border-l-[3px] border-transparent hover:border-[#FF1493] hover:bg-[#FF1493]/10"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="hero-section" id="hero">
          <div
            className="hero-copy page-load-rise"
            style={{ ['--load-delay' as string]: '0.08s' } as CSSProperties}
          >
            <p className="eyebrow">Live Platform · VoxelBox AI</p>
            <h1 className="!text-[2.5rem] md:!text-[3.5rem] lg:!text-[clamp(3.8rem,9vw,6.4rem)] !leading-tight">
              Navigate To The Future Of
              <br />
              <span className="hero-highlight">Brain Mapping</span>
            </h1>
            <p className="hero-text">
              VoxelBox uses AI-powered connectomics to generate personalised brain maps, giving
              neurosurgeons the clarity to operate with total confidence.
            </p>
            <div className="hero-actions !flex !flex-col md:!flex-row !w-full md:!w-auto !items-center !gap-4">
              <PulseBeams
                accentColor="rgba(0,212,168,0.55)"
                baseColor="rgba(240,244,255,0.18)"
                beams={heroButtonBeams}
                className="!h-auto md:!h-[112px] !w-full !max-w-[calc(100vw-3rem)] md:!w-[372px] md:!max-w-none pulse-cta-shell"
                gradientColors={{
                  start: '#00D4A8',
                  middle: '#6EC9FF',
                  end: '#00FFD0',
                }}
                height={210}
                width={372}
              >
                <a className="pulse-cta-button !w-full !max-w-[calc(100vw-3rem)] md:!max-w-none !box-border !py-[14px] md:!w-auto md:!py-0 flex justify-center items-center text-center" href="#products">
                  <span>Experience VoxelBox</span>
                </a>
              </PulseBeams>
              <a className="button button-secondary hero-demo-button !w-full !max-w-[calc(100vw-3rem)] md:!max-w-none !box-border !py-[14px] md:!w-auto md:!py-0 flex justify-center items-center text-center" href="#contact">
                Watch the demo
              </a>
            </div>

            <div className="stats-grid stats-grid-load !hidden md:!grid">
              {stats.map((stat, index) => (
                <article
                  className="stat-card stat-card-load"
                  key={stat.label}
                  style={{ ['--stat-index' as string]: index } as CSSProperties}
                >
                  <strong className="!text-[1.5rem] md:!text-[2rem] lg:!text-[2.4rem]">{stat.value}</strong>
                  <span className="!text-[0.7rem] md:!text-[0.8rem] lg:!text-[0.85rem]">{stat.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-visual right-column-brain flex-col">
            <div className="hero-glow" />
            <div
              className="mx-auto mt-5 lg:mt-0 rounded-2xl overflow-hidden relative bg-black border border-white/10 shadow-[0_0_40px_rgba(255,0,170,0.15)] w-full h-[320px] md:h-[420px] lg:w-[480px] lg:h-[680px] top-0 lg:-top-[100px]"
            >
              <div className="absolute top-[10px] left-[10px] right-[10px] lg:top-4 lg:left-4 lg:right-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="flex gap-1.5 lg:gap-3">
                  <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-lg bg-[#ff1493]/10 border border-[#ff1493]/20 flex items-center justify-center shrink-0">
                    <BrainIcon className="w-3.5 h-3.5 lg:w-5 lg:h-5 text-pink-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[0.75rem] leading-tight lg:text-base bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent truncate">Interactive 3D Brain</div>
                    <div className="font-mono text-[0.5rem] lg:text-xs text-pink-400/80 truncate">NEURAL NETWORK SIMULATION</div>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5 lg:gap-2 items-end shrink-0">
                  <div className="flex items-center gap-1 lg:gap-1.5 text-pink-400/80 text-[0.55rem] lg:text-sm font-mono whitespace-nowrap">
                    <Activity className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5" />
                    <span>Active Nodes: 5,000</span>
                  </div>
                  <div className="flex items-center gap-1 lg:gap-1.5 text-pink-400/80 text-[0.55rem] lg:text-sm font-mono whitespace-nowrap">
                    <Zap className="w-2.5 h-2.5 lg:w-3.5 lg:h-3.5" />
                    <span>Connections: ~50,000</span>
                  </div>
                </div>
              </div>
              <Canvas camera={{ position: [0, 0, 15], fov: 45 }}
                style={{ width: '100%', height: '100%' }}>
                <color attach="background" args={['#05000a']} />
                <ambientLight intensity={0.5} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Brain />
                <OrbitControls 
                  enablePan={false}
                  minDistance={5}
                  maxDistance={30}
                  autoRotate
                  autoRotateSpeed={0.5}
                />
                <EffectComposer>
                  <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
                </EffectComposer>
              </Canvas>
            </div>
            <div className="flex justify-center mt-3 relative top-0 lg:-top-[100px]">
              <div className="px-3 lg:px-4 py-1.5 lg:py-2 bg-black/40 backdrop-blur-md border border-pink-500/20 rounded-full text-pink-300/70 text-[0.65rem] lg:text-sm font-medium flex items-center gap-1.5 lg:gap-2">
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-pink-500 animate-pulse"></span>
                Drag to rotate • Scroll to zoom • Hover to stimulate neurons
              </div>
            </div>
          </div>

          <div className="stats-grid stats-grid-load !grid !grid-cols-2 gap-4 md:!hidden mt-8 w-full px-6">
            {stats.map((stat, index) => (
              <article
                className="stat-card stat-card-load"
                key={stat.label + '-mobile'}
                style={{ ['--stat-index' as string]: index } as CSSProperties}
              >
                <strong className="!text-[1.5rem]">{stat.value}</strong>
                <span className="!text-[0.7rem]">{stat.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block" id="platform">
          <div
            className="section-intro page-load-rise"
            style={{ ['--load-delay' as string]: '0.2s' } as CSSProperties}
          >
            <p className="eyebrow">The Platform</p>
            <h2>
              Three Steps From
              <br />
              Scan To <span>Surgical Clarity</span>
            </h2>
            <p>
              VoxelBox uses computational neuroscience and AI to process MRI connectivity data in
              minutes, not days.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article
                className="panel-card page-load-rise page-load-card"
                key={feature.id}
                style={{ ['--load-index' as string]: Number(feature.id) - 1 } as CSSProperties}
              >
                <p className="panel-index">{feature.id}</p>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block" id="products">
          <div
            className="section-intro page-load-rise"
            style={{ ['--load-delay' as string]: '0.26s' } as CSSProperties}
          >
            <p className="eyebrow">Product Suite</p>
            <h2>
              Precision Tools For
              <br />
              Every <span>Brain Specialist</span>
            </h2>
            <p>
              BrainSightAI packages clinical and research workflows into focused products built
              around surgical clarity, connectomics, and fast interpretation.
            </p>
          </div>

          <div className="product-stack">
            {products.map((product, index) => (
              <article
                className="product-card page-load-rise page-load-card"
                key={product.name}
                style={{ ['--load-index' as string]: index } as CSSProperties}
              >
                <div className="product-copy">
                  <p className="eyebrow">{product.name}</p>
                  <h3>{product.title}</h3>
                  <p>{product.body}</p>
                  <ul className="bullet-list">
                    {product.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className={`product-visual visual-${index + 1}`}>
                  <div className="visual-screen">
                    <div className="visual-topbar">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="visual-layout">
                      <div className="visual-orb" />
                      <div className="visual-lines">
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block capability-section" id="capabilities">
          <div
            className="section-intro page-load-rise"
            style={{ ['--load-delay' as string]: '0.32s' } as CSSProperties}
          >
            <p className="eyebrow">VoxelBox Explore</p>
            <h2>
              With VoxelBox Explore,
              <br />
              <span>You Can.</span>
            </h2>
          </div>

          <div className="capability-grid">
            {capabilities.map((capability, index) => (
              <article
                className="panel-card capability-card page-load-rise page-load-card"
                key={capability}
                style={{ ['--load-index' as string]: index } as CSSProperties}
              >
                <p className="panel-index">0{index + 1}</p>
                <p>{capability}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block partner-section" id="partners">
          <div
            className="section-intro page-load-rise"
            style={{ ['--load-delay' as string]: '0.38s' } as CSSProperties}
          >
            <p className="eyebrow">Clinical Partners</p>
            <h2>
              Trusted By India&apos;s
              <br />
              Leading Hospitals.
            </h2>
            <p>
              BrainSightAI is validated through clinical relationships with care teams operating at
              the sharpest edge of neurosurgery and brain mapping.
            </p>
          </div>

          <div className="partner-grid">
            {partners.map((partner, index) => (
              <article
                className="partner-card page-load-rise page-load-card"
                key={partner}
                style={{ ['--load-index' as string]: index } as CSSProperties}
              >
                <strong>{partner}</strong>
                <span>Ongoing deployment</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section-block cta-section" id="contact">
          <div
            className="cta-card page-load-rise"
            style={{ ['--load-delay' as string]: '0.44s' } as CSSProperties}
          >
            <p className="eyebrow">Join the Mission</p>
            <h2>
              Partner With
              <br />
              <span>BrainSightAI.</span>
            </h2>
            <p>
              Neurosurgeons, researchers, hospitals, and partners can use this page to start a
              focused conversation with the team.
            </p>
            <div className="cta-actions">
              <a
                className="button button-primary cta-email-button"
                href="mailto:collaborations@brainsightai.com"
              >
                collaborations@brainsightai.com
              </a>
              <a className="cta-back-link" href="#hero">
                Back to top
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
