const list=document.getElementById('product-list');
products.forEach(p=>{
 const div=document.createElement('div');
 div.className='product-card';
 div.innerHTML=`<span class='badge'>${p.badge}</span><img src='${p.img}'><h3>${p.name}</h3><p>Rp ${p.price.toLocaleString()}</p><button onclick="wa('${p.name}')">Mau Ini</button>`;
 list.appendChild(div);
});

function wa(name){
 const msg=`Halo Admin Herbaprima,%0ASaya ingin memesan:%0A- ${name}`;
 window.open(`https://wa.me/6282241900467?text=${msg}`,'_blank');
}
