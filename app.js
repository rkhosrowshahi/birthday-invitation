const yes = document.querySelector('#yes');
const no = document.querySelector('#no');
const invitation = document.querySelector('#invitation');
const details = document.querySelector('#details');
const party = window.PARTY || {};
let attempts = 0;
const messages = ['Request denied. Try the red button.', 'That No is getting harder to defend.', 'Nice try. Your spot is still reserved.', 'The Yes button makes a compelling argument.', 'Still running from a good time?'];
function moveNo() {
  attempts++;
  no.style.fontSize = `${Math.max(9, 16 * Math.pow(.87, attempts))}px`;
  no.style.padding = `${Math.max(5,16-attempts*2)}px ${Math.max(8,26-attempts*3)}px`;
  yes.style.fontSize = `${Math.min(32,16+attempts*2)}px`;
  yes.style.padding = `${Math.min(30,20+attempts)}px ${Math.min(42,32+attempts)}px`;
  no.style.position = 'fixed';
  const rect = no.getBoundingClientRect();
  const yesRect = yes.getBoundingClientRect();
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  const candidates = [];
  for(let i=0;i<40;i++) {
    const x=12+Math.random()*Math.max(0,width-rect.width-24);
    const y=12+Math.random()*Math.max(0,height-rect.height-24);
    if(x+rect.width+16<yesRect.left || x>yesRect.right+16 || y+rect.height+16<yesRect.top || y>yesRect.bottom+16) candidates.push({x,y});
  }
  const next = candidates[0] || {x:12,y:12};
  no.style.left=`${next.x}px`;no.style.top=`${next.y}px`;
  document.querySelector('#tease').textContent = messages[(attempts-1)%messages.length];
}
no.addEventListener('click', moveNo);
window.addEventListener('resize', () => {if(attempts && !invitation.hidden){no.style.left='12px';no.style.top='12px';}});
document.querySelector('#when').textContent=party.dateAndTime || 'Date coming soon';
document.querySelector('#where').textContent=[party.venue,party.address].filter(Boolean).join('\n') || 'Location coming soon';
if(party.host) document.querySelector('#host-line').textContent=`Come celebrate ${party.host}’s birthday!`;
if(party.address) {
 const address=encodeURIComponent(party.address);
 document.querySelector('#google').href=`https://www.google.com/maps/dir/?api=1&destination=${address}`;
 document.querySelector('#apple').href=`https://maps.apple.com/?daddr=${address}`;
 document.querySelector('#waze').href=`https://waze.com/ul?q=${address}&navigate=yes`;
 document.querySelector('#maps').hidden=false;
}
document.querySelector('#coming-soon').hidden=Boolean(party.dateAndTime && party.address);
yes.addEventListener('click',()=>{
 invitation.hidden=true;details.hidden=false;
 document.querySelector('#celebrate').tabIndex=-1;document.querySelector('#celebrate').focus();
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const container=document.querySelector('#confetti');container.replaceChildren();
  for(let i=0;i<60;i++){const bit=document.createElement('i');bit.className='confetto';bit.style.left=`${Math.random()*100}%`;bit.style.background=['#ff2535','#ffffff','#bd1727','#ff626c'][i%4];bit.style.animationDelay=`${Math.random()*.8}s`;container.append(bit);}
  setTimeout(()=>container.replaceChildren(),4500);
 }
});
document.querySelector('#back').addEventListener('click',()=>{details.hidden=true;invitation.hidden=false;attempts=0;yes.removeAttribute('style');no.removeAttribute('style');document.querySelector('#tease').textContent='I dare you to say NO!';yes.focus();});
