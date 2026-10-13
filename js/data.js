/* Banco de dados oficial do portal – Tangará SC
   Coordenadas aproximadas (planejamento). Ajuste conforme georreferenciamento oficial. */
window.TANGARA = (function () {
  var C0 = [-27.0995, -51.2478]; // Centro de Tangará (aprox.)
  function w(n) { return 'https://wa.me/' + n; }

  var caravaggio = [
    { n: 'Capela Nossa Senhora de Caravaggio', d: 'Marco histórico-religioso do circuito, ponto de fé e tradição das comunidades italianas.', tag: 'Fé & história', img: 'img/capela-caravaggio.jpg', ll: [-27.0610, -51.2900] },
    { n: 'DonAna – Sucos e Doces Artesanais', d: 'Linha Bracatinga, a 7,5 km do centro. Doces coloniais de tacho e sucos artesanais.', tag: 'Doces coloniais', img: 'img/donana.jpg', ll: [-27.0420, -51.2650] },
    { n: 'Vinhos Parisi', d: 'Linha Bracatinga. Degustação colonial em família, com vinhos da própria uva.', tag: 'Vinho colonial', img: 'img/vinhos-parisi.jpg', ll: [-27.0460, -51.2610] },
    { n: 'Propriedade Perazzoli', d: 'Vindima com merendin italiano nos parreirais, em fevereiro.', tag: 'Vindima', img: 'img/perazzoli.jpg', ll: [-27.0540, -51.2760] },
    { n: 'Paradouro Andretta', d: 'Mirante de contemplação com vista aos vales e ao Morro Agudo.', tag: 'Mirante', img: 'img/paradouro-andretta.jpg', ll: [-27.0580, -51.2830] },
    { n: 'Sucos Nova Esperança', d: 'Sucos de uva integrais produzidos por agricultores familiares.', tag: 'Sucos', img: 'img/nova-esperanca.jpg', ll: [-27.0650, -51.2870] },
    { n: 'Sucos Irmãos Alberti / Danimel', d: 'Sucos e derivados artesanais direto da propriedade rural.', tag: 'Sucos', img: 'img/irmaos-alberti.jpg', ll: [-27.0700, -51.2820] },
    { n: 'Sabtiem Bier', d: 'Cervejaria artesanal local na Linha Caravaggio.', tag: 'Cerveja artesanal', img: 'img/sabtiem-bier.jpg', ll: [-27.0630, -51.2940] },
    { n: 'Giardino Comachio', d: 'Cenário greco-romano e eventos ao ar livre em meio à zona rural.', tag: 'Eventos', img: 'img/giardino-comachio.jpg', ll: [-27.0690, -51.2980] },
    { n: 'Capitel Santa Paulina | Irakitan', d: 'Capitel dedicado a Santa Paulina, devoção marcante da região.', tag: 'Capitel', img: 'img/capitel-santa-paulina.jpg', ll: [-27.0750, -51.3010] }
  ];

  var capiteis = [
    '01 · São José', '02 · N. Sra. da Saúde', '03 · N. Sra. da Salete', '04 · Santo Anjo',
    '05 · Sagrado Coração de Jesus', '06 · Espírito Santo', '07 · N. Sra. Desatadora dos Nós'
  ];

  var natureza = [
    { n: 'Capitel Nossa Senhora Aparecida', d: 'Às margens do Rio Bonito, um recanto de silêncio e devoção.', tag: 'Rio Bonito', img: 'img/capitel-aparecida.jpg', ll: [-27.1250, -51.2200] },
    { n: 'Trilha dos Xaxins', d: 'Caminhada entre samambaiaçus na propriedade de Lídia Casarotto.', tag: 'Trilha', img: 'img/trilha-xaxins.jpg', ll: [-27.1300, -51.2150] },
    { n: 'Sapeco do Pinhão', d: 'Experiência de abril e maio, com fogo, pinhão e prosa. Agende: (49) 99976-7767.', tag: 'Abril / maio', img: 'img/sapeco-pinhao.jpg', ll: [-27.1220, -51.2250], wa: w('5549999767767') }
  ];

  var cultura = [
    { n: 'Estação Ferroviária e Espaço Cultural Caio Pisani', d: 'Memória da chegada dos trilhos, em 1910, hoje espaço de cultura.', tag: 'História', img: 'img/estacao-ferroviaria.jpg', ll: [-27.0985, -51.2465] },
    { n: 'Praça Darcy Francisco Casagrande', d: 'Espelho d’água no formato do pássaro Tangará e a fonte O Sonho de Ícaro.', tag: 'Praça', img: 'img/praca-municipal.jpg', ll: [-27.0997, -51.2480] },
    { n: 'Praça dos Monumentos', d: 'Homenagem à celulose, ao papel e à uva, as raízes da economia local.', tag: 'Monumento', img: 'img/praca-monumentos.jpg', ll: [-27.1003, -51.2490] },
    { n: 'Igreja Matriz Santo Antônio', d: 'Vitrais sacros e altar esculpido em madeira, de 1947.', tag: 'Arte sacra', img: 'img/igreja-matriz.jpg', ll: [-27.0992, -51.2472] },
    { n: 'Parque Natural Fritzen', d: 'Piscinas de água natural, quiosques e camping, a 4 km do centro.', tag: 'Lazer', img: 'img/parque-fritzen.jpg', ll: [-27.1250, -51.2700] },
    { n: 'Pesque e Pague Recanto dos Lagos', d: 'Lazer em família e pesca recreativa.', tag: 'Pesca', img: 'img/recanto-dos-lagos.jpg', ll: [-27.1150, -51.2350] }
  ];

  var vinho = [
    { n: 'Vinícola Panceri', d: 'Linha Leãozinho. Visitas guiadas aos vinhedos, degustações e o Museu da Vitivinicultura de SC.', tag: 'Museu & vinhos', img: 'img/vinicola-panceri.jpg', ll: [-27.0800, -51.2200] },
    { n: 'Vinícola Monte Vecchio', d: 'A 2 km do centro. Vinhos finos familiares e degustação técnica.', tag: 'Vinhos finos', img: 'img/vinicola-monte-vecchio.jpg', ll: [-27.0900, -51.2400] }
  ];

  var comer = [
    { n: 'Caffé Blume', d: 'Cafeteria, confeitaria artesanal e flores.', tag: 'Café', img: 'img/caffe-blume.jpg', ll: [-27.0990, -51.2476], wa: null },
    { n: 'Salão Scheid', d: 'SC-453, Sede Dona Alice. Pastel, caldo de cana e produtos coloniais.', tag: 'Colonial', img: 'img/salao-scheid.jpg', ll: [-27.1450, -51.2850] },
    { n: 'Capivara Food Beer', d: 'Pub e gastronomia noturna.', tag: 'Pub', img: 'img/capivara-food-beer.jpg', ll: [-27.0999, -51.2468], wa: w('5549999737450') },
    { n: 'Dom Juan Pizzaria', d: 'Pizzas artesanais para a família.', tag: 'Pizzaria', img: 'img/dom-juan.jpg', ll: [-27.1005, -51.2485] },
    { n: 'Pizzaria Dom Corleone', d: 'Pizzas e noites com sabor italiano.', tag: 'Pizzaria', img: 'img/dom-corleone.jpg', ll: [-27.1010, -51.2470] },
    { n: 'Estação Restaurante e Pizzaria', d: 'Restaurante e pizzaria no coração da cidade.', tag: 'Restaurante', img: 'img/estacao-restaurante.jpg', ll: [-27.0983, -51.2462] },
    { n: 'Restaurante Duas Pontes', d: 'Buffet colonial caseiro.', tag: 'Buffet colonial', img: 'img/duas-pontes.jpg', ll: [-27.1100, -51.2550] },
    { n: 'Comercial Zamboni / Bar do Boni', d: 'Ponto tradicional desde 1992, Rua Francisco Nardi, 1089.', tag: 'Desde 1992', img: 'img/bar-do-boni.jpg', ll: [-27.1008, -51.2495] },
    { n: 'Oneda Lanches e Sabtiem Bier Tap', d: 'Lanches e chope artesanal da casa.', tag: 'Lanches & chope', img: 'img/oneda-lanches.jpg', ll: [-27.0996, -51.2483] }
  ];

  var ficar = [
    { n: 'Pousada Rancho Moinho Velho', d: 'Comida campeira, pesca esportiva, camping e área de pouso de parapente.', tag: 'Pousada', img: 'img/moinho-velho.jpg', ll: [-27.1180, -51.2600] },
    { n: 'Pousada Rural Sítio São Pedro', d: 'Casarão de 1962 com almoço da nonna.', tag: 'Pousada rural', img: 'img/sitio-sao-pedro.jpg', ll: [-27.0850, -51.2300] }
  ];

  var clube = [
    { n: 'Clube de Voo Livre Tangará (CVLT)', d: 'Gestor do Morro Agudo.', tag: 'Voo livre', img: 'img/cvlt.jpg', ll: [-27.0560, -51.2010] },
    { n: 'Clube Vale do Vinho de Parapente / West Fly', d: 'Voos duplos de instrução na Linha Santa Catarina.', tag: 'Parapente', img: 'img/west-fly.jpg', ll: [-27.0700, -51.2100] },
    { n: 'Bike Clube Tangará', d: 'Rotas de serra e cicloturismo. Fundado em 2016.', tag: 'Cicloturismo', img: 'img/bike-clube.jpg' },
    { n: 'Morro Agudo Moto Clube', d: 'Motociclismo e encontros no pé da serra.', tag: 'Moto clube', img: 'img/moto-clube-morro-agudo.jpg' },
    { n: 'Moto Clube Tangará (MCT)', d: 'Passeios e confraternizações motociclísticas.', tag: 'Moto clube', img: 'img/mct.jpg' },
    { n: 'CTG Tropeiros da Esperança', d: 'Linha Perotto. Cultura gaúcha, cavalgadas e laço.', tag: 'Tradição gaúcha', img: 'img/ctg-tropeiros.jpg', ll: [-27.0900, -51.2000] }
  ];

  var evento = [
    { n: 'Período da Vindima', d: 'Fevereiro. Colheita e pisa da uva nas propriedades.', tag: 'Fevereiro', img: 'img/vindima.jpg' },
    { n: 'Festa do Morango', d: 'Colônia Muller.', tag: 'Colônia Muller', img: 'img/festa-morango.jpg' },
    { n: 'Festa da Padroeira N. Sra. Aparecida', d: 'Comunidade Aparecida e Linha Colônia Muller.', tag: 'Padroeira', img: 'img/festa-aparecida.jpg' },
    { n: 'Festa de Gramados Santos', d: 'Festa comunitária do padroeiro.', tag: 'Comunitária', img: 'img/festa-comunitaria.jpg' },
    { n: 'Festa de São Francisco', d: 'Festa comunitária do padroeiro.', tag: 'Comunitária', img: 'img/festa-comunitaria.jpg' },
    { n: 'Festa de Izidros', d: 'Festa comunitária do padroeiro.', tag: 'Comunitária', img: 'img/festa-comunitaria.jpg' },
    { n: 'Festa de N. Sra. da Saúde (Linho)', d: 'Festa comunitária do padroeiro.', tag: 'Comunitária', img: 'img/festa-comunitaria.jpg' },
    { n: 'Festa de Santo Alberto Magno (Marari)', d: 'Festa comunitária do padroeiro.', tag: 'Comunitária', img: 'img/festa-comunitaria.jpg' },
    { n: 'Festa de Santa Catarina', d: 'Festa comunitária do padroeiro.', tag: 'Comunitária', img: 'img/festa-comunitaria.jpg' }
  ];

  function tag(arr, cat) { arr.forEach(function (x) { x.cat = cat; }); return arr; }

  return {
    center: C0,
    morroAgudo: { lat: -27.0560, lng: -51.2010, n: 'Morro Agudo · Rampa de voo livre (1.075 m)' },
    caravaggio: tag(caravaggio, 'caravaggio'),
    capiteis: capiteis,
    natureza: tag(natureza, 'natureza'),
    cultura: tag(cultura, 'cultura'),
    vinho: tag(vinho, 'vinho'),
    comer: tag(comer, 'comer'),
    ficar: tag(ficar, 'ficar'),
    clube: tag(clube, 'clube'),
    evento: tag(evento, 'evento')
  };
})();
