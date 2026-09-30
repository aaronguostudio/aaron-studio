"""Price 30 days of local Claude Code + Codex usage at official API list prices (retrieved 2026-09-30)."""
import json, os, glob, time, collections
CUT="2026-08-31"; END="2026-09-30"; now=time.time()
# Anthropic: in, cw5m, cw1h, cache_read, out
A={"claude-fable-5-1":(10,12.5,20,0.25,50),"claude-opus-5-5":(4,5,8,0.20,20),"claude-opus-5":(5,6.25,10,0.50,25),
   "claude-opus-4-8":(5,6.25,10,0.50,25),"claude-sonnet-5":(2,2.5,4,0.20,10),"claude-sonnet-5-5":(2,2.5,4,0.20,10),
   "claude-haiku-4-5-20251001":(1,1.25,2,0.10,5)}
# OpenAI: in, cached, cache_write, out
O={"gpt-6-astra":(10,1.0,12.5,50),"gpt-6.1-sol":(2,0.10,2.5,10),"gpt-6-sol":(2,0.20,2.5,10),"gpt-6-luna":(0.10,0.01,0.125,0.5),
   "gpt-5.6-sol":(4,0.40,5,20),"gpt-5.6-terra":(2,0.20,2.5,12),"gpt-5.5":(5,0.50,5,30)}
cc=collections.defaultdict(collections.Counter); seen=set(); ccdays=set()
for f in glob.glob(os.path.expanduser("~/.claude/projects/**/*.jsonl"), recursive=True):
    if now-os.path.getmtime(f)>32*86400: continue
    for line in open(f, errors="ignore"):
        if '"usage"' not in line: continue
        try:o=json.loads(line)
        except: continue
        if o.get("type")!="assistant": continue
        ts=o.get("timestamp","")[:10]
        if not (CUT<=ts<END): continue
        m=o.get("message") or {}; u=m.get("usage") or {}; k=(m.get("id"),o.get("requestId"))
        if k in seen or m.get("model") in (None,"<synthetic>"): continue
        seen.add(k); ccdays.add(ts)
        cw=u.get("cache_creation_input_tokens",0) or 0; cc5=cc1=0
        c=u.get("cache_creation") or {}
        if c: cc5=c.get("ephemeral_5m_input_tokens",0) or 0; cc1=c.get("ephemeral_1h_input_tokens",0) or 0
        else: cc5=cw
        cc[m["model"]].update(i=u.get("input_tokens",0) or 0,w5=cc5,w1=cc1,r=u.get("cache_read_input_tokens",0) or 0,o=u.get("output_tokens",0) or 0)
tA=0; print(f"CLAUDE CODE {CUT}..{END} active days {len(ccdays)}")
for mdl,c in sorted(cc.items(), key=lambda x:-x[1]['r']):
    p=A.get(mdl)
    if not p: print("  no price", mdl, dict(c)); continue
    parts=dict(inp=c['i']*p[0],w5=c['w5']*p[1],w1=c['w1']*p[2],read=c['r']*p[3],out=c['o']*p[4])
    cost=sum(parts.values())/1e6; tA+=cost
    print(f"  {mdl:26s} ${cost:9,.0f}  read={c['r']/1e9:.2f}B w5={c['w5']/1e6:.0f}M w1={c['w1']/1e6:.0f}M out={c['o']/1e6:.1f}M  read_share={parts['read']/1e6/cost:.0%}")
print(f"  TOTAL ${tA:,.0f}")
cx=collections.defaultdict(collections.Counter); cxdays=set()
for f in glob.glob(os.path.expanduser("~/.codex/sessions/**/*.jsonl"), recursive=True):
    if now-os.path.getmtime(f)>32*86400: continue
    model=None; prev=None
    for line in open(f, errors="ignore"):
        try:o=json.loads(line)
        except: continue
        p=o.get("payload") or {}
        if o.get("type")=="turn_context" and p.get("model"): model=p["model"]
        if p.get("type")!="token_count": continue
        tot=(p.get("info") or {}).get("total_token_usage")
        if not tot: continue
        ts=o.get("timestamp","")[:10]
        d={k:tot.get(k,0)-(prev or {}).get(k,0) for k in ("input_tokens","cached_input_tokens","cache_write_input_tokens","output_tokens")}
        prev=tot
        if not (CUT<=ts<END) or d["input_tokens"]<0 or d["output_tokens"]<0 or (d["input_tokens"]==0 and d["output_tokens"]==0): continue
        cx[model].update(d); cxdays.add(ts)
tO=0; print(f"CODEX {CUT}..{END} active days {len(cxdays)}")
for mdl,c in sorted(cx.items(), key=lambda x:-x[1]['input_tokens']):
    p=O[mdl]; unc=c['input_tokens']-c['cached_input_tokens']-c['cache_write_input_tokens']
    parts=dict(inp=unc*p[0],read=c['cached_input_tokens']*p[1],w=c['cache_write_input_tokens']*p[2],out=c['output_tokens']*p[3])
    cost=sum(parts.values())/1e6; tO+=cost
    print(f"  {mdl:14s} ${cost:8,.0f}  in={c['input_tokens']/1e9:.2f}B cached={c['cached_input_tokens']/1e9:.2f}B out={c['output_tokens']/1e6:.1f}M read_share={parts['read']/1e6/cost:.0%}")
    if mdl=="gpt-6-astra":
        q=O["gpt-6.1-sol"]; alt=(unc*q[0]+c['cached_input_tokens']*q[1]+c['cache_write_input_tokens']*q[2]+c['output_tokens']*q[3])/1e6
        print(f"     same Astra tokens at gpt-6.1-sol: ${alt:,.0f} ({alt/cost:.0%})")
print(f"  TOTAL ${tO:,.0f}")
