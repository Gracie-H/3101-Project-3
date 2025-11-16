import { useEffect, useMemo, useState } from "react";
import { INITIAL_ITEMS, REASONS } from "./data/item.js";

const COLUMNS = [
  { id: "ai", name: "AI 生成" },
  { id: "real", name: "真实拍摄" },
  { id: "unsure", name: "不确定" }
];

function shuffle(arr){ return [...arr].sort(()=>Math.random()-0.5); }

export default function App() {
  // items: { id,title,thumb,isAI }
  // placed: map id -> { colId, order, notes: string, reasons: string[] }
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("aionot_items");
    return saved ? JSON.parse(saved) : shuffle(INITIAL_ITEMS);
  });

  const [placed, setPlaced] = useState(() => {
    const saved = localStorage.getItem("aionot_placed");
    return saved ? JSON.parse(saved) : {};
  });

  const [revealed, setRevealed] = useState(() => {
    const saved = localStorage.getItem("aionot_revealed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => { localStorage.setItem("aionot_items", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("aionot_placed", JSON.stringify(placed)); }, [placed]);
  useEffect(() => { localStorage.setItem("aionot_revealed", JSON.stringify(revealed)); }, [revealed]);

  // 每列清单（按 order 排序）
  const columns = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map(c => [c.id, []]));
    Object.entries(placed).forEach(([id, info]) => {
      if (info.colId) map[info.colId].push({ id, order: info.order });
    });
    COLUMNS.forEach(c => map[c.id].sort((a,b)=>a.order-b.order));
    return map;
  }, [placed]);

  // 打分
  const totalPlaced = Object.values(placed).filter(p=>p.colId).length;
  const score = useMemo(()=> {
    if (!revealed) return { correct: 0, total: totalPlaced, percent: 0 };
    let correct = 0;
    for (const it of items) {
      const p = placed[it.id];
      if (!p || !p.colId) continue;
      const guess = p.colId === "ai" ? true : (p.colId === "real" ? false : null);
      if (guess !== null && guess === it.isAI) correct++;
    }
    const percent = totalPlaced ? Math.round(correct * 100 / totalPlaced) : 0;
    return { correct, total: totalPlaced, percent };
  }, [revealed, placed, items, totalPlaced]);

  // Drag & Drop
  function onDragStart(e, id){
    e.dataTransfer.setData("text/plain", id);
  }
  function onDropColumn(e, colId){
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    setPlaced(prev=>{
      const next = { ...prev };
      const maxOrder = Math.max(-1, ...(Object.values(next)
        .filter(p=>p.colId===colId).map(p=>p.order)));
      next[id] = { ...(next[id]||{}), colId, order: maxOrder+1, reasons: (next[id]?.reasons)||[], notes: (next[id]?.notes)||"" };
      return next;
    });
  }
  const allowDrop = e => e.preventDefault();

  function moveUp(id){
    setPlaced(prev=>{
      const p = prev[id]; if (!p) return prev;
      const siblings = Object.entries(prev).filter(([_,v])=>v.colId===p.colId)
        .sort((a,b)=>a[1].order-b[1].order);
      const idx = siblings.findIndex(([k])=>k===id);
      if (idx<=0) return prev;
      const beforeId = siblings[idx-1][0];
      const next = { ...prev };
      const tmp = next[id].order;
      next[id] = { ...next[id], order: next[beforeId].order };
      next[beforeId] = { ...next[beforeId], order: tmp };
      return next;
    });
  }
  function moveDown(id){
    setPlaced(prev=>{
      const p = prev[id]; if (!p) return prev;
      const siblings = Object.entries(prev).filter(([_,v])=>v.colId===p.colId)
        .sort((a,b)=>a[1].order-b[1].order);
      const idx = siblings.findIndex(([k])=>k===id);
      if (idx===-1 || idx===siblings.length-1) return prev;
      const afterId = siblings[idx+1][0];
      const next = { ...prev };
      const tmp = next[id].order;
      next[id] = { ...next[id], order: next[afterId].order };
      next[afterId] = { ...next[afterId], order: tmp };
      return next;
    });
  }
  function removeFromColumn(id){
    setPlaced(prev => ({ ...prev, [id]: { ...prev[id], colId: null } }));
  }
  function deleteItem(id){
    setItems(prev => prev.filter(it=>it.id!==id));
    setPlaced(prev => {
      const n = { ...prev }; delete n[id]; return n;
    });
  }

  function toggleReason(id, reason){
    setPlaced(prev=>{
      const info = prev[id] || { reasons:[], notes:"", colId:null, order:0 };
      const set = new Set(info.reasons||[]);
      set.has(reason) ? set.delete(reason) : set.add(reason);
      return { ...prev, [id]: { ...info, reasons: Array.from(set) } };
    });
  }
  function updateNotes(id, val){
    setPlaced(prev=>{
      const info = prev[id] || { reasons:[], notes:"", colId:null, order:0 };
      return { ...prev, [id]: { ...info, notes: val } };
    });
  }

  function reveal(){ setRevealed(true); }
  function resetReveal(){ setRevealed(false); }
  function clearAll(){ setPlaced({}); setRevealed(false); }
  function shufflePalette(){ setItems(shuffle(items)); }

  function addItem(){
    const title = prompt("图片标题/描述：");
    if (!title) return;
    const emoji = prompt("给它一个 emoji（可留空）例如：📷");
    const answer = prompt("标准答案？输入 ai / real / unknown（可留空）");
    const map = { ai:true, real:false };
    const isAI = typeof map[answer?.toLowerCase?.()] === "boolean" ? map[answer.toLowerCase()] : null;
    const id = crypto.randomUUID();
    setItems(prev => [{ id, title, thumb: emoji || "🖼️", isAI }, ...prev]);
  }

  function exportJSON(){
    const blob = new Blob([JSON.stringify({ items, placed, revealed }, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "ai-or-not-archive.json"; a.click();
    URL.revokeObjectURL(url);
  }
  function importJSON(ev){
    const f = ev.target.files?.[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.items) setItems(data.items);
        if (data.placed) setPlaced(data.placed);
        if (typeof data.revealed === "boolean") setRevealed(data.revealed);
      } catch(e){}
    };
    reader.readAsText(f);
    ev.target.value = "";
  }

  return (
    <div className="wrap">
      <header className="topbar">
        <div className="title">
          <h1>AI or Not — 可重排图像档案</h1>
        </div>
        <div className="controls">
          <button onClick={addItem}>+ 添加图片</button>
          <button onClick={shufflePalette}>洗牌</button>
          <button onClick={clearAll}>清空摆放</button>
          {!revealed ? (
            <button className="primary" onClick={reveal}>🔍 揭晓并打分</button>
          ) : (
            <button onClick={resetReveal}>隐藏答案</button>
          )}
          <button onClick={exportJSON}>导出JSON</button>
          <label className="import">导入JSON<input type="file" accept="application/json" onChange={importJSON}/></label>
        </div>
        <ScoreBar revealed={revealed} score={score}/>
      </header>

      <section className="board">
        <Palette
          items={items}
          placed={placed}
          onDragStart={onDragStart}
          deleteItem={deleteItem}
        />

        <div className="columns">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              col={col}
              columns={columns}
              items={items}
              placed={placed}
              onDropColumn={onDropColumn}
              allowDrop={allowDrop}
              revealed={revealed}
              moveUp={moveUp}
              moveDown={moveDown}
              removeFromColumn={removeFromColumn}
              toggleReason={toggleReason}
              updateNotes={updateNotes}
            />
          ))}
        </div>
      </section>

      <footer className="footer muted">
        <p>理由提示（非模型检测，仅可解释线索）：{REASONS.join(" / ")}。</p>
      </footer>
    </div>
  );
}

function ScoreBar({ revealed, score }){
  return (
    <div className="scorebar">
      <div className="meter">
        <div className="fill" style={{ width: `${revealed ? score.percent : 0}%` }} />
      </div>
      <div className="scoretext">
        {revealed ? <>正确 {score.correct} / {score.total}（{score.percent}%）</> : <>已放 {score.total} 项，点击「揭晓并打分」</>}
      </div>
    </div>
  );
}

function Palette({ items, placed, onDragStart, deleteItem }){
  const idle = items.filter(it => !placed[it.id]?.colId);
  return (
    <div className="palette">
      <h2>待判定（拖到右侧三列）</h2>
      <div className="grid">
        {idle.map(it => (
          <Card
            key={it.id}
            it={it}
            draggable
            onDragStart={onDragStart}
            actions={<button className="ghost" onClick={()=>deleteItem(it.id)}>删除</button>}
          />
        ))}
        {idle.length===0 && <div className="hint">都已分到列里啦～</div>}
      </div>
    </div>
  );
}

function Column({
  col, columns, items, placed, onDropColumn, allowDrop, revealed,
  moveUp, moveDown, removeFromColumn, toggleReason, updateNotes
}){
  const list = (columns[col.id]||[]).map(({id}) => items.find(x=>x.id===id));
  return (
    <div className="column" onDragOver={allowDrop} onDrop={(e)=>onDropColumn(e, col.id)}>
      <div className="colHeader"><strong>{col.name}</strong><span className="badge">{list.length}</span></div>
      <div className="grid droptarget">
        {list.map((it) => {
          const info = placed[it.id] || {};
          const guess = col.id==="ai" ? true : (col.id==="real" ? false : null);
          const isCorrect = revealed && guess!==null ? (guess===it.isAI) : null;
          return (
            <Card
              key={it.id}
              it={it}
              draggable
              onDragStart={(e)=>onDragStart(e, it.id)}
              stateBadge={revealed ? (isCorrect ? "ok" : "bad") : null}
              actions={
                <div className="row">
                  <button className="ghost" onClick={()=>moveUp(it.id)}>↑</button>
                  <button className="ghost" onClick={()=>moveDown(it.id)}>↓</button>
                  <button className="ghost" onClick={()=>removeFromColumn(it.id)}>移回</button>
                </div>
              }
              extra={
                <div className="meta">
                  <ReasonPicker
                    reasons={REASONS}
                    picked={info.reasons||[]}
                    onToggle={(r)=>toggleReason(it.id, r)}
                    disabled={revealed}
                  />
                  <textarea
                    className="notes"
                    placeholder="写下你的判断理由…"
                    value={info.notes||""}
                    onChange={e=>updateNotes(it.id, e.target.value)}
                    disabled={revealed}
                  />
                </div>
              }
            />
          );
        })}
        {list.length===0 && <div className="hint">拖放到这里</div>}
      </div>
    </div>
  );
}

function Card({ it, draggable=false, onDragStart, actions, extra, stateBadge=null }){
  return (
    <div
      className={`card ${stateBadge==='ok'?'ok':''} ${stateBadge==='bad'?'bad':''}`}
      draggable={draggable}
      onDragStart={draggable ? (e)=>onDragStart(e, it.id) : undefined}
      title={`答案：${it.isAI===true?'AI':it.isAI===false?'真实':'未知'}`}
    >
      <div className="thumb">{it.thumb || "🖼️"}</div>
      <div className="title">{it.title}</div>
      {stateBadge && <div className={`badgeResult ${stateBadge}`}>{stateBadge==='ok'?'✔':'✘'}</div>}
      {actions && <div className="actions">{actions}</div>}
      {extra}
    </div>
  );
}

function ReasonPicker({ reasons, picked, onToggle, disabled }){
  return (
    <div className="reasons">
      {reasons.map(r => {
        const on = picked.includes(r);
        return (
          <button
            key={r}
            className={`chip ${on?'on':''}`}
            onClick={()=>!disabled && onToggle(r)}
            type="button"
          >{r}</button>
        );
      })}
    </div>
  );
}
