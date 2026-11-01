import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Search, Plus, Trash2, Eye, UploadCloud, Video, Image as ImageIcon, Loader2 } from 'lucide-react';
import { BlogArticle } from '../../services/storageService';
import { ConfirmDeleteModal } from '../ConfirmDeleteModal';

interface BlogManagerViewProps { language: 'en' | 'bn'; accessToken: string; }
type DbArticle = { id:string; title:string; slug:string; excerpt:string; body:string; topic:string|null; language:string; status:'DRAFT'|'PUBLISHED'; published_at:string|null; source:string; review_status:string; seo_title:string; seo_description:string; cover_image_url:string|null; media:any[]; tags:string[]; source_urls:string[]; scheduled_for:string|null; word_count:number; created_at:string; updated_at:string };
const base = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const headers = (token:string, extra:Record<string,string>={}) => ({ apikey:key, Authorization:`Bearer ${token}`, ...extra });
const slugify = (s:string) => s.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu,'-').replace(/(^-|-$)/g,'').slice(0,90);
const wordCount = (s:string) => s.trim() ? s.trim().split(/\s+/).length : 0;
const mapArticle = (a:DbArticle):BlogArticle => ({ id:a.id, title:a.title, slug:a.slug, category:(a.topic || 'General') as BlogArticle['category'], excerpt:a.excerpt || '', content:a.body || '', author:'NextBorder Editorial', status:a.status === 'PUBLISHED' ? 'Published' : 'Draft', isAIGenerated:a.source === 'ai', humanApproved:a.review_status === 'APPROVED', approvedBy:undefined, createdAt:new Date(a.created_at).toLocaleDateString('en-GB'), updatedAt:new Date(a.updated_at).toLocaleDateString('en-GB'), publishedAt:a.published_at ? new Date(a.published_at).toLocaleDateString('en-GB') : undefined, tags:a.tags || [], views:0 });

export const BlogManagerView: React.FC<BlogManagerViewProps> = ({ language, accessToken }) => {
  const [blogs,setBlogs]=useState<BlogArticle[]>([]);
  const [rows,setRows]=useState<DbArticle[]>([]);
  const [search,setSearch]=useState('');
  const [blogToDelete,setBlogToDelete]=useState<BlogArticle|null>(null);
  const [selectedCategory,setSelectedCategory]=useState('All');
  const [isCreating,setIsCreating]=useState(false);
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState('');
  const [newTitle,setNewTitle]=useState('');
  const [newCategory,setNewCategory]=useState<BlogArticle['category']>('General');
  const [newLanguage,setNewLanguage]=useState<'en'|'bn'>('en');
  const [newExcerpt,setNewExcerpt]=useState('');
  const [newContent,setNewContent]=useState('');
  const [newTags,setNewTags]=useState('');
  const [sourceUrls,setSourceUrls]=useState('');
  const [cover,setCover]=useState<File|null>(null);
  const [media,setMedia]=useState<File[]>([]);
  const [settings,setSettings]=useState({enabled:false,auto_publish:false,publish_time:'06:00',timezone:'Asia/Dhaka',english_daily:2,bengali_daily:1,max_words:400});

  const load = async () => {
    const [articles, config] = await Promise.all([
      fetch(`${base}/rest/v1/content_articles?select=*&order=created_at.desc&limit=200`,{headers:headers(accessToken)}),
      fetch(`${base}/rest/v1/editorial_automation_settings?select=*&id=eq.true`,{headers:headers(accessToken)})
    ]);
    if(!articles.ok) throw new Error(`Article load failed (${articles.status})`);
    const data:DbArticle[]=await articles.json(); setRows(data); setBlogs(data.map(mapArticle));
    if(config.ok){const c=(await config.json())[0]; if(c)setSettings({...settings,...c,publish_time:String(c.publish_time).slice(0,5)});}
  };
  useEffect(()=>{load().catch(e=>setNotice(e.message));},[accessToken]);

  const upload = async (file:File) => {
    const safe=file.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]/g,'-');
    const path=`${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}-${safe}`;
    const response=await fetch(`${base}/storage/v1/object/blog-media/${path}`,{method:'POST',headers:headers(accessToken,{'Content-Type':file.type,'x-upsert':'false'}),body:file});
    if(!response.ok) throw new Error(`Upload failed: ${file.name} (${response.status})`);
    return `${base}/storage/v1/object/public/blog-media/${path}`;
  };

  const handleCreateBlog = async (e:React.FormEvent) => {
    e.preventDefault(); if(!newTitle.trim() || !newContent.trim()) return;
    if(wordCount(newContent)>400){setNotice('Article is over the 400-word limit.');return;}
    setBusy(true); setNotice('');
    try{
      const coverUrl=cover?await upload(cover):null;
      const mediaUrls=await Promise.all(media.map(async f=>({url:await upload(f),type:f.type.startsWith('video/')?'video':'image',name:f.name})));
      const slug=slugify(newTitle)+'-'+Date.now().toString(36);
      const payload={title:newTitle.trim(),slug,excerpt:newExcerpt.trim(),body:newContent.trim(),topic:newCategory,language:newLanguage,status:'DRAFT',source:'staff',review_status:'NOT_REVIEWED',seo_title:newTitle.trim(),seo_description:newExcerpt.trim(),cover_image_url:coverUrl,media:mediaUrls,tags:newTags.split(',').map(x=>x.trim()).filter(Boolean),source_urls:sourceUrls.split(/\n|,/).map(x=>x.trim()).filter(Boolean),word_count:wordCount(newContent)};
      const response=await fetch(`${base}/rest/v1/content_articles`,{method:'POST',headers:headers(accessToken,{'Content-Type':'application/json','Prefer':'return=representation'}),body:JSON.stringify(payload)});
      if(!response.ok) throw new Error(`Save failed (${response.status}): ${await response.text()}`);
      await load(); setIsCreating(false); setNewTitle('');setNewExcerpt('');setNewContent('');setNewTags('');setSourceUrls('');setCover(null);setMedia([]);
      setNotice('Article saved as Draft in Supabase. Review and publish when ready.');
    }catch(e:any){setNotice(e.message || 'Unable to save article.');}finally{setBusy(false);}
  };
  const setStatus=async(id:string,status:'DRAFT'|'PUBLISHED')=>{
    setBusy(true);try{
      const response=await fetch(`${base}/rest/v1/content_articles?id=eq.${id}`,{method:'PATCH',headers:headers(accessToken,{'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({status,published_at:status==='PUBLISHED'?new Date().toISOString():null,review_status:status==='PUBLISHED'?'APPROVED':'NOT_REVIEWED',reviewed_at:status==='PUBLISHED'?new Date().toISOString():null})});
      if(!response.ok)throw new Error(`Update failed (${response.status})`);await load();setNotice(status==='PUBLISHED'?'Article published.':'Article moved to Draft.');
    }catch(e:any){setNotice(e.message);}finally{setBusy(false);}
  };
  const remove=async()=>{if(!blogToDelete)return;setBusy(true);try{const r=await fetch(`${base}/rest/v1/content_articles?id=eq.${blogToDelete.id}`,{method:'DELETE',headers:headers(accessToken)});if(!r.ok)throw new Error(`Delete failed (${r.status})`);await load();setBlogToDelete(null);}catch(e:any){setNotice(e.message);}finally{setBusy(false);}};
  const saveSettings=async()=>{setBusy(true);try{const r=await fetch(`${base}/rest/v1/editorial_automation_settings?id=eq.true`,{method:'PATCH',headers:headers(accessToken,{'Content-Type':'application/json','Prefer':'return=minimal'}),body:JSON.stringify({...settings,updated_at:new Date().toISOString()})});if(!r.ok)throw new Error(`Settings save failed (${r.status})`);setNotice('Editorial preferences saved. Scheduler is not activated until the server-side AI job is configured.');}catch(e:any){setNotice(e.message);}finally{setBusy(false);}};
  const filtered=useMemo(()=>blogs.filter(b=>(!search.trim()||[b.title,b.excerpt,...b.tags].join(' ').toLowerCase().includes(search.toLowerCase()))&&(selectedCategory==='All'||b.category===selectedCategory)),[blogs,search,selectedCategory]);

  return <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}} transition={{duration:.25}} className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-white/10 shadow-xl">
      <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300"><BookOpen className="w-5 h-5"/></div><div><h1 className="text-xl md:text-2xl font-bold text-white">{language==='en'?'Blog & Editorial CMS':'ব্লগ ও আর্টিকেল ব্যবস্থাপনা'}</h1><p className="text-xs text-rose-200/70">Supabase CMS · AI editorial settings · Media library</p></div></div>
      <button onClick={()=>setIsCreating(!isCreating)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-semibold text-xs"><Plus className="w-4 h-4"/>{isCreating?'Close Editor':'Write New Article'}</button>
    </div>
    {notice&&<div role="status" className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/20 text-rose-100 text-xs">{notice}</div>}
    <section className="p-5 glass-panel rounded-2xl border border-white/10 space-y-3">
      <div className="flex items-center justify-between"><div><h2 className="text-white font-bold text-sm">AI Editorial Schedule</h2><p className="text-rose-200/60 text-xs">Daily target: 2 English + 1 বাংলা · 06:00 Asia/Dhaka</p></div><span className="text-[10px] text-amber-300 border border-amber-400/30 rounded-full px-2 py-1">Scheduler setup required</span></div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        <label className="text-rose-100">Generator <input type="checkbox" className="ml-2 accent-rose-500" checked={settings.enabled} onChange={e=>setSettings({...settings,enabled:e.target.checked})}/></label>
        <label className="text-rose-100">Auto-publish <input type="checkbox" className="ml-2 accent-rose-500" checked={settings.auto_publish} onChange={e=>setSettings({...settings,auto_publish:e.target.checked})}/></label>
        <label className="text-rose-100">Publish time <input type="time" className="block mt-1 p-2 rounded-lg glass-input text-white" value={settings.publish_time} onChange={e=>setSettings({...settings,publish_time:e.target.value})}/></label>
        <label className="text-rose-100">English/day <input type="number" min="0" max="10" className="block mt-1 p-2 rounded-lg glass-input text-white w-20" value={settings.english_daily} onChange={e=>setSettings({...settings,english_daily:Number(e.target.value)})}/></label>
        <label className="text-rose-100">বাংলা/day <input type="number" min="0" max="10" className="block mt-1 p-2 rounded-lg glass-input text-white w-20" value={settings.bengali_daily} onChange={e=>setSettings({...settings,bengali_daily:Number(e.target.value)})}/></label>
      </div>
      <button disabled={busy} onClick={saveSettings} className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold disabled:opacity-50">{busy?'Saving…':'Save editorial settings'}</button>
    </section>
    {isCreating&&<form onSubmit={handleCreateBlog} className="p-6 glass-panel rounded-3xl border border-rose-500/40 space-y-4 text-xs">
      <h3 className="font-bold text-white text-sm">New Article · saved as Draft</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-rose-200">Headline<input required value={newTitle} onChange={e=>setNewTitle(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl glass-input text-white"/></label>
        <label className="text-rose-200">Category<select value={newCategory} onChange={e=>setNewCategory(e.target.value as any)} className="w-full mt-1 px-3 py-2 rounded-xl glass-input bg-rose-950 text-white"><option>General</option><option>IELTS Preparation</option><option>Student Visa</option><option>Scholarships</option><option>Immigration</option></select></label>
        <label className="text-rose-200">Language<select value={newLanguage} onChange={e=>setNewLanguage(e.target.value as 'en'|'bn')} className="w-full mt-1 px-3 py-2 rounded-xl glass-input bg-rose-950 text-white"><option value="en">English</option><option value="bn">বাংলা</option></select></label>
        <label className="text-rose-200">SEO excerpt<input required value={newExcerpt} onChange={e=>setNewExcerpt(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl glass-input text-white"/></label>
      </div>
      <label className="text-rose-200 block">Article body · maximum 400 words<textarea required rows={7} value={newContent} onChange={e=>setNewContent(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-xl glass-input text-white"/><span className={wordCount(newContent)>400?'text-red-300':'text-rose-300/60'}>{wordCount(newContent)} / 400 words</span></label>
      <label className="text-rose-200 block">Tags<input value={newTags} onChange={e=>setNewTags(e.target.value)} placeholder="university, AI, scholarship" className="w-full mt-1 px-3 py-2 rounded-xl glass-input text-white"/></label>
      <label className="text-rose-200 block">Research source URLs<textarea rows={2} value={sourceUrls} onChange={e=>setSourceUrls(e.target.value)} placeholder="One URL per line" className="w-full mt-1 px-3 py-2 rounded-xl glass-input text-white"/></label>
      <div className="grid md:grid-cols-2 gap-3">
        <label className="p-3 rounded-xl border border-white/10 text-rose-100 flex items-center gap-2 cursor-pointer"><ImageIcon className="w-4 h-4"/> Cover image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>setCover(e.target.files?.[0]||null)} className="block min-w-0 text-[10px]"/></label>
        <label className="p-3 rounded-xl border border-white/10 text-rose-100 flex items-center gap-2 cursor-pointer"><Video className="w-4 h-4"/> Images / videos<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" onChange={e=>setMedia(Array.from(e.target.files||[]))} className="block min-w-0 text-[10px]"/></label>
      </div>
      <p className="text-rose-200/60">Each media file must be under 50 MB. Supported: JPG, PNG, WebP, GIF, MP4, WebM.</p>
      <div className="flex justify-end gap-2"><button type="button" onClick={()=>setIsCreating(false)} className="px-4 py-2 text-rose-300">Cancel</button><button disabled={busy||wordCount(newContent)>400} type="submit" className="px-5 py-2 rounded-xl bg-rose-600 font-bold text-white disabled:opacity-40">{busy?<><Loader2 className="inline w-3 h-3 animate-spin mr-1"/>Saving…</>:'Save Draft'}</button></div>
    </form>}
    <div className="p-4 glass-panel rounded-2xl border border-white/10 flex flex-wrap gap-3 text-xs"><div className="relative flex-1 min-w-[220px]"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rose-300/60"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search articles…" className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-white"/></div><select value={selectedCategory} onChange={e=>setSelectedCategory(e.target.value)} className="px-3 py-2 rounded-xl glass-input bg-rose-950 text-white"><option>All</option><option>General</option><option>IELTS Preparation</option><option>Student Visa</option><option>Scholarships</option><option>Immigration</option></select></div>
    {filtered.length===0?<div className="p-12 text-center rounded-3xl glass-panel border border-white/10 text-rose-300/70"><BookOpen className="w-10 h-10 mx-auto mb-3"/><h3 className="text-white font-bold">No articles found</h3><p className="text-xs mt-1">Create an article or check the filters.</p></div>:<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{filtered.map(blog=><div key={blog.id} className="p-5 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between"><div><div className="flex items-center justify-between gap-2"><span className="text-[10px] text-rose-300">{blog.category} · {rows.find(x=>x.id===blog.id)?.language==='bn'?'বাংলা':'EN'}</span><button disabled={busy} onClick={()=>setStatus(blog.id,blog.status==='Published'?'DRAFT':'PUBLISHED')} className="px-2 py-1 rounded-full text-[10px] border border-emerald-400/30 text-emerald-200">{blog.status}</button></div><h3 className="font-bold text-white text-base mt-3">{blog.title}</h3><p className="text-xs text-rose-200/70 mt-2 line-clamp-3">{blog.excerpt}</p><div className="flex flex-wrap gap-1 mt-3">{blog.tags.map((t,i)=><span key={i} className="text-[10px] text-rose-300/70 bg-white/5 px-2 py-1 rounded">#{t}</span>)}</div></div><div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center text-xs text-rose-300/60"><span><Eye className="inline w-3 h-3 mr-1"/>{blog.views} views</span><button onClick={()=>setBlogToDelete(blog)} className="p-1 text-rose-400 hover:text-white"><Trash2 className="w-4 h-4"/></button></div></div>)}</div>}
    <ConfirmDeleteModal isOpen={!!blogToDelete} title="Delete Blog Article Permanently?" message="This will permanently delete the article from the editorial database." itemName={blogToDelete?.title} onConfirm={remove} onCancel={()=>setBlogToDelete(null)}/>
  </motion.div>;
};
