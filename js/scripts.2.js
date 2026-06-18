
// Theme toggle
const updateThemeColor = (theme) => {
    const colors = {
        light: '#e1e2e7',
        dark: '#24283b'
    };
    const metaTheme = document.getElementById('theme-meta-color');
    metaTheme.setAttribute('content', colors[theme] || colors.light);
};

document.getElementById('theme-toggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('mp-theme', next);
    updateThemeColor(next);
});

// Initialize theme color on page load
window.addEventListener('DOMContentLoaded', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    updateThemeColor(theme);
});

// Card mouse glow
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
    });
});

// Staggered reveal on load
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card').forEach((card, i) => {
    setTimeout(() => card.classList.add('animate-in'), 100 + i * 100);
    });
});
    
// Tetris Game
(function () {
    const COLS = 10, ROWS = 20, B = 20;
    const canvas  = document.getElementById('tetris-canvas');
    const ctx     = canvas.getContext('2d');
    const nCanvas = document.getElementById('tetris-next');
    const nCtx    = nCanvas.getContext('2d');

    const COLORS = [null,'#f7768e','#ff9e64','#e0af68','#9ece6a','#7dcfff','#7aa2f7','#bb9af7'];

    const SHAPES = [
    null,
    [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    [[2,2],[2,2]],
    [[0,3,0],[3,3,3],[0,0,0]],
    [[0,4,4],[4,4,0],[0,0,0]],
    [[5,5,0],[0,5,5],[0,0,0]],
    [[6,0,0],[6,6,6],[0,0,0]],
    [[0,0,7],[7,7,7],[0,0,0]],
    ];

    let board, current, next, pos, score, lines, level;
    let running = false, paused = false, gameOver = false;
    let lastTime = 0, raf;

    function getCSS(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
    function newBoard() { return Array.from({length: ROWS}, () => Array(COLS).fill(0)); }
    function randPiece() { const t = Math.ceil(Math.random()*7); return {t, m: SHAPES[t].map(r=>[...r])}; }

    function setScore(v) { document.getElementById('tetris-score').textContent = v; }
    function setLines(v) { document.getElementById('tetris-lines').textContent = v; }

    function reset() {
    board = newBoard(); score = 0; lines = 0; level = 1;
    gameOver = false; paused = false; running = false;
    current = null; next = randPiece();
    setScore(0); setLines(0);
    drawBoard(); drawNext();
    }

    function spawn() {
    current = next; next = randPiece();
    pos = { x: Math.floor(COLS/2) - Math.floor(current.m[0].length/2), y: 0 };
    drawNext();
    if (overlaps()) { gameOver = true; running = false; drawBoard(); }
    }

    function overlaps(dx=0, dy=0, mat=null) {
    const m = mat || current.m;
    for (let r=0; r<m.length; r++)
        for (let c=0; c<m[r].length; c++) {
        if (!m[r][c]) continue;
        const nx=pos.x+c+dx, ny=pos.y+r+dy;
        if (nx<0||nx>=COLS||ny>=ROWS) return true;
        if (ny>=0&&board[ny][nx]) return true;
        }
    return false;
    }

    function rotate90(m) {
    const rows=m.length, cols=m[0].length;
    const r=Array.from({length:cols},()=>Array(rows).fill(0));
    for (let i=0;i<rows;i++) for (let j=0;j<cols;j++) r[j][rows-1-i]=m[i][j];
    return r;
    }

    function tryRotate() {
    const rot = rotate90(current.m);
    for (const dx of [0,-1,1,-2,2]) {
        if (!overlaps(dx,0,rot)) { current.m=rot; pos.x+=dx; return; }
    }
    }

    function lock() {
    current.m.forEach((row,r)=>row.forEach((v,c)=>{ if(v&&pos.y+r>=0) board[pos.y+r][pos.x+c]=v; }));
    let cleared=0;
    for (let r=ROWS-1; r>=0;) {
        if (board[r].every(v=>v)) { board.splice(r,1); board.unshift(Array(COLS).fill(0)); cleared++; }
        else r--;
    }
    if (cleared) {
        score+=[0,100,300,500,800][cleared]*level;
        lines+=cleared; level=Math.floor(lines/10)+1;
        setScore(score); setLines(lines);
    }
    spawn();
    }

    function softDrop() {
    if (!overlaps(0,1)) pos.y++; else lock();
    lastTime=performance.now();
    }

    function hardDrop() { while(!overlaps(0,1)) pos.y++; lock(); lastTime=performance.now(); }

    function block(c, x, y, color) {
    c.fillStyle=color;
    c.fillRect(x*B+1,y*B+1,B-2,B-2);
    c.fillStyle='rgba(255,255,255,0.18)';
    c.fillRect(x*B+2,y*B+2,B-4,3);
    c.fillStyle='rgba(0,0,0,0.15)';
    c.fillRect(x*B+1,y*B+B-4,B-2,3);
    }

    function drawBoard() {
    ctx.fillStyle=getCSS('--bg-card');
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle=getCSS('--border'); ctx.lineWidth=0.4;
    for (let r=0;r<ROWS;r++) for (let c=0;c<COLS;c++) ctx.strokeRect(c*B,r*B,B,B);
    board.forEach((row,r)=>row.forEach((v,c)=>{ if(v) block(ctx,c,r,COLORS[v]); }));

    if (current&&running&&!paused) {
        let g=0; while(!overlaps(0,g+1)) g++;
        ctx.globalAlpha=0.18;
        current.m.forEach((row,r)=>row.forEach((v,c)=>{ if(v) block(ctx,pos.x+c,pos.y+r+g,COLORS[v]); }));
        ctx.globalAlpha=1;
    }
    if (current) current.m.forEach((row,r)=>row.forEach((v,c)=>{ if(v) block(ctx,pos.x+c,pos.y+r,COLORS[v]); }));

    if (gameOver)       overlay('GAME OVER','Press Restart');
    else if (!running)  overlay('TETRIS','Press Start');
    else if (paused)    overlay('PAUSED','Press Resume');
    }

    function overlay(title,sub) {
    ctx.fillStyle='rgba(0,0,0,0.58)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.textAlign='center';
    ctx.fillStyle='#fff'; ctx.font='bold 14px Sora,sans-serif';
    ctx.fillText(title,canvas.width/2,canvas.height/2-8);
    ctx.font='11px Sora,sans-serif'; ctx.fillStyle='rgba(255,255,255,0.7)';
    ctx.fillText(sub,canvas.width/2,canvas.height/2+12);
    }

    function drawNext() {
    nCtx.fillStyle=getCSS('--bg-card');
    nCtx.fillRect(0,0,nCanvas.width,nCanvas.height);
    if (!next) return;
    const m=next.m;
    const ox=Math.floor((4-m[0].length)/2), oy=Math.floor((4-m.length)/2);
    m.forEach((row,r)=>row.forEach((v,c)=>{ if(v) block(nCtx,ox+c,oy+r,COLORS[v]); }));
    }

    const SPEED = () => Math.max(80, 850-(level-1)*75);

    function gameLoop(ts) {
    if (!running||paused||gameOver) return;
    if (ts-lastTime>SPEED()) softDrop();
    drawBoard();
    raf=requestAnimationFrame(gameLoop);
    }

    function startGame() {
    if (gameOver) reset();
    spawn(); running=true; paused=false;
    lastTime=performance.now();
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(gameLoop);
    document.getElementById('tetris-btn').textContent='Pause';
    }

    function togglePause() {
    if (!running||gameOver) { startGame(); return; }
    paused=!paused;
    document.getElementById('tetris-btn').textContent=paused?'Resume':'Pause';
    if (!paused) { lastTime=performance.now(); raf=requestAnimationFrame(gameLoop); }
    drawBoard();
    }

    document.getElementById('tetris-btn').addEventListener('click', togglePause);
    document.getElementById('tetris-restart').addEventListener('click', ()=>{ cancelAnimationFrame(raf); reset(); startGame(); });

    document.addEventListener('keydown', e=>{
    if (!running||paused||gameOver) return;
    if (!['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Space'].includes(e.code)) return;
    e.preventDefault();
    if (e.code==='ArrowLeft' &&!overlaps(-1,0)) pos.x--;
    if (e.code==='ArrowRight'&&!overlaps(1,0))  pos.x++;
    if (e.code==='ArrowDown')  softDrop();
    if (e.code==='ArrowUp')    tryRotate();
    if (e.code==='Space')      hardDrop();
    drawBoard();
    });

    document.getElementById('t-left').addEventListener('click',  ()=>{ if(running&&!paused&&!gameOver&&!overlaps(-1,0)){pos.x--;drawBoard();} });
    document.getElementById('t-right').addEventListener('click', ()=>{ if(running&&!paused&&!gameOver&&!overlaps(1,0)) {pos.x++;drawBoard();} });
    document.getElementById('t-rotate').addEventListener('click',()=>{ if(running&&!paused&&!gameOver){tryRotate();drawBoard();} });
    document.getElementById('t-drop').addEventListener('click',  ()=>{ if(running&&!paused&&!gameOver){hardDrop();drawBoard();} });

    reset();
})();

// Dot grid hover effect (hero section)
(function () {
    const canvas = document.getElementById('dot-grid');
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;

    const SPACING = 28;     // distance between dots
    const BASE_R = 1.2;     // resting dot radius
    const MAX_R = 3.6;      // dot radius at cursor center
    const RADIUS = 160;     // glow influence radius in px
    const PULL = 10;        // max px a dot drifts toward the cursor

    let dots = [];
    let mouse = { x: -9999, y: -9999 };
    let targetMouse = { x: -9999, y: -9999 };
    let dpr = window.devicePixelRatio || 1;

    function getCSS(v) {
    return getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    }

    function resize() {
    const rect = hero.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildDots(rect.width, rect.height);
    }

    function buildDots(w, h) {
    dots = [];
    const cols = Math.floor(w / SPACING);
    const rows = Math.floor(h / SPACING);
    const offX = (w - cols * SPACING) / 2 + SPACING / 2;
    const offY = (h - rows * SPACING) / 2 + SPACING / 2;
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
        dots.push({ x: offX + c * SPACING, y: offY + r * SPACING });
        }
    }
    }

    function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // smooth/ease the mouse position for a softer trailing feel
    mouse.x += (targetMouse.x - mouse.x) * 0.18;
    mouse.y += (targetMouse.y - mouse.y) * 0.18;

    const dotColor = getCSS('--accent') || '#7aa2f7';
    const baseColor = getCSS('--text-muted') || '#888';

    for (const d of dots) {
        const dx = d.x - mouse.x, dy = d.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - dist / RADIUS); // 0..1 proximity

        // pull the dot a little toward the cursor, eased toward its target offset
        const pull = t * t * PULL; // ease-in so far dots barely move
        const nx = dist > 0.001 ? dx / dist : 0;
        const ny = dist > 0.001 ? dy / dist : 0;
        const targetOffX = -nx * pull;
        const targetOffY = -ny * pull;
        d.offX = (d.offX || 0) + (targetOffX - (d.offX || 0)) * 0.25;
        d.offY = (d.offY || 0) + (targetOffY - (d.offY || 0)) * 0.25;

        const drawX = d.x + d.offX;
        const drawY = d.y + d.offY;

        const r = BASE_R + (MAX_R - BASE_R) * t;
        const alpha = 0.10 + 0.85 * t;

        ctx.beginPath();
        ctx.arc(drawX, drawY, r, 0, Math.PI * 2);

        if (t > 0.02) {
        ctx.fillStyle = dotColor;
        ctx.globalAlpha = alpha;
        } else {
        ctx.fillStyle = baseColor;
        ctx.globalAlpha = 0.16;
        }
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
    }

    hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    targetMouse.x = e.clientX - rect.left;
    targetMouse.y = e.clientY - rect.top;
    });

    hero.addEventListener('mouseleave', () => {
    targetMouse.x = -9999;
    targetMouse.y = -9999;
    });

    window.addEventListener('resize', resize);

    resize();
    requestAnimationFrame(draw);
})();