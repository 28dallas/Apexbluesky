import Link from 'next/link';
import { ArrowRight, Boxes, Code2, Layers3, Sparkles, WandSparkles } from 'lucide-react';
import Footer from '@/components/Footer';
import styles from './ecosystem.module.css';

const paths = [
  { icon: WandSparkles, eyebrow: 'Start free', title: 'Use a tool', text: 'Get instant help with files, images, writing, PDFs, and practical developer tasks.', href: '/tools', action: 'Explore tools' },
  { icon: Layers3, eyebrow: 'Build faster', title: 'Buy assets & apps', text: 'Production-ready starters, automation assets, and focused AI applications.', href: '/store', action: 'Browse the store' },
  { icon: Boxes, eyebrow: 'Scale your business', title: 'Work with us', text: 'Bring us your workflow, bottleneck, or product idea. We will help build the system behind it.', href: '/solutions', action: 'Explore solutions' },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.kicker}><Sparkles size={15} /> The ApexBlueSky ecosystem</p>
          <h1>Build smarter.<br /><span>Automate more.</span> Ship faster.</h1>
          <p className={styles.lead}>Free utilities, production-ready digital assets, AI apps, and custom automation for founders, creators, and growing teams.</p>
          <div className={styles.heroActions}>
            <Link className="btn-primary" href="/tools">Explore free tools <ArrowRight size={17} /></Link>
            <Link className={styles.secondaryButton} href="/solutions">Build a custom solution</Link>
          </div>
          <div className={styles.proof}><span>Private by design</span><i /> <span>Built in Kenya, for everywhere</span><i /> <span>Made to remove busywork</span></div>
        </div>
      </section>

      <section className={styles.paths}>
        <div className="container">
          <div className={styles.sectionIntro}><p>ONE PLATFORM, THREE WAYS TO MOVE</p><h2>Choose the fastest path from idea to outcome.</h2></div>
          <div className={styles.pathGrid}>
            {paths.map(({ icon: Icon, eyebrow, title, text, href, action }) => (
              <Link href={href} className={styles.pathCard} key={title}>
                <div className={styles.icon}><Icon size={24} /></div>
                <p>{eyebrow}</p><h3>{title}</h3><span>{text}</span>
                <strong>{action} <ArrowRight size={16} /></strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.featured}>
        <div className="container"><div className={styles.featuredPanel}>
          <div><p className={styles.label}>THE FOUNDATION</p><h2>Useful tools today.<br />A stronger business tomorrow.</h2><p>Every tool is designed to solve a real problem quickly. As your needs grow, the same ecosystem gives you products, apps, and hands-on support.</p><Link href="/tools" className={styles.textLink}>See the free tool library <ArrowRight size={16} /></Link></div>
          <div className={styles.toolStack}><div><Code2 size={19} /><span>Developer utilities</span></div><div><WandSparkles size={19} /><span>File &amp; content tools</span></div><div><Layers3 size={19} /><span>Automation-ready workflows</span></div></div>
        </div></div>
      </section>
      <Footer />
    </main>
  );
}
