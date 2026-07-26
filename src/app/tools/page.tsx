'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Wrench } from 'lucide-react';
import toolsData from '@/data/tools.json';
import type { ToolDefinition, ToolWithId } from '@/types/tools';
import Footer from '@/components/Footer';
import styles from '../ecosystem.module.css';
const tools: ToolWithId[] = Object.entries(toolsData).map(([id, data]) => ({ id, ...(data as ToolDefinition) }));
export default function ToolsPage() { const [query,setQuery]=useState(''); const results=useMemo(()=>tools.filter(tool=>`${tool.title} ${tool.description} ${tool.category}`.toLowerCase().includes(query.toLowerCase())),[query]); return <main className={styles.page}><section className={styles.listingHero}><div className="container"><p className={styles.kicker}><Wrench size={15}/> Free utility hub</p><h1>Tools that get work unstuck.</h1><p>Simple, useful browser tools for files, content, developer tasks, and everyday business work.</p></div></section><section className={styles.listing}><div className="container"><div style={{position:'relative'}}><Search size={19} style={{position:'absolute',left:16,top:16,color:'#94a3b8'}}/><input className={styles.search} style={{paddingLeft:47}} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search free tools…"/></div><div className={styles.catalogGrid}>{results.map(tool=><Link href={`/tools/${tool.id}`} className={styles.simpleCard} key={tool.id}><div className={styles.icon}>{tool.icon}</div><h2>{tool.title}</h2><p>{tool.description}</p><span>Use tool <ArrowRight size={15} style={{verticalAlign:'middle'}}/></span></Link>)}</div></div></section><Footer/></main>; }
