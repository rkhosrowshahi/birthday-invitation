// An original parametric knot: a rotating ribbon of light, drawn as a point cloud.
(() => {
 const canvas = document.querySelector('#sculpture');
 const ctx = canvas.getContext('2d');
 const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
 let width=0,height=0,time=0,pulse=0,targetX=0,targetY=0,rx=0,ry=0,visible=true;
 const points=[];
 for(let i=0;i<560;i++) {
  const t=i/560*Math.PI*2;
  const radius=2+Math.cos(3*t);
  points.push({x:radius*Math.cos(2*t),y:radius*Math.sin(2*t),z:Math.sin(3*t),t});
 }
 function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);}
 new ResizeObserver(resize).observe(canvas);
 document.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();targetY=(e.clientX-(r.left+r.width/2))/Math.max(innerWidth,1)*.8;targetX=(e.clientY-(r.top+r.height/2))/Math.max(innerHeight,1)*.5;});
 document.querySelector('#no').addEventListener('click',()=>{pulse=1;});
 document.addEventListener('visibilitychange',()=>{visible=!document.hidden;});
 function draw(stamp){
  if(visible && width && height){
   time=reduced?0:stamp*.00022;rx+=(targetX-rx)*.035;ry+=(targetY-ry)*.035;pulse*=.965;
   ctx.clearRect(0,0,width,height);
   const scale=Math.min(width,height)*.118*(1+pulse*.12);
   const yaw=time+ry, pitch=.58+rx;
   const projected=points.map(p=>{
    const x=p.x*Math.cos(yaw)-p.z*Math.sin(yaw),z=p.x*Math.sin(yaw)+p.z*Math.cos(yaw);
    const y=p.y*Math.cos(pitch)-z*Math.sin(pitch),depth=p.y*Math.sin(pitch)+z*Math.cos(pitch);
    const perspective=7/(7-depth);
    return {x:width/2+x*scale*perspective,y:height*.46+y*scale*perspective,z:depth,perspective,t:p.t};
   });
   // Fine structural lines reveal the continuous knot behind the moving particles.
   for(let i=0;i<projected.length;i++){
    const a=projected[i],b=projected[(i+1)%projected.length];
    ctx.strokeStyle=`rgba(196,255,72,${.08+(a.z+3)/6*.28})`;ctx.lineWidth=.7;
    ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
   }
   projected.sort((a,b)=>a.z-b.z);
   for(const p of projected){
    const wave=(Math.sin(p.t*9-time*9)+1)/2;
    const alpha=.2+(p.z+3)/6*.65;
    ctx.fillStyle=`rgba(${wave>.9?'239,255,216':'196,255,72'},${alpha})`;
    ctx.beginPath();ctx.arc(p.x,p.y,(wave>.9?1.8:1)*p.perspective,0,Math.PI*2);ctx.fill();
   }
   // Sparse satellites follow independent paths through the same space.
   for(let i=0;i<7;i++){const angle=time*(.6+i*.09)+i*2.4;const x=width/2+Math.cos(angle)*scale*3.45,y=height*.46+Math.sin(angle)*scale*2.8;ctx.fillStyle='#91a978';ctx.fillRect(x-1,y-1,2,2);}
  }
  requestAnimationFrame(draw);
 }
 requestAnimationFrame(draw);
})();
