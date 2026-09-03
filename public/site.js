
/* ----- route courante (vraies URL) ----- */
var ROUTES=["accueil","methode","services","projets","agence","mentions"];
var seg=(location.pathname.split("/")[1]||"").toLowerCase();
var routeCourante = seg==="" ? "accueil" : seg;
if(ROUTES.indexOf(routeCourante)===-1) routeCourante="accueil";
/* anciennes ancres redirigées vers les vraies URL */
(function(){
  var h=location.hash?location.hash.slice(1):"";
  if(location.pathname==="/"&&h){
    if(h.indexOf("projet/")===0){location.replace("/projets/"+h.slice(7));return;}
    if(ROUTES.indexOf(h)>-1&&h!=="accueil"){location.replace("/"+h);return;}
  }
})();
function route(){
  document.querySelectorAll("[data-route]").forEach(function(a){
    if(a.classList.contains("nav__item")){
      if(a.dataset.route===routeCourante) a.setAttribute("aria-current","page");
      else a.removeAttribute("aria-current");
    }
  });
  etatNav();
  if(routeCourante==="methode" && window.methodeRecalc) window.methodeRecalc();
}

/* ----- navigation rétractable ----- */
var nav=document.getElementById("nav"),bascule=document.getElementById("bascule");
var mobile=window.matchMedia("(max-width: 760px)");
var ouvert=false;
function etatNav(){
  if(ouvert){nav.dataset.etat="ouvert";return;}
  if(mobile.matches||routeCourante!=="accueil"){nav.dataset.etat="compact";return;}
  nav.dataset.etat=window.scrollY>24?"compact":"large";
}
function basculer(){
  ouvert=!ouvert;
  bascule.setAttribute("aria-expanded",ouvert?"true":"false");
  bascule.setAttribute("aria-label",ouvert?"Fermer le menu":"Ouvrir le menu");
  etatNav();
}
bascule.addEventListener("click",basculer);
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&ouvert)basculer();});
document.addEventListener("click",function(e){if(ouvert&&!nav.contains(e.target))basculer();});
window.addEventListener("scroll",etatNav,{passive:true});
mobile.addEventListener("change",etatNav);
document.getElementById("panneau").addEventListener("click",function(e){
  if(e.target.closest("a")&&ouvert)basculer();
});

/* ----- séquence épinglée (méthode) ----- */
(function(){
  var sequence=document.getElementById("sequence");
  if(!sequence)return;
  var etapes=Array.prototype.slice.call(sequence.querySelectorAll(".etape"));
  var total=etapes.length,bureau=window.matchMedia("(min-width: 861px)"),courant=-1;
  function hauteur(){sequence.style.height=(total*140)+"vh";}
  function suivre(){
    if(routeCourante!=="methode")return;
    var haut=sequence.getBoundingClientRect().top+window.scrollY;
    var course=sequence.offsetHeight-window.innerHeight;
    var p=(window.scrollY-haut)/(course||1);
    p=Math.min(Math.max(p,0),0.9999);
    var i=Math.floor(p*total);
    if(i===courant)return;
    courant=i;
    etapes.forEach(function(el,n){
      if(n===i)el.setAttribute("data-actif","");else el.removeAttribute("data-actif");
    });
  }
  window.addEventListener("scroll",suivre,{passive:true});
  window.addEventListener("resize",function(){hauteur();courant=-1;suivre();});
  bureau.addEventListener("change",function(){hauteur();courant=-1;suivre();});
  window.methodeRecalc=function(){hauteur();courant=-1;suivre();};
  hauteur();
})();

document.querySelectorAll(".onglet").forEach(function(b){
  b.addEventListener("click",function(){document.body.dataset.modeServices=b.dataset.mode;});
});

route();

/* ----- manifeste accueil : les mots s'éclairent au fil du défilement ----- */
(function(){
  var el=document.getElementById("acc-manifeste");
  if(!el) return;
  var mots=el.textContent.trim().split(/\s+/);
  el.innerHTML=mots.map(function(m){return '<span class="mot">'+m+'</span>';}).join(' ');
  var spans=el.querySelectorAll(".mot");
  function maj(){
    var r=el.getBoundingClientRect(), vh=window.innerHeight;
    var p=(vh*0.88-r.top)/(vh*0.55);
    p=Math.max(0,Math.min(1,p));
    var n=Math.round(p*spans.length);
    for(var i=0;i<spans.length;i++){
      if(i<n) spans[i].setAttribute("data-lu","");
      else spans[i].removeAttribute("data-lu");
    }
  }
  window.addEventListener("scroll",maj,{passive:true});
  window.addEventListener("hashchange",function(){setTimeout(maj,80);});
  maj();
})();

/* ----- boutons services / abonnements : fixent le mode avant d'ouvrir la page ----- */
(function(){
  document.querySelectorAll("[data-mode-cible]").forEach(function(a){
    a.addEventListener("click",function(){
      document.body.dataset.modeServices = a.dataset.modeCible==="abo" ? "abo" : "projet";
    });
  });
})();

/* ----- tuiles accueil : réutilisent les images de la grille projets ----- */
(function(){
  document.querySelectorAll("img[data-src-de]").forEach(function(im){
    var o=document.querySelector('.tuile[data-i="'+im.dataset.srcDe+'"] .vis__img');
    if(o) im.src=o.src;
  });
})();

/* ----- FAQ accordéon ----- */
(function(){
  var items=document.querySelectorAll(".acc-faq__item");
  items.forEach(function(it){
    var q=it.querySelector(".acc-faq__q");
    if(!q) return;
    q.addEventListener("click",function(){
      var ouvert=it.hasAttribute("data-ouvert");
      items.forEach(function(a){a.removeAttribute("data-ouvert");a.querySelector(".acc-faq__q").setAttribute("aria-expanded","false");});
      if(!ouvert){it.setAttribute("data-ouvert","");q.setAttribute("aria-expanded","true");}
    });
  });
})();

/* ----- appel à l'action flottant (mobile) ----- */
(function(){
  var cta=document.getElementById("cta-flottant");
  if(!cta) return;
  function maj(){
    if(window.scrollY>350) cta.setAttribute("data-visible","");
    else cta.removeAttribute("data-visible");
  }
  window.addEventListener("scroll",maj,{passive:true});
  window.addEventListener("hashchange",function(){setTimeout(maj,60);});
  maj();
})();

/* ----- révélations au scroll ----- */
(function(){
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  if(!("IntersectionObserver" in window)) return;
  var sels=[
    ".hero__titre",".hero__sous",".hero .bouton",".suite__bloc",
    ".accroche__titre",".accroche__note",".rang",".duree__bloc",".carte",".appel__titre",".appel .bouton",".final",
    ".s-accroche__texte",".s-accroche__bloc>.bouton",".groupe",".s-sans__bloc",".s-appel__bloc",
    ".fixe__lab",".fixe__texte",".tuile",".mosaique .vis",".mosaique-mob .vis",".bandeau",
    ".a-accroche__texte",".a-accroche__droite .vis",".a-ligne",".a-valeurs__tete",".a-carte",
    ".acc-titre",".acc-corps",".acc-lien",".acc-pole",".acc-projets__vis",".acc-gains",".acc-faq__item"
  ];
  var els=Array.prototype.slice.call(document.querySelectorAll(sels.join(",")));
  els.forEach(function(e){e.classList.add("rev");});
  var io=new IntersectionObserver(function(entrees){
    var lot=entrees.filter(function(x){return x.isIntersecting;});
    lot.forEach(function(x,i){
      var e=x.target;
      e.style.setProperty("--d",Math.min(i,4)*90+"ms");
      e.classList.add("vu");
      io.unobserve(e);
      setTimeout(function(){
        e.classList.remove("rev","vu");
        e.style.removeProperty("--d");
      },1500);
    });
  },{threshold:0.05});
  els.forEach(function(e){io.observe(e);});
  /* filet de sécurité : tout élément dans l'écran est révélé, même si l'observateur rate */
  function balayer(){
    var vh=window.innerHeight;
    document.querySelectorAll(".rev:not(.vu)").forEach(function(e){
      var r=e.getBoundingClientRect();
      if(r.top<vh*0.95&&r.bottom>0){
        e.classList.add("vu");
        io.unobserve(e);
        setTimeout(function(){e.classList.remove("rev","vu");e.style.removeProperty("--d");},1500);
      }
    });
  }
  var attente=null;
  window.addEventListener("scroll",function(){
    if(attente) return;
    attente=setTimeout(function(){attente=null;balayer();},180);
  },{passive:true});
  window.addEventListener("hashchange",function(){setTimeout(balayer,400);});
  setTimeout(balayer,900);
})();

/* ----- pourquoi odune : lever de jour piloté par le défilement ----- */
(function(){
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  var sec=document.querySelector(".a-pourquoi");
  if(!sec) return;
  var colle=document.createElement("div"); colle.className="a-pourquoi__colle";
  while(sec.firstChild) colle.appendChild(sec.firstChild);
  sec.appendChild(colle);
  var halo=document.createElement("div"); halo.className="a-pourquoi__halo";
  colle.insertBefore(halo,colle.firstChild);
  var blanc=document.createElement("div"); blanc.className="a-pourquoi__blanc";
  colle.insertBefore(blanc,colle.children[1]);
  function cl2(x){return Math.min(Math.max(x,0),1);}
  function lisse2(x){return x*x*(3-2*x);}
  function jour(){
    var vh=window.innerHeight;
    var r=sec.getBoundingClientRect();
    if(r.bottom<-vh||r.top>vh*2) return;
    var q=lisse2(cl2((vh*0.1-r.top)/((r.height-vh)*0.6)));
    halo.style.opacity=1;
    halo.style.transform="translateY("+(4-66*q).toFixed(2)+"%)";
    blanc.style.opacity=lisse2(cl2((q-0.78)/0.22));
    /* la typo s'inverse au passage de l'arc */
    var t=lisse2(cl2((q-0.40)/0.14));
    var rr=Math.round(249+(38-249)*t), gg=Math.round(249+(27-249)*t), bb=Math.round(249+(26-249)*t);
    colle.style.color="rgb("+rr+","+gg+","+bb+")";
  }
  window.addEventListener("scroll",jour,{passive:true});
  window.addEventListener("resize",jour);
  window.addEventListener("hashchange",function(){setTimeout(jour,50);});
  jour();
})();

/* ----- affirmation méthode : texte épinglé, mots surlignés + points ----- */
(function(){
  if(window.matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  if(!("IntersectionObserver" in window)) return;
  var aff=document.querySelector(".affirmation");
  if(!aff) return;
  var colle=document.createElement("div"); colle.className="affirmation__colle";
  while(aff.firstChild) colle.appendChild(aff.firstChild);
  aff.appendChild(colle);
  function decoupe(el){
    Array.prototype.slice.call(el.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var frag=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(part){
          if(part==="") return;
          if(/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(part)); return; }
          var s=document.createElement("span"); s.className="mot"; s.textContent=part;
          frag.appendChild(s);
        });
        el.replaceChild(frag,n);
      } else if(n.nodeType===1) decoupe(n);
    });
  }
  colle.querySelectorAll("p").forEach(decoupe);
  var mots=colle.querySelectorAll(".mot");
  var pointsListe=[];
  function cl(x){return Math.min(Math.max(x,0),1);}
  function lisse(x){return x*x*(3-2*x);}
  function scrub(){
    var vh=window.innerHeight;
    var r=aff.getBoundingClientRect();
    if(r.bottom<-vh||r.top>vh*2) return;
    var p=(vh*0.4-r.top)/(r.height-vh*0.8);
    p=Math.min(Math.max(p,0),1);
    var n=Math.round(p*mots.length);
    for(var i=0;i<mots.length;i++){
      if(i<n) mots[i].setAttribute("data-lu","");
      else mots[i].removeAttribute("data-lu");
    }
    /* points : arrivée et départ pilotés par le défilement */
    var t=(vh*0.8-r.top)/(vh*0.8 + r.height - vh);
    pointsListe.forEach(function(pt){
      var e=lisse(cl((t-pt.d)/0.3));
      var s=lisse(cl((t-0.72-pt.d*0.7)/0.18));
      var f=e*(1-s);
      pt.el.style.opacity=f;
      pt.el.style.transform="translate("+(pt.dx*(1-f)).toFixed(1)+"px,"+(pt.dy*(1-f)).toFixed(1)+"px)";
    });
  }
  window.addEventListener("scroll",scrub,{passive:true});
  window.addEventListener("resize",scrub);
  window.addEventListener("hashchange",function(){setTimeout(scrub,50);});
  /* disposition icomat : x%, y%, glissement (dx,dy) en px, retard en s */
  var POS=[
    [9.6,14.5,-70,0,.21],[9.6,50,-70,0,.09],[9.6,85.5,-70,0,.27],
    [16.3,14.5,-70,0,.12],[16.3,50,-70,0,0],[16.3,85.5,-70,0,.18],
    [50,14.5,0,-26,.15],[50,85.5,0,26,.24],
    [83.7,14.5,70,0,.09],[83.7,50,70,0,.03],[83.7,85.5,70,0,.21],
    [90.4,14.5,70,0,.24],[90.4,50,70,0,.15],[90.4,85.5,70,0,.30]
  ];
  var c=document.createElement("div"); c.className="points"; c.setAttribute("aria-hidden","true");
  POS.forEach(function(pt){
    var d=document.createElement("i"); d.className="point";
    d.style.left=pt[0]+"%"; d.style.top=pt[1]+"%";
    c.appendChild(d);
    pointsListe.push({el:d,dx:pt[2],dy:pt[3],d:pt[4]});
  });
  colle.appendChild(c);
  scrub();
})();

(function(){
  var P = [{"slug": "clemenceau", "nom": "Clemenceau", "cat": "Restauration", "texte": "Au Petit Gourmet devient Le Clemenceau, première brasserie française halal premium de Nanterre. Un repositionnement construit sur une frustration réelle de la clientèle, vouloir une vraie table française où emmener tout le monde.", "service": "Stratégie, naming, identité", "services": ["Stratégie", "Image de marque"], "enjeux": "Le restaurant s'appelait Au Petit Gourmet, un nom qui tirait le positionnement vers le bas et interdisait toute ambition. L'étude du marché a objectivé l'intuition des fondateurs, un vide bistronomique à Nanterre, 500 000 actifs à quinze minutes, et une frustration silencieuse chez leur cible, vouloir un bon bistrot français où emmener tout le monde. Nous avons posé le positionnement de première brasserie française halal premium de la ville, où l'identité française crée le désir et le halal assumé installe la confiance. Le renaming en Le Clemenceau ancre la maison dans sa ville, la charte et la direction artistique jouent le registre de la grande brasserie parisienne. Avant même d'ouvrir, la maison a une raison d'exister formulée et une image au niveau de son ambition.", "mosaique": [[{"src": "/img/clem-1.webp", "ar": "2048/1018", "fx": 2048}], [{"src": "/img/clem-2.webp", "ar": "1167/1366", "fx": 1167}, {"src": "/img/clem-3.webp", "ar": "1759/1366", "fx": 1759}], [{"src": "/img/clem-4.webp", "ar": "1858/1686", "fx": 1858}, {"src": "/img/clem-5.webp", "ar": "1068/1686", "fx": 1068}]]}, {"slug": "oupi", "nom": "Oupi", "cat": "Intelligence artificielle", "texte": "Une plateforme française d'IA souveraine lancée face aux géants américains. Une identité créée de A à Z pour inspirer la solidité d'un acteur établi, avant même le lancement.", "service": "Identité de marque", "services": ["Image de marque"], "enjeux": "Oupi unifie plus de quarante modèles d'IA dans un environnement souverain, serveurs en Europe et conformité RGPD stricte. Le problème était psychologique, une jeune plateforme doit inspirer la fiabilité d'un acteur installé alors qu'elle n'a ni historique ni notoriété, face à des géants qui ont les deux. Nous avons créé l'identité de A à Z pour faire ce que l'ancienneté aurait fait, rassurer au premier regard et donner l'image d'une maison sérieuse. La marque se présente aujourd'hui d'égal à égal dans l'écosystème B2B français et vise la place de référence européenne de l'IA unifiée, sans que sa jeunesse ne se voie.", "mosaique": [[{"src": "/img/oupi-1.webp", "ar": "2048/732", "fx": 2048}], [{"src": "/img/oupi-2.webp", "ar": "1756/839", "fx": 1756}, {"src": "/img/oupi-3.webp", "ar": "1167/839", "fx": 1167}], [{"src": "/img/oupi-4.webp", "ar": "1857/1052", "fx": 1857}, {"src": "/img/oupi-5.webp", "ar": "1052/1052", "fx": 1052}], [{"src": "/img/oupi-6.webp", "ar": "1503/839", "fx": 1503}, {"src": "/img/oupi-7.webp", "ar": "1396/839", "fx": 1396}]]}, {"slug": "atelier-2m", "nom": "Atelier 2m", "cat": "Menuiserie", "texte": "Un menuisier des Yvelines au savoir-faire réel, sans marque pour le signaler. Un positionnement d'artisanat haut de gamme, une identité qui le traduit, un déploiement jusque sur les camions et les chantiers.", "service": "Identité et déploiement", "services": ["Stratégie", "Image de marque", "Communication"], "enjeux": "Luis avait le savoir-faire, mais rien ne le signalait, et dans un secteur où tout se ressemble il se battait sur le prix. L'audit du marché a posé les leviers de crédibilité de l'artisanat haut de gamme, puis l'identité les a traduits, palette construite sur la chaleur maîtrisée et la solidité, typographies qui évoquent la structure et la précision. Nous l'avons déployée partout où ses clients le croisent, camions, panneaux de chantier, tenues des équipes, devis et factures, chaque chantier devenant une publicité permanente. La charte a été pensée duplicable, pour de futurs magasins ou une franchise.", "mosaique": [[{"src": "/img/at2m-1.webp", "ar": "2048/732", "fx": 2048}], [{"src": "/img/at2m-2.webp", "ar": "1756/839", "fx": 1756}, {"src": "/img/at2m-3.webp", "ar": "1167/839", "fx": 1167}], [{"src": "/img/at2m-4.webp", "ar": "1857/1052", "fx": 1857}, {"src": "/img/at2m-5.webp", "ar": "1052/1052", "fx": 1052}], [{"src": "/img/at2m-6.webp", "ar": "1167/839", "fx": 1167}, {"src": "/img/at2m-7.webp", "ar": "1756/839", "fx": 1756}]]}, {"slug": "polyphonie", "nom": "Polyphonie", "cat": "Édition", "texte": "Quatres livres sur l’amour. Un pays, une relation et une couleur par volume. Des entretiens publiés en récits et en podcast, nos photographies argentiques. C'est là qu'on apprend à raconter.", "service": "Direction Artistique", "services": ["Stratégie", "Image de marque", "Communication", "Abonnement"], "enjeux": "Polyphonie est notre projet d'édition, le terrain où nous nous entraînons. Quatre livres sur l'amour, un pays, une relation et une couleur par volume, des entretiens publiés en récits et en podcast, nos photographies argentiques. Tout ce que nous prescrivons à nos clients, le storytelling, la direction artistique, la cohérence de l'objet jusqu'au papier, se travaille d'abord ici, sur notre propre marque.", "mosaique": [[{"src": "/img/poly-1.webp", "ar": "2048/1018", "fx": 2048}], [{"src": "/img/poly-2.webp", "ar": "1167/1366", "fx": 1167}, {"src": "/img/poly-3.webp", "ar": "1756/1366", "fx": 1756}], [{"src": "/img/poly-4.webp", "ar": "1858/1686", "fx": 1858}, {"src": "/img/poly-5.webp", "ar": "1052/1686", "fx": 1052}]]}, {"slug": "campero", "nom": "Campero", "cat": "Restauration", "texte": "Une sandwicherie familiale de Biarritz repositionnée en snack concept. Un positionnement marketing et une direction artistique pensés pour être photographiés et partagés.", "service": "Stratégie et direction artistique", "services": ["Stratégie", "Image de marque"], "enjeux": "Marius reprenait un petit snack de centre-ville avec un local, un produit et une échéance, dans une ville saturée d'offres. La stratégie marketing a d'abord posé le positionnement qui manquait entre le premium surf-chic et le snack touristique, un snack concept, matchas et smoothies en canettes préparées sur place, focaccias, paninis signatures au pain nordique. La direction artistique a ensuite traduit ce positionnement, chaque élément conçu pour être photographié et partagé, la canette en premier, jusqu'à la devanture intégrée au travail des architectes dans le cadre réglementaire strict de Biarritz. Ce couple stratégie et image a contribué à enclencher la preuve sociale, chaque client qui photographie sa canette rend le lieu visible. Dès le premier été, Campero comptait parmi les snacks dont Biarritz parlait, sans budget publicitaire.", "mosaique": [[{"src": "/img/camp-1.webp", "ar": "2048/732", "fx": 2048}], [{"src": "/img/camp-2.webp", "ar": "1756/839", "fx": 1756}, {"src": "/img/camp-3.webp", "ar": "1167/839", "fx": 1167}], [{"src": "/img/camp-4.webp", "ar": "1857/1052", "fx": 1857}, {"src": "/img/camp-5.webp", "ar": "1052/1052", "fx": 1052}], [{"src": "/img/camp-6.webp", "ar": "1503/839", "fx": 1503}, {"src": "/img/camp-7.webp", "ar": "1396/839", "fx": 1396}]]}, {"slug": "tolem", "nom": "Tolem", "cat": "Horlogerie", "texte": "Une première montre, la TLM-01, portée par une marque construite de zéro. Positionnement, storytelling, image de marque, puis une communication qu'il pilote lui-même pendant que nous gérons la publicité.", "service": "Accompagnement complet", "services": ["Stratégie", "Image de marque", "Communication", "Publicité"], "enjeux": "Maxime lance sa première montre, la TLM-01, dans un secteur où l'objet ne se vend jamais seul. Nous l'accompagnons sur toute la chaîne. La stratégie a posé le positionnement, le storytelling et le marketing de fond, ce que la marque raconte et pourquoi elle existe avant même de parler du produit. L'image de marque a ensuite traité le vrai frein perceptif, l'univers industriel de l'horlogerie mécanique se lit comme technique et froid, rarement comme désirable. Nous l'avons rendu haut de gamme et glamour, pour que le positionnement et le prix se justifient au premier regard. La communication se construit avec lui, avec des formats qu'il maîtrise et publie lui-même, pendant que nous gérons la publicité, les accroches, les montages et les visuels pensés pour convertir.", "mosaique": [[{"src": "/img/tolem-1.webp", "ar": "2048/887", "fx": 2048}], [{"src": "/img/tolem-2.webp", "ar": "1756/839", "fx": 1756}, {"src": "/img/tolem-3.webp", "ar": "1167/839", "fx": 1167}], [{"src": "/img/tolem-4.webp", "ar": "841/1052", "fx": 841}, {"src": "/img/tolem-5.webp", "ar": "2048/1039", "fx": 2048}], [{"src": "/img/tolem-6.webp", "ar": "1204/1379", "fx": 1204}, {"src": "/img/tolem-7.webp", "ar": "1709/1379", "fx": 1709}]]}];
  var fixe=document.getElementById("fixe-projets");
  var nom=document.getElementById("pj-nom"),cat=document.getElementById("pj-cat"),
      texte=document.getElementById("pj-texte"),serv=document.getElementById("pj-service");
  var courant=0, minuterie=null;

  function montrer(i){
    if(i===courant) return;
    courant=i;
    fixe.setAttribute("data-transition","");
    clearTimeout(minuterie);
    minuterie=setTimeout(function(){
      var p=P[i];
      nom.textContent=p.nom; cat.textContent=p.cat; texte.textContent=p.texte; serv.textContent=p.service;
      fixe.removeAttribute("data-transition");
    },220);
  }
  document.querySelectorAll(".tuile").forEach(function(t){
    t.addEventListener("mouseenter",function(){ montrer(+t.dataset.i); });
    t.addEventListener("focus",function(){ montrer(+t.dataset.i); });
  });

  /* pages */
  var pProjets=document.getElementById("p-projets"), pProjet=document.getElementById("p-projet");
  if(!pProjets||!pProjet) return;
  var ppNom=document.getElementById("pp-nom"), ppServ=document.getElementById("pp-services"), ppEnj=document.getElementById("pp-enjeux"),
      ppBan=document.getElementById("pp-bandeau");
  function ouvrir(slug){
    var p=P.filter(function(x){return x.slug===slug;})[0];
    if(!p){ fermer(); return; }
    ppNom.textContent=p.nom.toUpperCase();
    ppServ.innerHTML=p.services.map(function(s){return "<p>"+s+"</p>";}).join("");
    ppEnj.textContent=p.enjeux;
    if(ppBan) ppBan.textContent=p.enjeux;
    var pMosa=document.getElementById("mosaique-proj");
    if(pMosa){
      if(p.mosaique){
        var tous=[];
        p.mosaique.forEach(function(rang){rang.forEach(function(v){tous.push(v);});});
        var htmlD="", iD=0, mD=0, motifD=[1,2,1,2];
        while(iD<tous.length){
          var nD=motifD[mD%motifD.length]; mD++;
          if(nD===1 || tous.length-iD===1){
            htmlD+='<div class="vis" style="aspect-ratio:'+tous[iD].ar+'"><img class="vis__img" src="'+tous[iD].src+'" alt=""></div>';
            iD+=1;
          } else {
            var a=tous[iD], c=tous[iD+1];
            var ra=a.ar.split("/"), rc=c.ar.split("/");
            var fa=(parseFloat(ra[0])/parseFloat(ra[1])).toFixed(4);
            var fc=(parseFloat(rc[0])/parseFloat(rc[1])).toFixed(4);
            htmlD+='<div class="mosaique__rang">'
              +'<div class="vis" style="flex:'+fa+' 1 0;aspect-ratio:'+a.ar+'"><img class="vis__img" src="'+a.src+'" alt=""></div>'
              +'<div class="vis" style="flex:'+fc+' 1 0;aspect-ratio:'+c.ar+'"><img class="vis__img" src="'+c.src+'" alt=""></div>'
              +'</div>';
            iD+=2;
          }
        }
        pMosa.innerHTML=htmlD;
        var pMosaM=document.getElementById("mosaique-proj-mob");
        if(pMosaM){ pMosaM.innerHTML=htmlD.split('mosaique__rang').join('rangm'); }
        pProjet.setAttribute("data-mosa","");
      } else {
        pProjet.removeAttribute("data-mosa");
        pMosa.innerHTML="";
        var pMosaM2=document.getElementById("mosaique-proj-mob");
        if(pMosaM2) pMosaM2.innerHTML="";
      }
    }
    pProjets.removeAttribute("data-actif"); pProjet.setAttribute("data-actif","");
    window.scrollTo(0,0);
  }
  function fermer(){
    pProjet.removeAttribute("data-actif"); pProjets.setAttribute("data-actif","");
    window.scrollTo(0,0);
  }
  function router(){
    var conteneur=document.getElementById("r-projets");
    var slug=conteneur?(conteneur.dataset.projet||""):"";
    if(slug) ouvrir(slug); else fermer();
  }
  document.querySelectorAll("[data-va='projets']").forEach(function(b){
    b.addEventListener("click",function(e){e.preventDefault();location.href="/projets";});
  });
  router();

  /* visionneuse plein écran — mobile uniquement */
  var vn=document.getElementById("visionneuse");
  if(vn&&pProjet){
    var vnImg=vn.querySelector("img"), vnMob=window.matchMedia("(max-width:960px)");
    pProjet.addEventListener("click",function(e){
      var img=e.target.closest(".vis__img");
      if(!img||!vnMob.matches) return;
      vnImg.src=img.src;
      vn.setAttribute("data-ouverte","");
      requestAnimationFrame(function(){requestAnimationFrame(function(){vn.setAttribute("data-visible","");});});
      document.body.style.overflow="hidden";
    });
    function vnFermer(){
      vn.removeAttribute("data-visible");
      setTimeout(function(){vn.removeAttribute("data-ouverte");vnImg.src="";},280);
      document.body.style.overflow="";
    }
    vn.addEventListener("click",vnFermer);
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&vn.hasAttribute("data-ouverte"))vnFermer();});
  }
})();
/* ----- mode services depuis l'URL ----- */
(function(){
  try{
    var q=new URLSearchParams(location.search).get("mode");
    if(q==="abo"||q==="projet") document.body.dataset.modeServices=q;
  }catch(e){}
})();
