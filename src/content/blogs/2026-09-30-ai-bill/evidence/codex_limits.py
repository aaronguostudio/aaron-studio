import json, os, glob, time, collections, datetime as dt
CUT="2026-08-30"; now=time.time()
weeks=collections.defaultdict(float); acct=collections.Counter(); tok=collections.defaultdict(collections.Counter)
lids=collections.Counter()
for f in glob.glob(os.path.expanduser("~/.codex/sessions/**/*.jsonl"), recursive=True):
    if now-os.path.getmtime(f)>36*86400: continue
    model=None; prev=None
    for line in open(f, errors="ignore"):
        try:o=json.loads(line)
        except: continue
        p=o.get("payload") or {}
        if o.get("type")=="turn_context" and p.get("model"): model=p["model"]
        if p.get("type")!="token_count": continue
        ts=o.get("timestamp","")
        rl=p.get("rate_limits") or {}
        plan=rl.get("plan_type"); lid=rl.get("limit_id"); 
        for slot in ("primary","secondary"):
            w=rl.get(slot) or {}
            if w.get("window_minutes")==10080 and w.get("resets_at") and ts>=CUT:
                k=(plan,lid,slot,dt.datetime.fromtimestamp(w["resets_at"]).strftime("%m-%d"))
                weeks[k]=max(weeks[k],w.get("used_percent") or 0)
                lids[(plan,lid,slot)]+=1
        tot=(p.get("info") or {}).get("total_token_usage")
        if tot and ts>=CUT:
            d_in=tot["input_tokens"]-(prev or {}).get("input_tokens",0); d_out=tot["output_tokens"]-(prev or {}).get("output_tokens",0)
            d_c=tot.get("cached_input_tokens",0)-(prev or {}).get("cached_input_tokens",0)
            if d_in>0 or d_out>0: tok[(plan,model)].update(i=d_in,c=d_c,o=d_out)
        if tot: prev=tot
print("limit buckets:",dict(lids))
for k,v in sorted(weeks.items(), key=lambda x:(x[0][0] or '',x[0][1] or '',x[0][2],x[0][3])): print(k, f"{v:.0f}%")
print("tokens by plan/model (M):")
for k,c in sorted(tok.items(), key=lambda x:-x[1]['i']): print(k, round(c['i']/1e6,1), round(c['c']/1e6,1), round(c['o']/1e6,2))
