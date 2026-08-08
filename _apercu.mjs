// Fabrique la page qui sert d'aperçu WhatsApp, à photographier ensuite.
//
// POURQUOI PAR LE NAVIGATEUR ET PLUS PAR UN DESSIN. L'aperçu était dessiné avec
// System.Drawing, qui ne sait lire ni le WOFF2 ni un dégradé doux. Les prénoms y
// étaient donc écrits dans une police d'emprunt, sans rapport avec la carte, et
// la limite entre la photo et le texte tombait net comme un coup de ciseaux.
//
// La page ci-dessous emprunte à index.html sa VRAIE police et sa VRAIE photo :
// l'aperçu et la carte ne peuvent plus diverger, puisqu'il n'y a qu'une source.
//
//   node _apercu.mjs        écrit _apercu.html
import { readFileSync, writeFileSync } from 'node:fs';

const carte = readFileSync('index.html', 'utf8');

// La règle @font-face complète, avec sa police en base64.
const police = carte.match(/@font-face\{font-family:'Great Vibes'[^}]*\}/)?.[0];
if (!police) throw new Error("Police Great Vibes introuvable dans index.html");

// La photo incrustée dans la couverture.
const i = carte.indexOf('data:image/jpeg;base64,');
const photo = carte.slice(i, carte.indexOf('")', i));
if (i < 0) throw new Error('Photo introuvable dans index.html');

const page = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  ${police}
  *{margin:0;box-sizing:border-box}
  html,body{width:1200px;height:632px;overflow:hidden}
  .vignette{position:relative;width:1200px;height:632px;display:flex;
    background:#fbeff2;font-family:Georgia,'Times New Roman',serif;color:#6b5560}

  /* La photo occupe la gauche et n'est JAMAIS voilée : c'est le couple qu'on
     vient voir. Elle déborde volontairement sous le dégradé, qui vient
     l'éteindre en douceur. */
  .photo{position:absolute;inset:0 auto 0 0;width:56%;
    background:url("${photo}") 46% 30%/cover no-repeat}

  /* LE FONDU, sur près d'un cinquième de la largeur. L'ancienne version passait
     du net au voilé en quelques pixels, et la couture se voyait comme une barre.
     Ici la transition est assez large pour qu'aucune limite ne soit lisible. */
  .fondu{position:absolute;inset:0;
    background:linear-gradient(90deg,
      rgba(251,239,242,0) 0%,
      rgba(251,239,242,0) 46%,
      rgba(251,239,242,.35) 52%,
      rgba(251,239,242,.75) 58%,
      rgba(251,239,242,.96) 64%,
      rgba(251,239,242,1) 70%)}

  .texte{position:relative;margin-left:auto;width:42%;height:100%;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;padding:44px 58px}

  .coeur{color:#C24C66;font-size:30px;line-height:1;margin-bottom:6px}
  /* LA MÊME POLICE QUE L'INTÉRIEUR DE LA CARTE. C'est elle qui fait qu'on
     reconnaît le même document, et c'était le principal reproche. */
  .noms{font-family:'Great Vibes',cursive;color:#B06A82;font-size:76px;
    line-height:1.06;font-weight:400}
  .sous{font-size:21px;letter-spacing:.04em;margin-top:6px}
  .filet{width:150px;height:2px;margin:20px 0 18px;
    background:linear-gradient(90deg,transparent,#C9A24B,transparent)}
  .date{font-size:25px;font-weight:600;color:#5b4752;letter-spacing:.01em}
  .lieu{font-size:17px;color:#9b8892;margin-top:6px}
  .pastille{margin-top:24px;display:inline-block;font-size:14px;letter-spacing:.16em;
    text-transform:uppercase;color:#fff;padding:13px 26px;border-radius:999px;
    background:linear-gradient(135deg,#E39BAE,#C24C66);
    box-shadow:0 12px 26px -12px rgba(194,76,102,.75)}
</style></head><body>
  <div class="vignette">
    <div class="photo"></div>
    <div class="fondu"></div>
    <div class="texte">
      <div class="coeur">&#9829;</div>
      <div class="noms">Falencie &amp; Martin</div>
      <div class="sous">Nous nous marions</div>
      <div class="filet"></div>
      <div class="date">12 Septembre 2026 &middot; 10h30</div>
      <div class="lieu">Orix H&ocirc;tel &middot; Ouanaminthe, Ha&iuml;ti</div>
      <div class="pastille">Appuyez pour ouvrir &#9829;</div>
    </div>
  </div>
</body></html>`;

writeFileSync('_apercu.html', page);
console.log(`  _apercu.html écrit, ${(page.length / 1024).toFixed(0)} Ko`);
console.log('  Photographier ensuite en 1200x632, voir _apercu.md');
