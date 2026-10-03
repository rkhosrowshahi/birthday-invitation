(() => {
 const canvas=document.querySelector('#sculpture'),ctx=canvas.getContext('2d');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let w=0,h=0,burst=0,particles=[],pointer={x:0,y:0},score=0;
 const target=document.querySelector('#spark-target'),status=document.querySelector('#game-status'),restart=document.querySelector('#core-trigger');
 restart.hidden=true;
 function moveTarget(){target.style.left=`${15+Math.random()*65}%`;target.style.top=`${12+Math.random()*48}%`;}
 moveTarget();
 target.addEventListener('click',()=>{score++;ignite();if(score===5){target.hidden=true;restart.hidden=false;status.textContent='Launch complete. See you at the party!';}else{status.textContent=`Catch 5 shooting stars to launch the party. ${score} / 5`;moveTarget();}});
 restart.addEventListener('click',()=>{score=0;target.hidden=false;restart.hidden=true;status.textContent='Catch 5 shooting stars to launch the party. 0 / 5';moveTarget();});
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
 // A deep starfield with drifting constellations and meteor trails.
 for(let i=0;i<85;i++){
 const x=((Math.sin(i*127.1)*43758.5453)%1+1)%1*w;
 const y=((Math.cos(i*311.7)*19731.31)%1+1)%1*h;
 const light=.2+.6*(Math.sin(time*.8+i)+1)/2;
 ctx.fillStyle=`rgba(255,230,230,${light})`;ctx.fillRect(x,y,i%9===0?2:1,i%9===0?2:1);
 }
 for(let i=0;i<4;i++){
 const progress=(time*.11+i*.27)%1,x=w*(1.15-progress*1.3),y=h*(.05+progress*.75)+i*14;
 const trail=ctx.createLinearGradient(x,y,x+55,y-35);trail.addColorStop(0,'#ff3548cc');trail.addColorStop(1,'#ff354800');
 ctx.strokeStyle=trail;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+55,y-35);ctx.stroke();
 }
 ctx.save();ctx.translate(cx,cy);const angle=reduced?-.5:Math.sin(time*.35)*.12-.5;ctx.rotate(angle);
 ctx.shadowColor='#e52e35';ctx.shadowBlur=22;
 ctx.fillStyle='#e52e35';ctx.beginPath();ctx.moveTo(0,-R*.8);ctx.bezierCurveTo(R*.5,-R*.4,R*.4,R*.3,R*.26,R*.48);ctx.lineTo(-R*.26,R*.48);ctx.bezierCurveTo(-R*.4,R*.3,-R*.5,-R*.4,0,-R*.8);ctx.fill();ctx.shadowBlur=0;
 ctx.fillStyle='#fff1f2';ctx.beginPath();ctx.arc(0,-R*.1,R*.13,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#991322';ctx.beginPath();ctx.moveTo(-R*.25,R*.1);ctx.lineTo(-R*.6,R*.55);ctx.lineTo(-R*.22,R*.4);ctx.moveTo(R*.25,R*.1);ctx.lineTo(R*.6,R*.55);ctx.lineTo(R*.22,R*.4);ctx.fill();
 const flame=R*(.28+.12*Math.sin(time*14)+burst*.5);ctx.fillStyle='#ff8a8a';ctx.beginPath();ctx.moveTo(-R*.15,R*.5);ctx.lineTo(0,R*.5+flame);ctx.lineTo(R*.15,R*.5);ctx.fill();ctx.restore();
 for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.035;p.life-=.015;ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,p.size,p.size)}ctx.globalAlpha=1;particles=particles.filter(p=>p.life>0);burst*=.95;
 }
 requestAnimationFrame(frame)
 }requestAnimationFrame(frame);
})();
