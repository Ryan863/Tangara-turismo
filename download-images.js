const fs = require('fs');
const path = require('path');
const https = require('https');

const imgDir = path.join(__dirname, 'img');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

// Mapeamento temático com imagens confiáveis do Unsplash
const images = {
  // Caravaggio
  'capela-caravaggio.jpg': 'https://images.unsplash.com/photo-1548625361-195970ff8e6a?auto=format&fit=crop&w=640&q=80', // Capela histórica
  'donana.jpg': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=80', // Doces caseiros e pães artesanais
  'vinhos-parisi.jpg': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=640&q=80', // Vinho e taças
  'perazzoli.jpg': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=640&q=80', // Vinhedo parreiral
  'paradouro-andretta.jpg': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=640&q=80', // Mirante de montanha
  'nova-esperanca.jpg': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=640&q=80', // Uvas e suco natural
  'irmaos-alberti.jpg': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=640&q=80', // Pote de mel e produtos coloniais
  'sabtiem-bier.jpg': 'https://images.unsplash.com/photo-1608270114064-a69622d1df9d?auto=format&fit=crop&w=640&q=80', // Cerveja artesanal
  'giardino-comachio.jpg': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=640&q=80', // Jardim e fontes
  'capitel-santa-paulina.jpg': 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=640&q=80', // Capitel / devoção

  // Caminhos da Natureza
  'capitel-aparecida.jpg': 'https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&w=640&q=80', // Capitel rio e natureza
  'trilha-xaxins.jpg': 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=640&q=80', // Trilha na floresta e samambaias
  'sapeco-pinhao.jpg': 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=640&q=80', // Fogueira campestre

  // Cultura e Lazer
  'estacao-ferroviaria.jpg': 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=640&q=80', // Estação e trilhos de trem
  'praca-municipal.jpg': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=640&q=80', // Praça arborizada e lago
  'praca-monumentos.jpg': 'https://images.unsplash.com/photo-1569974498991-d3c12a504f95?auto=format&fit=crop&w=640&q=80', // Escultura e monumento urbano
  'igreja-matriz.jpg': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=640&q=80', // Igreja matriz histórica
  'parque-fritzen.jpg': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=640&q=80', // Parque aquático natural e camping
  'recanto-dos-lagos.jpg': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=640&q=80', // Pesque e pague lago calmo

  // Enoturismo
  'vinicola-panceri.jpg': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=640&q=80', // Vinhedos e adega
  'vinicola-monte-vecchio.jpg': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=640&q=80', // Degustação vinhos finos

  // Gastronomia
  'caffe-blume.jpg': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=640&q=80', // Café e doces
  'salao-scheid.jpg': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=640&q=80', // Pastel e comida de feira
  'capivara-food-beer.jpg': 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=640&q=80', // Hamburguer artesanal pub
  'dom-juan.jpg': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=640&q=80', // Pizza artesanal forno
  'dom-corleone.jpg': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=640&q=80', // Pizzaria napolitana
  'estacao-restaurante.jpg': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=640&q=80', // Restaurante acolhedor
  'duas-pontes.jpg': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=640&q=80', // Buffet colonial farto
  'bar-do-boni.jpg': 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=640&q=80', // Bar tradicional botequim
  'oneda-lanches.jpg': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=640&q=80', // Lanches e chope

  // Hospedagem
  'moinho-velho.jpg': 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=640&q=80', // Pousada chalé rancho
  'sitio-sao-pedro.jpg': 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=640&q=80', // Casarão colonial fazenda

  // Clubes
  'cvlt.jpg': 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=640&q=80', // Voo livre montanha
  'west-fly.jpg': 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=640&q=80', // Parapente duplo
  'bike-clube.jpg': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=640&q=80', // Mountain bike trilha
  'moto-clube-morro-agudo.jpg': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=640&q=80', // Motociclismo estrada
  'mct.jpg': 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=640&q=80', // Motos clássicas viagem
  'ctg-tropeiros.jpg': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=640&q=80', // Tradição gaúcha cavalos

  // Eventos
  'vindima.jpg': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=640&q=80', // Vindima colheita uva
  'festa-morango.jpg': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=640&q=80', // Morangos frescos
  'festa-aparecida.jpg': 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=640&q=80', // Celebração religiosa
  'festa-comunitaria.jpg': 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=640&q=80' // Festa comunitária típica
};

function download(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        return download(response.headers.location, dest).then(resolve);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      console.error(`Erro ao baixar ${dest}:`, err.message);
      resolve(false);
    });
  });
}

async function run() {
  console.log('Iniciando download de imagens fictícias demonstrativas...');
  for (const [filename, url] of Object.entries(images)) {
    const dest = path.join(imgDir, filename);
    process.stdout.write(`Baixando ${filename}... `);
    const ok = await download(url, dest);
    console.log(ok ? 'OK' : 'FALHA');
  }
  console.log('Finalizado!');
}

run();
