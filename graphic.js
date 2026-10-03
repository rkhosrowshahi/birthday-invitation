(() => {
 const canvas=document.querySelector('#sculpture'),ctx=canvas.getContext('2d');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let w=0,h=0,burst=0,particles=[],pointer={x:0,y:0},score=0;
 const target=document.querySelector('#spark-target'),status=document.querySelector('#game-status'),restart=document.querySelector('#core-trigger');
 restart.hidden=true;
 function moveTarget(){target.style.left=`${15+Math.random()*65}%`;target.style.top=`${12+Math.random()*48}%`;}
 moveTarget();
 target.addEventListener('click',()=>{score++;ignite();if(score===5){target.hidden=true;restart.hidden=false;status.textContent='Party powered up. Now hit Yes!';}else{status.textContent=`Catch 5 sparks to power up the party. ${score} / 5`;moveTarget();}});
 restart.addEventListener('click',()=>{score=0;target.hidden=false;restart.hidden=true;status.textContent='Catch 5 sparks to power up the party. 0 / 5';moveTarget();});
 const colors=['#ff2535','#bd1727','#ff626c','#ffb6bc'];
 function size(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0)}
 new ResizeObserver(size).observe(canvas);
 function ignite(){burst=1;for(let i=0;i<90;i++){const a=Math.random()*Math.PI*2,s=2+Math.random()*7;particles.push({x:w/2,y:h/2,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,color:colors[i%4],size:2+Math.random()*4})}}

 document.querySelector('#no').addEventListener('click',ignite);
 canvas.parentElement.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();pointer.x=(e.clientX-r.left-w/2)*.05;pointer.y=(e.clientY-r.top-h/2)*.05});
 canvas.parentElement.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0});
 function frame(t){
 if(w&&h&&!document.hidden){
 ctx.clearRect(0,0,w,h);const time=reduced?0:t*.001,cx=w/2+pointer.x,cy=h/2+pointer.y,R=Math.min(w,h)*.32;
 const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,R*1.5);glow.addColorStop(0,'#ff253525');glow.addColorStop(.6,'#ff25350a');glow.addColorStop(1,'#ff253500');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 for(let ring=0;ring<4;ring++){
 const radius=R*(.58+ring*.19)*(1+burst*.25);
 ctx.beginPath();
 for(let i=0;i<=160;i++){const a=i/160*Math.PI*2;const warp=1+.11*Math.sin(a*6+time*(ring%2?1:-1)*1.6)+.045*Math.cos(a*11-time*2);const x=cx+Math.cos(a)*radius*warp,y=cy+Math.sin(a)*radius*warp*.84;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
 ctx.closePath();ctx.strokeStyle=colors[ring];ctx.lineWidth=ring===0?3:1.5;ctx.shadowColor=colors[ring];ctx.shadowBlur=ring===0?18:8;ctx.stroke();ctx.shadowBlur=0;
 for(let k=0;k<5;k++){const a=k/5*Math.PI*2+time*(ring%2?-.35:.4)+ring;ctx.fillStyle=colors[ring];ctx.beginPath();ctx.arc(cx+Math.cos(a)*radius,cy+Math.sin(a)*radius*.84,3,0,Math.PI*2);ctx.fill()}
 }
 ctx.save();ctx.translate(cx,cy);ctx.rotate(time*.2);ctx.strokeStyle='#ff626c55';ctx.lineWidth=1;for(let i=0;i<24;i++){const a=i/24*Math.PI*2;ctx.beginPath();ctx.moveTo(Math.cos(a)*R*1.32,Math.sin(a)*R*1.12);ctx.lineTo(Math.cos(a)*R*1.4,Math.sin(a)*R*1.2);ctx.stroke()}ctx.restore();
 ctx.fillStyle='#fff1f2';ctx.font=`700 ${Math.round(R*.55)}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(score===5?'Ready!':`${score}/5`,cx,cy);
 for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.035;p.life-=.015;ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size)}ctx.globalAlpha=1;particles=particles.filter(p=>p.life>0);burst*=.95;
 }
 requestAnimationFrame(frame)
 }requestAnimationFrame(frame);
})();
