'use client';
import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
export function ProjectGallery({projects}){
  const [filter,setFilter]=useState('All projects');
  const filters=['All projects',...new Set(projects.map(p=>p.field))];
  return <><div className="filters" role="group" aria-label="Filter projects">{filters.map(f=><button key={f} aria-pressed={f===filter} onClick={()=>setFilter(f)}>{f}</button>)}</div>
    <div className="gallery">{projects.filter(p=>filter==='All projects'||p.field===filter).map(p=><Link className={'card '+p.slug} key={p.slug} href={'/work/'+p.slug+'/'}>
      <div className="picture"><Image src={p.image} alt={p.alt} width={600} height={400} sizes="(max-width: 760px) 90vw, 36vw"/></div>
      <div className="cardBody"><small>{p.field}</small><h3>{p.name}</h3><p>{p.summary}</p><span className="caseLink">Read case study <span aria-hidden="true">↗</span></span></div></Link>)}</div></>;
}
