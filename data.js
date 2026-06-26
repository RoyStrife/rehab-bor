// ═══════════════════════════════════════════════════════════════════
// data.js — Rehab Bor v11 — CAPA DE DATOS PURA
// Edita SOLO este archivo para cambiar ejercicios, sesiones o rutinas
// ═══════════════════════════════════════════════════════════════════

// ─── FECHA DE INICIO DEL PROGRAMA ───────────────────────────────────
const START_DATE = new Date(2026, 2, 21); // 21 de marzo 2026

// ─── DÍAS NEURALES (day-of-week: 0=Dom, 3=Mie, 6=Sab) ──────────────
const NEURAL_DAYS = new Set([3]); // Mie neural; Sab pasa a dia de Pierna+Gluteo

// ─── CRITERIOS PARA FASE 3 ──────────────────────────────────────────
const CRITERIA_F3 = [
  'Dolor en reposo <= 2/10 durante 14 dias consecutivos',
  'Sin irradiacion S1 activa durante 7 dias',
  'Hiperextension banco 45 con 40kg (50% PC) sin dolor — 4x6',
  'RDL mancuernas rango completo tecnica impecable sin irradiacion',
  'Plank anterior >= 45 seg sin compensacion lumbar',
  'Hip thrust bilateral con carga moderada sin dolor',
  'Goblet squat rango completo sin irradiacion',
  'Neural flossing sin reproduccion de sintomas',
  'Tolerancia sedestacion >= 45 min',
];

// ─── EJERCICIOS CON REGISTRO DE PESO ────────────────────────────────
const WEIGHTED_EX = [
  { id: 'hiperext',          name: 'Hiperextension 45',         day: 1, note: 'Carga adicional (kg)' },
  { id: 'rdl-mancuernas',    name: 'RDL mancuernas',            day: 1, note: 'Par (c/u)',     w65init: 10 },
  { id: 'curl-barra',        name: 'Curl biceps barra Z',       day: 1, note: 'Peso total' },
  { id: 'curl-martillo',     name: 'Curl martillo',             day: 1, note: 'Par (c/u)',     w65init: 8 },
  { id: 'jalon-ancho',       name: 'Jalon agarre ancho',        day: 4, note: 'Pila maquina',  w65init: 18 },
  { id: 'jalon-neutro',      name: 'Jalon agarre neutro',       day: 2, note: 'Pila maquina',  w65init: 18 },
  { id: 'pull-over',         name: 'Pull-over polea',           day: 2, note: 'Pila maquina',  w65init: 16 },
  { id: 'triceps-polea',     name: 'Triceps polea alta',        day: 4, note: 'Pila maquina',  w65init: 10 },
  { id: 'hip-thrust',        name: 'Hip thrust banco',          day: 2, note: 'Peso total' },
  { id: 'press-smith',       name: 'Press Smith 30',            day: 4, note: 'Peso total',    w65init: 12.5 },
  { id: 'press-smith-plano', name: 'Press Smith plano',         day: 4, note: 'Peso total',    w65init: 10 },
  { id: 'aperturas-cable',   name: 'Aperturas cable',           day: 4, note: 'Pila c/lado',   w65init: 36 },
  { id: 'pec-deck',          name: 'Aperturas pec deck',        day: 4, note: 'Pila maquina',  w65init: 20 },
  { id: 'face-pull',         name: 'Face pull polea',           day: 4, note: 'Pila maquina',  w65init: 12.5 },
  { id: 'remo-maquina',      name: 'Remo maquina sentado',      day: 4, note: 'Pila maquina',  w65init: 40 },
  { id: 'prensa',            name: 'Prensa 45',                 day: 6, note: 'Total platos',  w65init: 16 },
  { id: 'goblet-squat',      name: 'Goblet squat KB',           day: 2, note: 'Peso kettlebell', w65init: 10 },
  { id: 'hack-squat',        name: 'Hack squat maquina',        day: 5, note: 'Total platos',  w65init: 16 },
  { id: 'press-hombro-maq',  name: 'Press hombro maquina',      day: 5, note: 'Pila maquina' },
  { id: 'elevaciones-lat',   name: 'Elevaciones laterales',     day: 4, note: 'Par (c/u)' },
  { id: 'pajaros',           name: 'Pajaros rear delt',         day: 5, note: 'Par (c/u)' },
  { id: 'abduccion-maq',     name: 'Abduccion cadera maq',      day: 6, note: 'Pila maquina' },
  { id: 'leg-extension',    name: 'Leg extension (cuadriceps)', day: 6, note: 'Pila maquina' },
  { id: 'leg-curl',         name: 'Leg curl (femoral)',         day: 6, note: 'Pila maquina' },
  { id: 'sumo-squat-kb',   name: 'Sumo squat KB/mancuerna',   day: 6, note: 'Peso total' },
];

// ═══════════════════════════════════════════════════════════════════
// ─── BLOQUES DE MOVILIDAD ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── A1 — PROTOCOLO MATUTINO (todos los días) ────────────────────
const MOB_BLOCK_A1 = {
  id: 'A', name: 'Protocolo matutino — cama y casa', dur: '10-12 min', color: '#0F6E56',
  exs: [
    { n: 'Activacion de core isometrica en colchon', d: '5x5 seg — boca arriba', note: 'Antes de moverse · Rodillas dobladas · Pies en colchon · Brace suave 20% · Exhalacion controlada · Sin retroversion', wid: 'pelvic-clock' },
    { n: 'Pelvic tilt milimetrico en colchon', d: '10 rep muy lentas', note: 'Usar activacion anterior · Aplanar lumbar contra colchon milimetricamente · Sin retroversion activa · Solo contacto lumbar con sabana', wid: 'pelvic-clock' },
    { n: 'Balanceo lateral de rodillas en colchon', d: '10 rep — 2 cm cada lado', note: 'Pies apoyados en cama · Dejar caer rodillas 2 cm a cada lado · Movimiento casi imperceptible · Lubrica facetas · No forzar el rango', wid: 'pelvic-clock' },
    { n: 'Chin tuck supino (activacion cervical)', d: '2x8 — hold 5 seg', note: 'En la cama, boca arriba · Doble menton alargando la nuca SIN levantar la cabeza · Despierta los flexores profundos del cuello · Base postural del dia y prevencion cervical · Mismo control que evita el chin-poke en el core', wid: 'chin-tuck', variant: 'S1-2: retraccion suave sin elevar 2x8 · S3-4: + hold 5 seg · S5-6: cabeza despegada 2 cm · S7+: sostener despegada 10 seg' },
    { n: 'Neck CARs — movilidad cervical', d: '1x3 cada direccion', note: 'Circulos cervicales lentos en rango sin dolor · Hombros quietos · No forzar la extension-rotacion final (cierra el foramen) · Salud articular del cuello', wid: 'neck-cars' },
    { n: 'Pies en silla 90/90 o Viparita Karani', d: '5 min', note: 'Alternar dias · Respiracion diafragmatica · Gluteos separados de la pared — lumbar neutra', wid: 'pies-silla' },
    { n: 'Hip flexor stretch', d: '2x40 seg cada lado', note: 'Psoas diario · Sin retroversion pelvica · Gluteo trasero activo', wid: 'hip-flexor' },
    { n: 'Neural flossing nervio ciatico', d: '2x8 cada lado', note: 'Solo sin irradiacion activa · Deslizamiento puro — cabeza atras al extender la pierna · Cero tension · Parar si calambre o irradiacion', wid: 'neural-flossing', variant: 'S1-2: angulo 30-40° muy suave · S3-4: angulo 60° ritmo lento · S5-6: angulo 80° ritmo moderado · S7+: angulo completo + dorsiflexion activa' },
    { n: 'Descompresion lateral (side-lying)', d: '2-3 min sobre lado no sintomatico', note: 'Tumbado sobre el lado derecho (no sintomatico) · Almohada gruesa o toalla firmemente enrollada justo bajo la cintura · Dejar caer cadera y costillas hacia el colchon abrazando la curva · Completamente pasivo · Abre el foramen L5-S1 izquierdo', wid: 'side-lying-decomp' },
  ]
};

// ─── A1 NEURAL — PROTOCOLO MATUTINO (Mie/Sab) ────────────────────
const MOB_BLOCK_A1_NEURAL = {
  id: 'A', name: 'Protocolo matutino — cama y casa', dur: '10 min', color: '#0F6E56',
  exs: [
    { n: 'Activacion de core isometrica en colchon', d: '5x5 seg — boca arriba', note: 'Antes de moverse · Brace suave 20% · Exhalacion controlada', wid: 'pelvic-clock' },
    { n: 'Pelvic tilt milimetrico en colchon', d: '10 rep muy lentas', note: 'Aplanar lumbar contra colchon milimetricamente · Sin retroversion activa', wid: 'pelvic-clock' },
    { n: 'Balanceo lateral de rodillas en colchon', d: '10 rep — 2 cm cada lado', note: 'Movimiento casi imperceptible · Lubrica facetas', wid: 'pelvic-clock' },
    { n: 'Chin tuck supino (activacion cervical)', d: '2x8 — hold 5 seg', note: 'Boca arriba · Doble menton alargando la nuca SIN levantar la cabeza · Activa los flexores profundos del cuello · Prevencion cervical diaria', wid: 'chin-tuck' },
    { n: 'Viparita Karani', d: '8 min', note: 'Dia neural · Version prolongada · Respiracion diafragmatica lenta · Gluteos separados de la pared', wid: 'viparita' },
    { n: 'Hip flexor stretch', d: '2x40 seg cada lado', note: 'Pasivo · Sin forzar · Gluteo trasero activo', wid: 'hip-flexor' },
    { n: 'Neural flossing nervio ciatico', d: '2x6 cada lado', note: 'Solo sin irradiacion activa · Deslizamiento puro · Muy suave', wid: 'neural-flossing', variant: 'S1-2: angulo 30-40° muy suave · S3-4: angulo 60° · S5-6: angulo 80° · S7+: angulo completo + dorsiflexion' },
    { n: 'Descompresion lateral (side-lying)', d: '2-3 min sobre lado no sintomatico', note: 'Dia neural — descarga pasiva prioritaria · Tumbado sobre el lado derecho (no sintomatico) · Toalla firmemente enrollada bajo la cintura · Dejar caer cadera y costillas abrazando la curva · Completamente pasivo · Abre el foramen L5-S1 izquierdo · Complementa Viparita Karani', wid: 'side-lying-decomp' },
  ]
};

// ─── B — CALENTAMIENTOS PRE-GYM (por día) ─────────────────────────

const MOB_BLOCK_B_LUN = {
  id: 'B', name: 'Calentamiento — Cadena posterior', dur: '18 min', color: '#1A6E3A',
  exs: [
    { n: 'Heel sit', d: '2x45 seg', note: 'Primero · Tronco erguido estricto · Sin retroversion lumbar · Cuadriceps activos frenando · Despues de al menos 30 min en bipedestacion', wid: 'heel-sit-ex' },
    { n: 'Couch stretch', d: '2x40 seg cada lado', note: 'Psoas pre-RDL · Rodilla trasera en suelo junto a pared', variant: 'S1-2: tronco erguido manos en rodilla delantera · S3-4: manos en cadera · S5-6: tronco ligeramente atras · S7+: pie en pared' },
    { n: 'Puente gluteo dinamico', d: '2x10 — 2 seg arriba', note: 'Activacion gluteo pre-hiperextension', wid: 'glute-bridge' },
    { n: 'Deadbug activacion — un miembro', d: '2x6 cada lado', note: 'Core pre-cadena posterior · Lumbar pegada al suelo', wid: 'dead-bug' },
    { n: 'Cat-cow toracico', d: '2x8 lentos', note: 'Solo movimiento toracico · Lumbar estable', wid: 'cat-cow' },
    { n: 'Rotacion toracica en suelo', d: '2x6 cada lado', note: 'Hombros en suelo · Amplitud sin dolor', wid: 'rotacion-toracica' },
    { n: 'Apertura toracica con disco (thoracic plate opener)', d: '2x6-8 — calentamiento', note: 'Arrodillado frente a un foam roller · Disco ligero (o mancuerna) overhead abriendo el pecho · Extension TORACICA pre-RDL e hiperext — mejora la postura de bisagra y libera el cuello · Lumbar neutra', wid: 'apertura-toracica-disco', variant: 'S1-2: sin peso, rango corto · S3-4: disco ligero + pausa 2s · S5-6: disco 5-10kg apertura completa · S7+: en banco con omoplatos al borde' },
    { n: 'Inclinacion lateral con pica (side bend)', d: '2x6 cada lado', note: 'Pica overhead · Inclinacion lateral con espalda recta · Elonga dorsal, intercostales y oblicuos · Libera los costados · Movimiento toracico/costal, no lumbar', wid: 'side-bend-pica', variant: 'S1-2: sin pica, manos en la cabeza · S3-4: pica rango medio · S5-6: rango completo excentrico · S7+: barra ligera sobre los hombros' },
    { n: 'Elephant walk estatico', d: '3x20 seg hold', note: 'Pre-RDL · Manos en superficie elevada · Piernas extendidas · PARAR si irradiacion', wid: 'elephant-walk', variant: 'S1-2: manos banco alto 60-70cm 3x15s · S3-4: banco bajo 40-45cm 3x20s · S5-6: cajon bajo 20-25cm 3x25s · S7+: manos suelo 3x30s' },
  ]
};

const MOB_BLOCK_B_MAR = {
  id: 'B', name: 'Calentamiento — Tiro vertical + Gluteo', dur: '15 min', color: '#1A6E3A',
  exs: [
    { n: 'Heel sit', d: '2x45 seg', note: 'Primero · Tronco erguido estricto · Sin retroversion lumbar · Cuadriceps activos frenando', wid: 'heel-sit-ex' },
    { n: 'Hip CARs', d: '2x5 cada lado', note: 'Rango sin dolor · Tronco estatico', wid: 'hip-cars' },
    { n: 'Outer hip dropset', d: '2x(pie+rodilla) cada lado', note: 'Pre-activacion rotadores externos · Solo niveles 1-2', wid: 'outer-hip' },
    { n: 'Rotacion toracica en suelo', d: '2x8 cada lado', note: 'Hombros en suelo · Movilidad pre-jalon', wid: 'rotacion-toracica' },
    { n: 'Apertura de pecho con banda', d: '2x10', note: 'Retraccion escapular · Prepara jalon y tiro vertical', wid: 'retraccion-escapular' },
    { n: 'Dislocaciones con banda elastica', d: '2x10 amplitud comoda', wid: 'dislocaciones', note: 'Movilidad de hombro · Solo rango sin dolor' },
  ]
};

const MOB_BLOCK_B_MIE = {
  id: 'B', name: 'Calentamiento — Dia neural', dur: '15 min', color: '#1A6E3A',
  exs: [
    { n: 'Heel sit', d: '2x45 seg', note: 'Primero · Tronco erguido estricto · Sin retroversion · Camel como progresion natural', wid: 'heel-sit-ex' },
    { n: 'Seated GM iso hold', d: '2x20 seg', note: 'Bisagra suave · Espalda neutra · Sin forzar', wid: 'seated-gm' },
    { n: 'Hamstring squeeze', d: '2x8 cada lado', note: 'Isometrico suave · Angulo bajo', wid: 'hamstring-squeeze' },
    { n: 'Pigeon pose en banco', d: '2x40 seg cada lado', note: 'Pasivo · Sin presion adicional · L5-S1 izq primero', wid: 'pigeon-pose' },
    { n: 'Cat-cow toracico', d: '2x8 lentos', note: 'Solo toracico · Lumbar estable', wid: 'cat-cow' },
  ]
};

const MOB_BLOCK_B_JUE = {
  id: 'B', name: 'Calentamiento — Empuje/Tiro + Manguito', dur: '20 min', color: '#1A6E3A',
  exs: [
    { n: 'Heel sit', d: '2x45 seg', note: 'Primero · Tronco erguido estricto · Sin retroversion lumbar · Cuadriceps activos frenando', wid: 'heel-sit-ex' },
    { n: 'Cat-cow toracico', d: '2x8 lentos', note: 'Solo movimiento toracico · Lumbar estable', wid: 'cat-cow' },
    { n: 'Rotacion toracica en suelo', d: '2x6 cada lado', note: 'Hombros en suelo · Amplitud sin dolor', wid: 'rotacion-toracica' },
    { n: 'Extension toracica en foam roller', d: '2 min T4-T10', wid: 'ext-toracica-foam', note: 'Solo toracico — nunca lumbar · Prepara el arco de press' },
    { n: 'Apertura toracica con disco (thoracic plate opener)', d: '2x6-8 — calentamiento', note: 'Disco overhead sobre el foam roller abriendo el pecho · Version activa cargada que complementa la extension en foam · Prepara el arco de press y descarga el cuello · Lumbar neutra', wid: 'apertura-toracica-disco', variant: 'S1-2: sin peso, rango corto · S3-4: disco ligero + pausa 2s · S5-6: disco 5-10kg apertura completa · S7+: en banco con omoplatos al borde' },
    { n: 'Dislocaciones con banda elastica', d: '2x10 amplitud comoda', wid: 'dislocaciones', note: 'Movilidad de hombro · Prepara overhead, press y jalon · Solo rango sin dolor' },
    { n: 'Apertura de pecho con banda', d: '2x10', note: 'Apertura pectoral + retraccion escapular · Patron especifico pre-press y pre-tiro', wid: 'retraccion-escapular' },
    { n: 'Retraccion escapular activa', d: '2x10 — pausa 2 seg', wid: 'retraccion-escapular', note: 'Prepara escapula para remo y press · Codos a 90' },
    { n: 'Rotacion externa con banda (manguito)', d: '2x12 cada lado', note: 'Codo a 90° pegado al costado · Pre-activacion infraespinoso (pre-press/pre-remo)', wid: 'ext-rotation-banda', variant: 'S1-2: banda muy ligera ROM parcial · S3-4: banda ligera ROM completo · S5-6: banda media pausa 1s · S7+: banda media + exc 3s' },
    { n: 'Rotacion interna con banda (manguito)', d: '2x12 cada lado', note: 'Mismo agarre · Direccion opuesta · Equilibra ratio rotadores · Pre-activacion subescapular', wid: 'int-rotation-banda', variant: 'S1-2: banda muy ligera · S3-4: banda ligera ROM completo · S5-6: banda media · S7+: banda media exc 3s' },
    { n: 'Prone Y con banda ligera', d: '2x10', note: 'Brazos en Y 135° · Trapecio inferior y supraespinoso · Salud de hombro pre-empuje', wid: 'prone-y-banda', variant: 'S1-2: sin banda — solo activacion · S3-4: banda muy ligera · S5-6: banda ligera pausa 1s arriba · S7+: + T (brazos a 90°)' },
    { n: 'Deadbug activacion — un miembro', d: '2x6 cada lado', note: 'Core pre-sesion · Lumbar pegada al suelo', wid: 'dead-bug' },
  ]
};

const MOB_BLOCK_B_VIE = {
  id: 'B', name: 'Calentamiento — Squat + Cadera', dur: '15 min', color: '#1A6E3A',
  exs: [
    { n: 'Heel sit', d: '2x45 seg', note: 'Primero · Tronco erguido estricto · Sin retroversion · Pre-squat y pierna', wid: 'heel-sit-ex' },
    { n: 'Couch stretch', d: '2x40 seg cada lado', note: 'Psoas pre-squat y pre-split squat · Rodilla trasera en suelo junto a pared', variant: 'S1-2: tronco erguido manos en rodilla delantera · S3-4: manos en cadera · S5-6: tronco ligeramente atras · S7+: pie en pared' },
    { n: 'Hip CARs', d: '2x5 cada lado', note: 'Movilidad de cadera en todo el rango · Tronco estatico · Patron especifico pre-sentadilla', wid: 'hip-cars' },
    { n: 'Sentadilla bodyweight con pausa', d: '2x8 — pausa 2 seg abajo', note: 'Patron squat sin carga · Activa cadena anterior', wid: 'sentadilla-bw' },
    { n: 'Leg swing frontal y lateral', d: '2x8 cada direccion cada lado', wid: 'leg-swing', note: 'Movilidad flexores cadera + abductores · Apoyo en pared' },
    { n: 'Rotacion toracica en suelo', d: '2x6 cada lado', note: 'Movilidad general de columna alta · Lumbar estable', wid: 'rotacion-toracica' },
  ]
};

const MOB_BLOCK_B_SAB = {
  id: 'B', name: 'Calentamiento — Dia neural', dur: '15 min', color: '#1A6E3A',
  exs: [
    { n: 'Seated GM iso hold', d: '2x20 seg', note: 'Bisagra suave · Espalda neutra', wid: 'seated-gm' },
    { n: 'Hamstring squeeze', d: '2x8 cada lado', note: 'Isometrico suave · Angulo bajo', wid: 'hamstring-squeeze' },
    { n: 'Pigeon pose en banco', d: '2x40 seg cada lado', note: 'Pasivo · Sin presion adicional · L5-S1 izq primero', wid: 'pigeon-pose' },
    { n: 'Cat-cow toracico', d: '2x8 lentos', note: 'Solo toracico · Lumbar estable', wid: 'cat-cow' },
  ]
};

// ═══════════════════════════════════════════════════════════════════
// ─── BLOQUES PISCINA ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

const POOL_F_LUN = { id: 'F', name: 'Piscina — Cardio bajo impacto', dur: '12 min', color: '#1A6E8A', exs: [
  { n: 'Intervalos sprint agua profunda — noodle', d: '6x (20s sprint / 40s recuperacion)', note: 'Noodle bajo axilas · Correr en sitio agua profunda · Sin contacto fondo · Core activo · NO arquear lumbar en sprint', variant: 'S1-2: 4x (15s moderado / 45s reposo) · S3-4: 5x (20s sprint / 40s suave) · S5-6: 6x (20s sprint / 40s suave) · S7+: 8x (20s sprint / 30s suave) · F3: 10x (20s sprint / 20s suave)' },
  { n: 'Isometricos en barra — traccion lumbar', d: '3x30 seg', note: 'Descompresion pre-largos · Rodillas recogidas · Dejar que el agua tire · Obligatorio antes de largos', wid: 'traccion-barra-agua' },
]};

const POOL_F_MAR = { id: 'F', name: 'Piscina — Cardio bajo impacto', dur: '10 min', color: '#1A6E8A', exs: [
  { n: 'Intervalos sprint agua profunda — noodle', d: '5x (20s sprint / 40s recuperacion)', note: 'Noodle bajo axilas · Correr en sitio · Maxima frecuencia de piernas · Brazos activos en agua', variant: 'S1-2: 3x (15s / 45s) · S3-4: 4x (20s / 40s) · S5-6: 5x (20s / 40s) · S7+: 6x (25s / 35s) · F3: 8x (25s / 25s)' },
  { n: 'Isometricos en barra — traccion lumbar', d: '3x30 seg', note: 'Descompresion pre-largos · Rodillas recogidas', wid: 'traccion-barra-agua' },
]};

const POOL_F_JUE = { id: 'F', name: 'Piscina — Cardio bajo impacto', dur: '10 min', color: '#1A6E8A', exs: [
  { n: 'Intervalos sprint agua profunda — noodle', d: '6x (20s sprint / 40s recuperacion)', note: 'Noodle · Mayor enfasis en brazos hoy — resistencia hidrodinamica complementa el trabajo de tiro horizontal', variant: 'S1-2: 4x (15s / 45s) · S3-4: 5x (20s / 40s) · S5-6: 6x (20s / 40s) · S7+: 8x (20s / 30s) · F3: 10x (20s / 20s)' },
  { n: 'Isometricos en barra — traccion lumbar', d: '3x30 seg', note: 'Descompresion pre-largos', wid: 'traccion-barra-agua' },
]};

const POOL_F_VIE = { id: 'F', name: 'Piscina — Cardio bajo impacto', dur: '5 min', color: '#1A6E8A', exs: [
  { n: 'Isometricos en barra — traccion lumbar', d: '3x30 seg', note: 'Descompresion pre-largos · Piernas ya cargadas con prensa y squat — solo traccion descompresiva', wid: 'traccion-barra-agua' },
]};

const POOL_G_LUN = { id: 'G', name: 'Piscina — Largos (40 min)', dur: '40 min', color: '#185FA5', exs: [
  { n: 'Bloque 1 — Espalda tecnica (16 min ~40%)', d: 'Ver variante · Estilo principal L5-S1', note: 'Espalda 40% del volumen total · Posicion supina mas descompresiva · Bilateral por defecto', variant: 'S1-2: 6x50m espalda basica — descanso 30s · S3-4: 8x50m espalda — descanso 20s · S5-6: 4x100m espalda — descanso 20s · S7+: 3x150m espalda descanso 15s + 2x25m sprint espalda · F3: 400m espalda continuo + 4x25m sprint' },
  { n: 'Bloque 2 — Crol variado (16 min ~40%)', d: 'Ver variante · Tecnica y resistencia', note: 'Crol con drills tecnicos intercalados · Bilateral breathing cada 3 brazadas', variant: 'S1-2: 4x50m crol pull buoy — descanso 30s + catch-up drill 2x25m · S3-4: 6x50m crol pull buoy descanso 20s · S5-6: 4x100m crol alternando 50m pull buoy + 50m completo · S7+: 3x150m crol — descanso 15s · F3: 400m crol bilateral continuo + 4x25m sprint' },
  { n: 'Bloque 3 — Braza con pull buoy (8 min ~20%)', d: 'Ver variante · Pull buoy obligatorio — sin patada', note: 'SOLO brazada de braza — pull buoy fija piernas · Sin patada de braza — evita extension lumbar activa en L4-S1', variant: 'S1-2: 4x25m braza pull buoy — descanso 30s · S3-4: 6x25m braza pull buoy — descanso 20s · S5-6: 4x50m braza pull buoy · S7+: 2x100m braza pull buoy · F3: 200m braza pull buoy continuo' },
  { n: 'Drills finales — kick y buceo (5 min)', d: '4x25m drill a elegir', note: 'Kick drill con tabla · O buceo corto 5-8m bajo el agua', variant: 'S1-2: kick espalda 4x25m tabla · S3-4: kick crol 2x25m + kick espalda 2x25m · S5-6: kick crol intensidad media 4x25m · S7+: kick crol + buceo 5m al virar · F3: kick sprint + buceo 8m cada viraje' },
]};

const POOL_G_MAR = { id: 'G', name: 'Piscina — Largos (40 min)', dur: '40 min', color: '#185FA5', exs: [
  { n: 'Bloque 1 — Espalda con variaciones (16 min ~40%)', d: 'Ver variante · Enfasis en rotacion y brazada', note: 'Espalda 40% · Hoy incluir variaciones: espalda con paletas + espalda un brazo + espalda con kick acentuado', variant: 'S1-2: 6x50m espalda basica · S3-4: 4x50m espalda + 4x50m espalda un brazo alternado · S5-6: 4x100m espalda — 50m con paletas 50m sin · S7+: 3x150m espalda alternando un brazo / dos brazos · F3: 400m espalda con cambio de ritmo cada 100m' },
  { n: 'Bloque 2 — Crol tecnico (14 min ~35%)', d: 'Ver variante · Catch-up y bilateral', note: 'Menor volumen de crol hoy — jalones ya trabajaron dorsal · Bilateral breathing obligatorio', variant: 'S1-2: 4x50m crol pull buoy · S3-4: 4x50m crol pull buoy + catch-up drill 2x25m · S5-6: 4x75m crol — 25m catch-up + 50m normal · S7+: 4x100m crol bilateral · F3: 300m crol continuo + 4x25m sprint' },
  { n: 'Bloque 3 — Braza pull buoy (10 min ~25%)', d: 'Ver variante · Pull buoy obligatorio', note: 'Mayor proporcion de braza hoy — complementa el trabajo de pecho', variant: 'S1-2: 4x25m braza pull buoy · S3-4: 6x25m braza pull buoy · S5-6: 6x50m braza pull buoy · S7+: 3x100m braza pull buoy · F3: 250m braza pull buoy continuo' },
  { n: 'Drills finales — buceo y tecnica', d: '4x largo a elegir', note: 'Buceo corto al virar si tolera apnea · O finger drag drill · O kick espalda de cierre', variant: 'S1-2: kick espalda 4x25m · S3-4: kick crol 2x + buceo 5m en viraje · S5-6: finger drag 2x25m + buceo 6m · S7+: catch-up + buceo 8m cada viraje · F3: buceo 10m cada viraje todos los largos' },
]};

const POOL_G_JUE = { id: 'G', name: 'Piscina — Largos (40 min)', dur: '40 min', color: '#185FA5', exs: [
  { n: 'Bloque 1 — Espalda con paletas (16 min ~40%)', d: 'Ver variante · Mayor resistencia en espalda', note: 'Espalda 40% · Paletas incrementan resistencia sin carga axial', variant: 'S1-2: 6x50m espalda sin paletas · S3-4: 4x50m espalda sin paletas + 4x50m con paletas · S5-6: 4x100m espalda con paletas · S7+: 3x150m espalda paletas descanso 15s + 2x25m sprint sin paletas · F3: 400m espalda paletas continuo' },
  { n: 'Bloque 2 — Crol intervalos (16 min ~40%)', d: 'Ver variante · Estructura de intervalos', note: 'Hoy crol en intervalos — pecho y remo ya cargados · Recuperacion activa con espalda entre series', variant: 'S1-2: 4x50m crol pull buoy · S3-4: 4x50m crol + 2x50m espalda recuperacion · S5-6: 4x (75m crol + 25m espalda recuperacion) · S7+: 4x (100m crol + 50m espalda) · F3: 4x (100m crol sprint + 50m espalda suave)' },
  { n: 'Bloque 3 — Braza pull buoy + buceo (8 min ~20%)', d: 'Ver variante', note: 'Braza pull buoy + buceos cortos al virar · El buceo activa el nervio vago', variant: 'S1-2: 4x25m braza pull buoy · S3-4: 6x25m braza pull buoy + buceo 4m en viraje · S5-6: 4x50m braza pull buoy + buceo 5m · S7+: 2x100m braza pull buoy + buceo 6m cada viraje · F3: 200m braza pull buoy + buceo 8m cada viraje' },
  { n: 'Drills finales — tecnica libre', d: '4x25m a elegir', note: 'Catch-up drill · O finger drag · O kick crol · Segun fatiga acumulada del dia', variant: 'S1-2: kick espalda 4x25m · S3-4: catch-up 2x25m + kick espalda 2x25m · S5-6: finger drag 4x25m · S7+: drill libre elegido + sprint 10m al final de cada largo · F3: drill libre + buceo 8m' },
]};

const POOL_G_VIE = { id: 'G', name: 'Piscina — Largos (40 min)', dur: '40 min', color: '#185FA5', exs: [
  { n: 'Bloque 1 — Espalda recuperacion activa (16 min ~40%)', d: 'Ver variante · Ritmo controlado — piernas ya cargadas', note: 'Espalda 40% · Viernes: piernas muy cargadas de squat y prensa · Patada muy suave o nula', variant: 'S1-2: 6x50m espalda — descanso 30s patada minima · S3-4: 8x50m espalda — descanso 20s · S5-6: 4x100m espalda · S7+: 4x100m espalda descanso 15s + 2x50m espalda un brazo · F3: 400m espalda — primeros 200m suave, segundos 200m progresivo' },
  { n: 'Bloque 2 — Crol pull buoy (14 min ~35%)', d: 'Ver variante · Pull buoy obligatorio hoy', note: 'Pull buoy hoy — evitar patada de piernas cargadas · Enfasis total en brazada y rotacion de tronco', variant: 'S1-2: 4x50m crol pull buoy · S3-4: 6x50m crol pull buoy · S5-6: 4x100m crol pull buoy · S7+: 3x150m crol pull buoy · F3: 350m crol pull buoy continuo' },
  { n: 'Bloque 3 — Braza pull buoy cierre (10 min ~25%)', d: 'Ver variante', note: 'Mayor proporcion de braza de cierre — ritmo suave · Pull buoy obliga a no patear', variant: 'S1-2: 4x25m braza pull buoy suave — descanso 40s · S3-4: 6x25m braza pull buoy · S5-6: 4x50m braza pull buoy suave · S7+: 3x100m braza pull buoy suave · F3: 250m braza pull buoy suave continuo' },
  { n: 'Drills finales — buceo y recuperacion', d: '4x25m', note: 'Buceo corto al final de cada largo · Activacion parasimpatica', variant: 'S1-2: kick espalda 4x25m muy suave · S3-4: kick espalda 4x25m + buceo 4m al virar · S5-6: buceo 6m cada largo 4x25m · S7+: buceo 8m cada largo 4x25m · F3: buceo 10m + apnea estatica 20s en pared al final' },
]};

function makePoolH(exsPost) {
  return { id: 'H', name: 'Piscina — Vuelta a la calma', dur: '8-10 min', color: '#0F6E56', exs: [...exsPost] };
}

const POOL_POST_LUN = [
  { n: 'Estiramiento psoas en escalerilla', d: '2x40 seg cada lado', note: 'Post-cadena posterior · Cadera hundida al agua · L5-S1 izq primero', wid: 'psoas-escalerilla' },
  { n: 'Hamstring stretch en barra', d: '2x40 seg cada lado', note: 'Isquiotibiales post-RDL · Talon en escalon · Agua sostiene el peso', wid: 'hamstring-barra-agua' },
  { n: 'Rotacion toracica en agua', d: '2x8 cada lado', note: 'Movilidad toracica post-hiperext · Solo toracico · Brazos en superficie', wid: 'rotacion-agua' },
];
const POOL_POST_MAR = [
  { n: 'Estiramiento dorsal en borde', d: '3x30 seg', note: 'Post-jalon · Manos en borde · Hundir caderas · Traccion dorsal con descompresion', wid: 'est-dorsal-agua' },
  { n: 'Piriforme + gluteo — piscina', d: '2x45 seg cada lado', note: 'Post-hip thrust · L5-S1 izq primero · Dos posiciones', wid: 'est-gluteo-agua', variant: 'S1-2: Pigeon escalerilla · S3-4: Pigeon mayor profundidad · S5-6: Gluteo stretch borde tobillo cruzado sobre rodilla · S7+: Ambas 30s cada una · F3: Pigeon suelo clasico' },
];
const POOL_POST_JUE = [
  { n: 'Estiramiento pectoral en esquina', d: '2x40 seg', note: 'Post-press · Esquina del vaso · Un brazo en cada borde 90° · Hundir pecho al agua', wid: 'est-pectoral-agua' },
  { n: 'Estiramiento dorsal + trapecio en barra', d: '2x30 seg cada lado', note: 'Post-remo · Rotacion lateral de tronco mientras tracciona', wid: 'est-dorsal-agua' },
  { n: 'Stretch serrato en borde', d: '2x30 seg cada lado', note: 'Post-tiro horizontal · Un brazo extendido en borde · Cuerpo girado', wid: 'est-dorsal-agua' },
];
const POOL_POST_VIE = [
  { n: 'Estiramiento TFL en borde', d: '2x45 seg cada lado', note: 'Post-prensa y abductores · De lado al muro · Cadera empujada hacia el muro', wid: 'est-tfl-agua' },
  { n: 'Abductor stretch en escalerilla', d: '2x40 seg cada lado', note: 'Post-abduccion maquina · Pierna abierta lateral en escalon', wid: 'est-abductor-agua' },
  { n: 'Quadriceps stretch en borde', d: '2x35 seg cada lado', note: 'Post-squat · Talon al gluteo · Una mano en borde', wid: 'est-cuadriceps-agua' },
];

// ═══════════════════════════════════════════════════════════════════
// ─── SESSIONS — SESIONES PRINCIPALES ──────────────────────────────
// ═══════════════════════════════════════════════════════════════════

// ─── BLOQUE TIERRA — Estabilidad + pierna ligera (dias de piscina Mar/Vie) ──
const BLOCK_ESTAB_PIERNA = {
  id: 'D', name: 'Estabilidad + pierna ligera', dur: '25-30 min', color: '#0F6E56',
  exs: [
    { n: 'Hip CARs', d: '2x5 cada lado', note: 'Movilidad de cadera · Calentamiento · Tronco estatico', wid: 'hip-cars' },
    { n: '90/90 stretch activo', d: '2x40 seg cada lado', note: 'Rotacion de cadera · Pelvis neutra', wid: '90-90', variant: 'S1-2: pasivo con apoyo de manos · S3-4: contraccion gluteo 5s · S5-6: inclinacion de tronco · S7+: ambas posiciones encadenadas' },
    { n: 'Glute bridge unilateral', d: '3x12 cada lado — pausa 2 seg', note: 'Pelvis nivelada · Sin carga axial', wid: 'glute-bridge-uni', variant: 'S1-2: bilateral como base · S3-4: unilateral pierna flexionada · S5-6: unilateral pierna extendida · S7+: mancuerna en cadera' },
    { n: 'Hip thrust ligero', d: '3x12 — control', note: 'Motor gluteo a carga ligera · Pausa 1s arriba · Sin buscar el fallo', wid: 'hip-thrust', variant: 'S1-2: glute bridge isometrico 5s · S3-4: hip thrust PC pausa 2s · S5-6: carga ligera · S7+: carga moderada control' },
    { n: 'Clamshell con banda elastica', d: '3x15 cada lado', note: 'Gluteo medio · Pelvis estable', wid: 'clamshell', variant: 'S1-2: sin banda · S3-4: banda ligera · S5-6: banda media · S7+: banda fuerte pausa 2s' },
    { n: 'Monster walk lateral con banda', d: '3x15m', note: 'Gluteo medio · Cadera neutral', wid: 'monster-walk', variant: 'S1-2: muslos ritmo lento · S3-4: muslos 15m · S5-6: 15m + pausa cada 5 pasos · S7+: tobillos si sin irradiacion' },
    { n: 'Sentadilla goblet ligera con pausa', d: '3x10 — pausa 2 seg abajo', note: 'Patron de sentadilla SIN fatiga · Mancuerna/KB ligera entre las piernas · Tronco vertical · Espalda neutra · Solo movilidad y control', wid: 'goblet-squat', variant: 'S1-2: peso corporal · S3-4: KB 8kg · S5-6: KB 12kg · S7+: KB 16kg pausa 3s' },
    { n: 'Wall sit isometrico', d: '3x30-45 seg', note: 'Espalda pegada a la pared · Rodillas 90° · Sin carga axial · Cuadriceps', wid: 'wall-sit', variant: 'S1-2: 100-110° 20s · S3-4: 90° 30s · S5-6: 90° 45s · S7+: unilateral 20s' },
  ]
};

// ─── BLOQUE PISCINA UNIFICADO — adaptable semanalmente (Mar/Vie) ───────────
const POOL_UNIFICADA = {
  id: 'G', name: 'Piscina — Largos adaptables + descompresion', dur: '25-35 min', color: '#185FA5',
  exs: [
    { n: 'Traccion lumbar en barra', d: '3x30 seg', note: 'Descompresion inicial · Rodillas recogidas · Dejar que el agua tire · Hombros relajados', wid: 'traccion-barra-agua' },
    { n: 'Bloque espalda — tecnica (lo mas descompresivo)', d: 'Ver variante · Estilo principal L5-S1', note: 'Posicion supina la mas descompresiva · Bilateral por defecto · Empezar siempre por espalda', variant: 'S1-2: 6x50m espalda basica descanso 30s · S3-4: 8x50m espalda descanso 20s · S5-6: 4x100m espalda · S7+: 3x150m espalda + 2x25m sprint · F3: 400m continuo + 4x25m sprint' },
    { n: 'Bloque crol con pull buoy', d: 'Ver variante · Ritmo comodo', note: 'Pull buoy para descargar piernas · Respiracion bilateral cada 3 brazadas', variant: 'S1-2: 4x50m pull buoy descanso 30s · S3-4: 6x50m pull buoy descanso 20s · S5-6: 4x100m alternando · S7+: 3x150m · F3: 400m continuo' },
    { n: 'Bloque braza con pull buoy (sin patada)', d: 'Ver variante · Pull buoy obligatorio', note: 'SOLO brazada · Pull buoy fija las piernas · Sin patada de braza — evita extension lumbar activa', variant: 'S1-2: 4x25m descanso 30s · S3-4: 6x25m descanso 20s · S5-6: 4x50m · S7+: 2x100m · F3: 200m continuo' },
  ]
};

// ─── BLOQUE CORE pre-piscina — colgado + planchas variadas (Mar/Vie) ───────
const BLOCK_CORE_PISCINA = {
  id: 'E', name: 'Core — colgado + planchas (pre-piscina)', dur: '15-20 min', color: '#993C1D',
  exs: [
    { n: 'Hollow body hang colgado en barra', d: '3x10-15 seg', note: 'Colgado de la barra en posicion hollow (lumbar neutra, pelvis en retroversion suave) · Doble efecto: core anti-extension + traccion descompresiva del colgado · Solo sin irradiacion · Soltar si falla el agarre o aparece irradiacion S1', wid: 'hollow-body', variant: 'S1-2: dead hang pasivo 3x20s — solo descompresion · S3-4: rodillas recogidas (tuck) 3x10s · S5-6: tuck + extension parcial 3x12s · S7+: hollow hang piernas extendidas 3x10-15s · F3: con elevacion de rodillas controlada' },
    { n: 'Plancha anterior', d: '3x30-45 seg', note: 'Empujar el suelo con los codos · Gluteo y core activos · Lumbar neutra — ni hundida ni elevada', wid: 'plank-anterior', variant: 'S1-2: 20s rodillas · S3-4: 30s completo · S5-6: 45s · S7+: elevacion alterna de brazo/pierna' },
    { n: 'Plancha lateral', d: '3x25-35 seg cada lado', note: 'Cadera elevada · Cuerpo en linea · Anti-flexion lateral', wid: 'plank-lateral', variant: 'S1-2: rodillas 20s · S3-4: completo 25s · S5-6: 35s · S7+: abduccion de pierna superior' },
    { n: 'Copenhagen plank (plancha de aductores)', d: '3x15-25 seg cada lado', note: 'Variada · Pie/rodilla superior apoyado en banco · Aductor + oblicuo + estabilizador de cadera · Pelvis nivelada · Progresar muy gradual', wid: 'copenhagen-plank', variant: 'S1-2: rodilla apoyada en banco (palanca corta) 3x15s · S3-4: rodilla, mas tiempo 3x20s · S5-6: pie en banco palanca larga 3x15s · S7+: pie en banco + elevacion de pierna libre' },
  ]
};

// ═══════════════════════════════════════════════════════════════════
// ─── CATÁLOGO DE EJERCICIOS por grupo muscular (IDs globales) ──────
// Fuente única consultable. El plan semanal (WEEK) referencia estos IDs.
// Migracion incremental: empezamos por CORE; otros grupos se anaden igual.
// ═══════════════════════════════════════════════════════════════════
const CORE = {
  'A':  { grupo:'core', plano:'anti-ext', equipo:'bw',
    n:'Dead bug con extension completa', d:'3x10 cada lado', note:'Lumbar pegada al suelo siempre · Nuca apoyada y cuello sin tension (no levantar la cabeza)', wid:'dead-bug',
    variant:'S1-2: un miembro solo · S3-4: contralateral completo · S5-6: press palma rodilla · S7+: con peso en pie' },
  'B':  { grupo:'core', plano:'anti-rot', equipo:'bw',
    n:'Bird dog con pausa', d:'3x10 cada lado — pausa 3 seg', note:'Control pelvico · Cuello neutro, mirada al suelo (no levantar la barbilla)', wid:'bird-dog',
    variant:'S1-2: brazo o pierna separado · S3-4: contralateral pausa 3s · S5-6: banda tobillo · S7+: superficie inestable' },
  'C':  { grupo:'core', plano:'anti-ext', equipo:'bw',
    n:'Plank anterior', d:'3x30-45 seg', note:'Empujar suelo con codos · Gluteo y core activos · Lumbar neutra · Cuello largo, mirada al suelo y hombros lejos de las orejas (no mirar al frente)', wid:'plank-anterior',
    variant:'S1-2: 20s rodillas · S3-4: 30s completo · S5-6: 45s · S7+: elevacion alterna de brazo/pierna' },
  'D':  { grupo:'core', plano:'anti-lat', equipo:'bw',
    n:'Plank lateral', d:'3x25-35 seg cada lado', note:'Cadera elevada · Cuerpo en linea · Anti-flexion lateral · Cuello en linea con la columna: no dejar caer la cabeza hacia el suelo ni girarla para mirar al techo. Si tensa el cuello, apoyar la cabeza sobre el brazo de abajo', wid:'plank-lateral',
    variant:'S1-2: rodillas 20s · S3-4: completo 25s · S5-6: 35s · S7+: abduccion de pierna superior' },
  'E':  { grupo:'core', plano:'anti-ext', equipo:'bw',
    n:'Hollow body hold', d:'3x20 seg', note:'Lumbar neutra obligatorio · Solo sin irradiacion · Barbilla al pecho y mirada a los muslos — no echar la cabeza atras ni craneo el cuello (regresion: cabeza apoyada en el suelo o sobre un bloque/toalla bajos)', wid:'hollow-body',
    variant:'S1-2: rodillas 15s · S3-4: piernas 45° 20s · S5-6: piernas 30° 25s · S7+: piernas 15° 30s · F3: en barra 3x10-15s' },
  'F':  { grupo:'core', plano:'anti-ext+descomp', equipo:'barra',
    n:'Hollow body hang colgado en barra', d:'3x10-15 seg', note:'Colgado de la barra en hollow (lumbar neutra, pelvis en retroversion suave) · Core anti-extension + traccion descompresiva · Solo sin irradiacion · Soltar si falla agarre o irradiacion S1 · Activa los hombros tirando de las escapulas hacia abajo (cuello largo): colgar con hombros encogidos hasta las orejas tensa el cuello', wid:'hollow-body',
    variant:'S1-2: dead hang pasivo 3x20s — solo descompresion · S3-4: rodillas recogidas (tuck) 3x10s · S5-6: tuck + extension parcial 3x12s · S7+: hollow hang piernas extendidas 3x10-15s · F3: con elevacion de rodillas' },
  'G':  { grupo:'core', plano:'anti-rot', equipo:'polea',
    n:'Pallof press en polea', d:'3x10 diagonal cada lado', note:'Anti-rotacion · Resistir el giro sin generarlo — lo mas protector para la extrusion · Hombros bajos y relajados lejos de las orejas, cuello neutro: el esfuerzo de resistir el giro no debe trasladarse a encoger los trapecios', wid:'pallof-press',
    variant:'S1-2: isometrico pecho · S3-4: press diagonal · S5-6: press + paso lateral · S7+: de rodillas en superficie inestable' },
  'G2': { grupo:'core', plano:'anti-rot', equipo:'banda',
    n:'Pallof press con banda', d:'3x10 cada lado', note:'Anti-rotacion version banda (apta para casa) · Banda anclada al costado a altura de pecho · Pelvis y tronco fijos · Hombros y cuello relajados, sin encoger los trapecios al resistir la banda', wid:'pallof-press',
    variant:'S1-2: banda ligera isometrico pecho · S3-4: banda media press diagonal · S5-6: banda fuerte · S7+: + paso lateral' },
  'H':  { grupo:'core', plano:'anti-lat', equipo:'bw/banco',
    n:'Copenhagen plank (plancha de aductores)', d:'3x15-25 seg cada lado', note:'Variada · Pie/rodilla superior en banco · Aductor + oblicuo + estabilizador de cadera · Pelvis nivelada · Cuello largo y en linea (no dejar caer la cabeza); puedes apoyar la cabeza sobre el brazo de abajo para descargar el cuello', wid:'copenhagen-plank',
    variant:'S1-2: rodilla apoyada (palanca corta) 3x15s · S3-4: rodilla mas tiempo 3x20s · S5-6: pie en banco palanca larga 3x15s · S7+: pie en banco + elevacion de pierna libre' },
  'I':  { grupo:'core', plano:'transfer-agua', equipo:'piscina',
    n:'Streamline + plancha flotante con pull buoy', d:'4x15-20 m / 30 seg', note:'Lleva el brace de la plancha al agua · Pull buoy entre los muslos · Cuerpo rigido en hollow/streamline (lumbar neutra) · Deslizar manteniendo el mismo brace que en tierra · Sin arquear · Cabeza entre los brazos con cuello en linea (mirada al fondo), sin hiperextender el cuello para sacar la cara', wid:'hollow-body',
    variant:'S1-2: hold streamline estatico agarrado al borde 4x20s · S3-4: deslizamiento tras impulso 4x15m · S5-6: deslizamiento + patada suave manteniendo linea · S7+: deslizamiento largo + rotacion controlada' },
  'J':  { grupo:'core', plano:'anti-ext-inf', equipo:'polea',
    n:'Leg raise en polea baja', d:'3x10', note:'Decubito supino · Cable en tobillos · Lumbar pegada al suelo — PARAR si se despega · Nuca apoyada en el suelo y cuello relajado: no levantar la cabeza para mirar las piernas (carga los flexores cervicales)', wid:'leg-raise-polea',
    variant:'S1-4: no introducir · S5-6: rodillas semiflexionadas peso minimo 3x8 · S7+: piernas mas extendidas 3x10 · F3: piernas rectas rango completo' },
  'K':  { grupo:'core', plano:'anti-lat', equipo:'mancuerna/banda',
    n:'Suitcase carry / hold', d:'3x30-40 seg o 3x20m por lado', note:'Peso en UNA mano (mancuerna, KB o banda) · Anti-flexion lateral · Tronco vertical sin inclinarse hacia el peso · Hombros y caderas nivelados · Cuello neutro y mirada al frente: no encojas el trapecio del lado del peso ni inclines la cabeza para compensar', wid:'flexion-lateral-mancuerna',
    variant:'S1-2: hold ligero 30s · S3-4: hold medio 40s · S5-6: caminata (carry) 20m · S7+: carry pesado 20m + cambios de direccion' },
  'L':  { grupo:'core', plano:'compuesto', equipo:'bw',
    n:'L-sit progresion', d:'3x10-15 seg', note:'Flexores de cadera + core · Solo sin irradiacion · Hombros deprimidos lejos de las orejas y cuello largo: al empujar el suelo con las manos no encojas los trapecios — es el fallo cervical tipico en apoyos sobre las manos', wid:'l-sit',
    variant:'S1-2: pies 5cm 8s · S3-4: tucked 10s · S5-6: tucked 15s · S7+: piernas extendidas' },
  'M':  { grupo:'core', plano:'anti-ext+flexor-cadera', equipo:'bw',
    n:'Plancha con extension de cadera activa', d:'3x8-10 rep cada lado', note:'Desde plancha anterior — elevar una pierna extendida hacia atras hasta altura de cadera · Gluteo activo en la pierna elevada · Flexores de cadera opuestos trabajando isometricamente · Lumbar neutra obligatorio — no arquear al subir la pierna · Pelvis no rotar · Pausa 1-2 seg arriba · Cuello neutro y mirada al suelo: el impulso de subir la pierna no debe arrastrar la cabeza hacia arriba', wid:'plank-hip-extension',
    variant:'S1-2: desde rodillas, elevar pierna 10 cm 3x6 · S3-4: plancha completa, elevacion parcial (45°) 3x8 · S5-6: plancha completa, elevacion hasta horizontal 3x10 · S7+: elevacion con tobillera ligera o banda en tobillos 3x10' },
  'N':  { grupo:'core', plano:'flexor-cadera+anti-ext', equipo:'banco',
    n:'Hip flexor plank (plancha flexor cadera en banco)', d:'3x10-12 rep cada lado', note:'Plancha con una rodilla apoyada en el banco y la otra pierna suspendida · Flexionar y extender la pierna suspendida de forma controlada · La rodilla en el banco estabiliza la pelvis · Core activo durante todo el movimiento · Cuello largo y mirada al suelo, hombros lejos de las orejas', wid:'hip-flexor-plank',
    variant:'S1-2: rodilla apoyada — solo mantener posicion 3x20s · S3-4: pierna suspendida, recorrido corto (30°) 3x10 · S5-6: recorrido completo rodilla al pecho 3x12 · S7+: tobillera ligera + pausa 1s en flexion maxima' },
  'O':  { grupo:'core', plano:'flexor-cadera+anti-ext', equipo:'banco',
    n:'Hip flexor pike (pike flexor cadera en banco)', d:'3x8-10 rep cada lado', note:'Plancha con una rodilla apoyada en el banco · Elevar la cadera al mismo tiempo que se extiende la pierna libre hacia arriba (movimiento pike) · Combina flexor de cadera con control lumbar · No hiperlordosis al bajar · Cuello neutro y hombros activos lejos de las orejas (no forzar la cabeza hacia el pecho)', wid:'hip-flexor-pike',
    variant:'S1-2: solo elevacion de cadera (sin pierna extendida) 3x8 · S3-4: pike parcial pierna extendida 45° 3x8 · S5-6: pike completo pierna vertical 3x10 · S7+: pike completo + pausa 2s arriba 3x10' },
  'P':  { grupo:'core', plano:'protraccion-serrato+anti-ext', equipo:'bw',
    n:'Protraccion escapular en plancha (serrato) — hold', d:'3x20-30 seg', note:'Desde plancha (rodillas o pies) · Empujar el suelo separando las escapulas (protraccion maxima) y mantener · Serrato anterior isometrico · Lumbar NEUTRA — la protraccion es escapular, no lumbar · Costillas abajo, sin arquear', wid:'protraccion-serrato-plancha',
    variant:'S1-2: desde rodillas 3x15s · S3-4: plancha completa 3x20s · S5-6: plancha completa 3x30s · S7+: una mano sobre foam/balon (inestable) 3x20s' },
  'Q':  { grupo:'core', plano:'protraccion-serrato', equipo:'pared/banda',
    n:'Serratus wall slide — hold isometrico', d:'3x20-30 seg', note:'Antebrazos en la pared · Deslizar arriba protraendo las escapulas y mantener arriba · Serrato en cadena cerrada de pie · Lumbar neutra, costillas abajo — NO arquear para alcanzar mas alto', wid:'serratus-wall-slide',
    variant:'S1-2: rango bajo 3x15s · S3-4: rango medio 3x20s · S5-6: rango alto + protraccion maxima 3x25s · S7+: con banda alrededor de los antebrazos 3x30s' },
  'R':  { grupo:'core', plano:'anti-rot+pull', equipo:'mancuerna/banco',
    n:'Remo unilateral en banco con pierna contraria elevada', d:'3x10 cada lado', note:'Una mano y una rodilla apoyadas en el banco · La pierna contraria se extiende y se eleva a la altura de la cadera (isometrica) · Rema con el brazo libre sin rotar la pelvis ni el tronco — el reto es anti-rotacion · El tiron sale de la escapula y el dorsal, no de la zona baja de la espalda · Lumbar y cuello neutros, mirada al suelo', wid:'remo-unilateral-pierna-elevada', gym:true,
    variant:'S1-2: sin pierna elevada, remo apoyado clasico carga ligera · S3-4: pierna elevada a media altura, remo controlado · S5-6: pierna a la altura de la cadera + pausa 1s arriba · S7+: pierna elevada + excentrico 3s + carga progresiva',
    homeAlt:{ n:'Remo unilateral con banda y pierna elevada', d:'3x10 cada lado', note:'Banda anclada baja al frente · Misma posicion en banco o silla con la pierna contraria elevada · Anti-rotacion con resistencia de banda', variant:'S1-2: sin pierna elevada banda ligera · S3-4: pierna elevada banda media · S5-6: + pausa 1s arriba · S7+: banda fuerte + excentrico 3s' } },
  'S':  { grupo:'core', plano:'anti-lat+abd-cadera', equipo:'banda',
    n:'Plancha lateral con abduccion de cadera resistida con banda', d:'3x10-12 cada lado', note:'Plancha lateral sobre el antebrazo · Banda elastica anclada rodeando la pierna superior · Elevar la pierna (abduccion de cadera) contra la banda manteniendo la pelvis nivelada y el tronco estable · Anti-flexion lateral + gluteo medio · Cuello en linea con la columna (no dejar caer la cabeza ni girarla hacia el techo); puedes apoyar la cabeza sobre el brazo de abajo', wid:'plank-lateral-abduccion-banda',
    variant:'S1-2: plancha lateral con rodilla inferior apoyada, abduccion sin banda · S3-4: plancha completa, abduccion sin banda o banda ligera · S5-6: plancha completa banda media + pausa 1s arriba · S7+: banda fuerte + excentrico 3s' },
  'T':  { grupo:'core', plano:'anti-ext (marcha overhead)', equipo:'kettlebell/banda',
    n:'Marcha con carga overhead (KB) y banda en el pie', d:'3x8-10 cada lado', note:'De pie, KB sostenida overhead con el brazo extendido y bloqueado · Banda anclada baja rodeando el pie que marcha · Elevar la rodilla (marcha) controlada contra la banda sin perder la verticalidad de la KB · Doble reto: estabilidad overhead del hombro + anti-extension del core · Costillas abajo, NO arquear la lumbar para sostener el peso arriba · Cuello neutro y hombro activo, no encogerlo hacia la oreja', wid:'marcha-overhead-banda', gym:true,
    variant:'S1-2: sin KB, solo marcha con banda (patron y equilibrio) · S3-4: KB ligera 4-6 kg overhead estatica + marcha sin banda · S5-6: KB media + banda ligera + pausa 1s con la rodilla arriba · S7+: KB mas pesada + banda media controlada',
    homeAlt:{ n:'Marcha overhead con mancuerna y banda', d:'3x8-10 cada lado', note:'Sustituye la KB por una mancuerna ligera overhead · Misma marcha resistida con banda · Costillas abajo, lumbar neutra', variant:'S1-2: sin peso solo marcha con banda · S3-4: mancuerna ligera estatica + marcha · S5-6: mancuerna media + banda ligera · S7+: mancuerna media + banda media' } },
  'U':  { grupo:'core', plano:'anti-rot', equipo:'polea/banda',
    n:'Bird-dog resistido con polea o banda', d:'3x8-10 cada lado', note:'Cuadrupedia con una mano sujetando una banda/polea anclada al frente · Extender la pierna contraria hacia atras mientras se tracciona con el brazo, coordinando ambos · La resistencia frontal intenta rotar y flexionar el tronco: el trabajo es resistirla (anti-rotacion) · Pelvis nivelada, lumbar neutra, sin arquear al extender la pierna · Cuello largo, mirada al suelo', wid:'bird-dog-resistido',
    variant:'S1-2: bird-dog clasico sin resistencia (dominar el patron) · S3-4: solo traccion de brazo con banda ligera, pierna estatica · S5-6: brazo + pierna coordinados banda media + pausa 2s · S7+: banda/polea fuerte + excentrico lento' },
  'V':  { grupo:'core', plano:'rotacion-toracica+anti-rot', equipo:'banda',
    n:'Rotacion toracica controlada con banda (media sentadilla)', d:'3x10 cada lado', note:'De pie en media sentadilla, pies anchos, sujetando una banda anclada en alto al costado · Rotar de forma controlada hacia el lado de la banda llevando el giro al segmento TORACICO, no a la lumbar · La pelvis y la lumbar permanecen fijas y neutras — el movimiento es de la columna dorsal · Foco en control, sin tirones · Cuello acompana el giro de la columna alta, hombros lejos de las orejas', wid:'rotacion-toracica-banda',
    variant:'S1-2: anti-rotacion pura (Pallof) — resistir sin girar · S3-4: rotacion toracica de rango corto banda ligera · S5-6: rango medio banda media + pausa 1s · S7+: rango completo controlado banda media excentrico 3s' },
  'W':  { grupo:'core', plano:'anti-lat (dinamico)', equipo:'bw/banco',
    n:'Plancha lateral en banco con elevacion de cadera (hip dips)', d:'3x10-12 cada lado', note:'Plancha lateral con el antebrazo apoyado en un banco · Bajar y subir la cadera de forma controlada (hip dips) — version dinamica de la plancha lateral · Trabaja oblicuos y cuadrado lumbar (complejo lumbopelvico) · Recorrido comodo, sin dejar caer la cadera de golpe · Cuello en linea con la columna, sin dejar caer la cabeza ni girarla al techo', wid:'plank-lateral-banco-hip-dips',
    variant:'S1-2: plancha lateral isometrica en banco (sin dips) · S3-4: hip dips recorrido corto controlado · S5-6: recorrido completo + pausa 1s arriba · S7+: recorrido completo excentrico 3s o pies en el suelo (palanca larga)' },
  'X':  { grupo:'core', plano:'anti-rot', equipo:'banda/polea',
    n:'Pallof press en media rodilla', d:'3x10 cada lado', note:'Posicion de media rodilla (una rodilla en el suelo) · Banda/polea anclada lateralmente a la altura del pecho · Extender los brazos al frente (press) resistiendo el giro que impone la banda — anti-rotacion · La media rodilla anade reto de estabilidad de cadera y anti-extension · Pelvis neutra y gluteo de la pierna atrasada activo (sin arquear la lumbar) · Hombros y cuello relajados, sin encoger los trapecios', wid:'pallof-press-media-rodilla',
    variant:'S1-2: isometrico en el pecho banda ligera · S3-4: press completo banda media · S5-6: press + pausa 2s con los brazos extendidos · S7+: banda fuerte o rodilla sobre superficie inestable' },
  'Y':  { grupo:'core', plano:'anti-lat+escapular', equipo:'banda',
    n:'Remo en plancha lateral con banda', d:'3x10 cada lado', note:'Plancha lateral sobre el antebrazo · Con el brazo superior libre remar contra una banda anclada baja al frente · Combina estabilidad lateral del core (anti-flexion lateral) con control escapular del lado que rema · No dejar caer la cadera ni rotar el tronco al tirar · Cuello en linea con la columna', wid:'remo-plancha-lateral',
    variant:'S1-2: plancha lateral con rodilla apoyada + remo banda ligera · S3-4: plancha completa remo banda ligera · S5-6: plancha completa banda media + pausa 1s · S7+: banda fuerte + excentrico 3s' },
  'Z':  { grupo:'core', plano:'anti-rot', equipo:'mancuerna',
    n:'Renegade row en posicion de oso (bear)', d:'3x8 cada lado', note:'Posicion de oso: cuadrupedia con las rodillas despegadas 2-3 cm del suelo, espalda plana · Remar una mancuerna con un brazo mientras el otro sostiene el cuerpo · El reto es NO permitir que la pelvis ni el tronco roten — anti-rotacion intensa · Caderas niveladas, lumbar neutra · Cuello largo, mirada al suelo', wid:'renegade-row-oso', gym:true,
    variant:'S1-2: en cuadrupedia con rodillas apoyadas, remo ligero sin rotar · S3-4: posicion de oso (rodillas elevadas) remo ligero · S5-6: posicion de oso remo medio + pausa 1s · S7+: posicion de oso carga progresiva excentrico 3s',
    homeAlt:{ n:'Renegade row en oso con banda o botella', d:'3x8 cada lado', note:'Misma posicion de oso · Remo con banda anclada baja o peso casero · Anti-rotacion', variant:'S1-2: rodillas apoyadas banda ligera · S3-4: posicion de oso banda ligera · S5-6: banda media + pausa · S7+: banda fuerte' } },
  'A2': { grupo:'core', plano:'rotacion-diagonal+anti-rot', equipo:'banda/polea',
    n:'Woodchop con banda (anclaje alto)', d:'3x10 cada lado', note:'Pies anchos, banda/polea anclada en alto a un costado · Traccionar en diagonal de arriba hacia la cadera opuesta (chop descendente) · El movimiento de rotacion sale del TORACICO y de las caderas (pivote de pies), NO de la lumbar · Lumbar neutra y estable todo el recorrido · Control en el retorno, sin tirones · Hombros y cuello relajados acompanando el giro', wid:'woodchop-banda',
    variant:'S1-2: anti-rotacion pura (Pallof diagonal) sin girar · S3-4: chop de rango corto banda ligera, pivotando los pies · S5-6: rango completo banda media + control excentrico · S7+: banda fuerte rango completo con pivote de cadera coordinado' },
  'B2': { grupo:'core', plano:'anti-rot+ext-cadera', equipo:'banda',
    n:'Bird-dog con banda en el pie (cuadrupedia)', d:'3x8-10 cada lado', note:'Cuadrupedia con una banda elastica rodeando un pie y sujeta por la mano contraria (o anclada) · Extender simultaneamente el brazo y la pierna contrarios contra la resistencia de la banda · A diferencia del bird-dog resistido por el brazo, aqui la banda resiste la EXTENSION de la pierna (mas gluteo y cadena posterior) manteniendo la columna estable · Lumbar neutra, sin arquear · Pelvis nivelada · Cuello largo, mirada al suelo', wid:'bird-dog-banda-pie',
    variant:'S1-2: bird-dog sin banda dominando el patron · S3-4: banda ligera, recorrido parcial · S5-6: banda media recorrido completo + pausa 2s · S7+: banda fuerte + excentrico lento' },
};

// ─── HIP — Movilidad de cadera (grupo "pull de cadera") ────────────
const HIP = {
  'A': { grupo:'hip', plano:'movilidad', equipo:'bw',
    n:'Hip CARs', d:'2x5 cada lado', note:'Movilidad de cadera en todo el rango (circulos controlados) · Tronco estatico · Pelvis estable', wid:'hip-cars',
    variant:'S1-2: circulos pequenos con apoyo · S3-4: rango medio sin apoyo · S5-6: rango completo lento · S7+: rango completo + pausa en puntos finales' },
  'B': { grupo:'hip', plano:'movilidad-rotacion', equipo:'banda',
    n:'Rotacion de cadera int/ext con banda (tumbado)', d:'2x10 cada direccion/lado', note:'Tumbado en el suelo · Banda alrededor del pie · Mover la pierna en rotacion interna y externa de forma controlada · Movilidad de cadera sin carga axial', wid:'banded-hip-rotation',
    variant:'S1-2: banda ligera ROM parcial · S3-4: banda ligera ROM completo · S5-6: banda media pausa 1s en rotacion maxima · S7+: banda media + excentrico lento' },
  'C': { grupo:'hip', plano:'movilidad-aductor', equipo:'bw',
    n:'Side lunges (zancada lateral / cossack)', d:'2x8 cada lado', note:'Desplazamiento lateral de lado a lado en sentadilla profunda · Estira aductores · Mejora movilidad de cadera · Tronco lo mas erguido posible · Talon apoyado', wid:'cossack-shifts',
    variant:'S1-2: rango parcial con apoyo de manos · S3-4: rango medio sin apoyo · S5-6: sentadilla lateral profunda · S7+: profunda + pausa 2s + ligera carga goblet' },
  'D': { grupo:'hip', plano:'fuerza-flexor', equipo:'foam',
    n:'Elevaciones de pierna sentado sobre foam roller', d:'2x10 cada lado', note:'Sentado en el suelo, una pierna extendida sobre un foam roller · Elevar la pierna por encima del rodillo · Fuerza de flexores de cadera + flexibilidad activa · Tronco erguido', wid:'elevaciones-pierna-sentado',
    variant:'S1-2: elevacion minima sobre el rodillo · S3-4: elevacion completa controlada · S5-6: + pausa 2s arriba · S7+: + tobillera ligera' },
  'E': { grupo:'hip', plano:'fuerza-flexor', equipo:'silla',
    n:'Movilidad de cadera sentado en silla', d:'2x10 cada lado', note:'Sentado en una silla con una pierna extendida · Elevarla y bajarla controlado · Mejora el rango activo y la fuerza de cadera · Util en oficina/descansos (anti-sedestacion)' },
  'F': { grupo:'hip', plano:'flexibilidad-aductor', equipo:'bw',
    n:'Estiramiento de cadera en suelo (straddle / split modificado)', d:'2x40 seg', note:'Sentado en el suelo en straddle o split modificado · Elonga los aductores · Aumenta la flexibilidad progresivamente · No forzar, respiracion lenta',
    variant:'S1-2: straddle estrecho manos en suelo · S3-4: straddle medio inclinacion suave · S5-6: straddle amplio inclinacion adelante · S7+: split modificado progresivo' },
  'G': { grupo:'hip', plano:'movilidad-rotacion', equipo:'bw',
    n:'90/90 stretch activo', d:'2x40 seg cada lado', note:'Rotacion interna/externa de cadera · Pelvis neutra', wid:'90-90',
    variant:'S1-2: pasivo — solo mantener posicion con apoyo de manos · S3-4: activo — contraccion gluteo 5s · S5-6: activo con inclinacion de tronco · S7+: ambas posiciones encadenadas + rotacion activa' },
  'H': { grupo:'hip', plano:'flexibilidad-tfl', equipo:'bw',
    n:'TFL stretch — piramidal en suelo', d:'2x40 seg cada lado', note:'Estiramiento TFL + rotadores externos · L5-S1 izq primero', wid:'tfl-stretch',
    variant:'S1-2: figura 4 en suelo pasivo · S3-4: figura 4 activo con presion rodilla · S5-6: pigeon pose en suelo · S7+: pigeon pose con inclinacion tronco' },
  'I': { grupo:'hip', plano:'fuerza-flexor', equipo:'banco',
    n:'HF fall back (banco)', d:'3x8-10 cada lado', note:'Sentado en el borde del banco · Inclinacion hacia atras manteniendo pierna extendida elevada — sujeta con la mano · Flexores de cadera en rango elongado bajo tension · Lumbar neutra en todo momento · Variante 2: rodilla flexionada', wid:'hf-fall-back',
    variant:'S1-2: inclinacion minima (30°) pierna semiflexionada · S3-4: inclinacion 45° pierna extendida · S5-6: inclinacion 60° + pausa 2s · S7+: inclinacion maxima + variante rodilla flexionada' },
  'J': { grupo:'hip', plano:'fuerza-flexor', equipo:'kettlebell',
    n:'KB HF raise (plataforma)', d:'3x10 cada lado', note:'De pie sobre plataforma · KB colgada del pie (tobillera o lazo) · Elevar rodilla hasta la cadera — carga excentrica en descenso · Tronco erguido con apoyo · No balancear', wid:'kb-hf-raise',
    variant:'S1-2: sin KB solo elevacion controlada 3x12 · S3-4: KB 4-6 kg 3x10 · S5-6: KB 8 kg 3x8 + pausa 2s arriba · S7+: KB 12 kg 3x8 exc 3s' },
  'K': { grupo:'hip', plano:'fuerza-flexor', equipo:'banda',
    n:'Banded HF raise (tumbado + de pie)', d:'3x10 cada lado', note:'Dos posiciones: tumbado en banco con banda al pie (rodilla al pecho) · De pie con apoyo en banco, rodilla resistida por la banda · Tension constante durante todo el rango · No compensar con el tronco', wid:'banded-hf-raise',
    variant:'S1-2: tumbado banda ligera ROM parcial · S3-4: tumbado banda media ROM completo · S5-6: de pie banda media pausa 1s arriba · S7+: de pie banda fuerte + pausa 2s + excentrico 3s' },
  'L2': { grupo:'hip', plano:'fuerza-flexor', equipo:'barra+pelota',
    n:'Hanging ball raise (barra + pelota medicinal)', d:'3x8-10', note:'Colgado de barra de dominadas · Pelota medicinal sujeta entre los pies · Elevar ambas rodillas al pecho de forma controlada · Core activo todo el tiempo · No balancear el cuerpo', wid:'hanging-ball-raise',
    variant:'S1-2: sin pelota — elevacion de rodillas controlada · S3-4: pelota 2-3 kg 3x8 · S5-6: pelota 4-5 kg 3x8 + pausa 1s arriba · S7+: pelota 6-8 kg 3x8 excentrico lento' },
};

// ─── HINGE — bisagra de cadera / cadena posterior ──────────────────
const HINGE = {
  'A': { grupo:'hinge', n:'Good morning con banda elastica', d:'3x12', note:'Activacion bisagra · Calentamiento patron hinge antes de carga · Espalda neutra siempre', wid:'good-morning',
    variant:'S1-2: banda ligera 3x12 · S3-4: banda media 3x10 · S5-6: banda fuerte 3x10 · S7+: barra vacia 3x10 · F3: seated GM barra' },
  'B': { grupo:'hinge', n:'Hiperextension banco 45 grados', d:'4x10', note:'Motor principal bilateral — progresion por estadios · Variacion: unilateral (S5+, 3x8 c/lado)', wid:'hiperext', gym:true,
    variant:'S1-2: iso hold neutro 4x25s — rango parcial 4x20s · S3-4: rango completo sin peso exc 3s · S5-6: +20kg 4x8 exc 3s · S7+: +40kg 4x6-8 · F3: criterio 40kg 4x6 tecnica impecable',
    homeAlt:{ n:'Superman con cinta yoga', d:'4x12 — pausa 2 seg arriba', note:'Cinta yoga bajo el abdomen como fulcro · Extension cadera pura · Cabeza neutra · Sin hiperlordosis · Brazos: cuanto mas estirados al frente (protraccion) mas palanca y mas carga lumbar — progresa la posicion de brazos por estadio, no solo el peso', variant:'S1-2: brazos pegados al cuerpo, iso hold 4x20s sin elevacion de piernas · S3-4: manos en la nuca, extension completa sin peso exc 3s · S5-6: brazos extendidos al frente + tobillera ligera 1kg · S7+: brazos extendidos al frente + tobillera 2kg + pausa 3s' } },
  'C': { grupo:'hinge', n:'RDL con mancuernas', d:'3x8 — espalda neutra REQUISITO', note:'Columna neutra en todo el rango · Parar si irradiacion S1 · Variacion: RDL unilateral en banco (S3+, 3x8 c/lado exc 3s)', wid:'rdl-mancuernas', gym:true,
    variant:'S1-2: 8-10 kg — patron y activacion glutea · S3-4: 12-14 kg rango parcial hasta rodillas · S5-6: 16-18 kg rango completo · S7+: 20 kg+ tecnica impecable (criterio F3)',
    homeAlt:{ n:'RDL postural con banda yoga', d:'3x10 — foco en patron', note:'Cinta yoga anclada bajo los pies · Resistencia posterior leve · Espalda neutra requisito absoluto', variant:'S1-2: sin banda — patron puro bisagra · S3-4: banda yoga tension baja · S5-6: banda yoga tension media · S7+: banda yoga tension alta exc 3s' } },
  'D': { grupo:'hinge', n:'Cable pancake en suelo', d:'3x40 seg', note:'Cierre · Elongacion cadena posterior completa · No forzar el rango', wid:'cable-pancake',
    variant:'S1-2: apertura minima 30-40° tronco erguido · S3-4: apertura 45° inclinacion suave · S5-6: apertura 60° mayor inclinacion · S7+: apertura maxima comoda + inclinacion lateral izq para L5-S1' },
  'E': { grupo:'hinge', n:'Hinge (bisagra de cadera) — rango parcial', d:'3x8 — rango comodo sin tiron', note:'ADVERTENCIA CIATICA: es el movimiento donde mas se tensa el nervio ciatico · Si sientes tiron como banda elastica a punto de romperse NO fuerces · Rango parcial permite ganar fuerza · Para si irradiacion S1', wid:'rdl-mancuernas', gym:true,
    variant:'S1-2: good morning con banda — solo activacion sin carga · S3-4: RDL mancuernas livianas hasta rodillas · S5-6: RDL carga media rango comodo exc 3s · S7+: RDL rango completo si sin irradiacion · F3: RDL completo tecnica impecable',
    homeAlt:{ n:'Good morning con banda elastica', d:'3x12 — foco en patron', note:'Banda anclada bajo los pies · Bisagra de cadera pura · Espalda neutra requisito absoluto · Parar si tiron ciatico', variant:'S1-2: banda ligera rango parcial · S3-4: banda media bisagra completa · S5-6: banda fuerte exc 3s · S7+: carga progresiva' } },
  'F': { grupo:'hinge', n:'Bulgarian split squat', d:'3x8 cada lado — excentrico 3 seg', note:'Pie trasero en plataforma baja · Pie delantero sobre disco de peso · Descender la cadera verticalmente · Estira el flexor de cadera trasero + carga cuadriceps · Tronco erguido', wid:'bulgarian-split-squat', gym:true,
    variant:'S1-2: bw ROM parcial (60°) · S3-4: bw ROM completo · S5-6: mancuernas 6-8 kg · S7+: mancuernas 10-14 kg + pausa 2s abajo',
    homeAlt:{ n:'Split squat con pie trasero en silla', d:'3x8 cada lado', note:'Sustituye la plataforma baja por una silla · Mismo patron · Sin carga o con mancuernas ligeras', variant:'S1-2: bw ROM parcial · S3-4: bw ROM completo · S5-6: mancuernas 5-8 kg · S7+: mancuernas 10 kg pausa abajo' } },
  'G': { grupo:'hinge', n:'Long lunge (estocada profunda con carga)', d:'3x10 cada lado — posicion sostenida', note:'Estocada profunda con carga en las manos (mancuernas o barra con discos) · Mantener la posicion baja · Estira el flexor de cadera trasero · Activa el cuadriceps y gluteo delantero · Tronco erguido', wid:'long-lunge', gym:true,
    variant:'S1-2: bw sin carga posicion sostenida 3x20s · S3-4: mancuernas 4-6 kg 3x10 · S5-6: mancuernas 8-10 kg + pausa 3s abajo · S7+: mancuernas 12-14 kg o barra con discos 3x10',
    homeAlt:{ n:'Estocada estatica sostenida bw', d:'3x20 seg cada lado', note:'Misma posicion de estocada profunda · Sin carga · Foco en la tension del flexor de cadera trasero', variant:'S1-2: posicion semiflexionada 3x15s · S3-4: posicion completa 3x20s · S5-6: posicion profunda + respuracion lenta · S7+: + ligera carga goblet' } },
};

// ─── PULL — tiro (dorsal/espalda) sin carga axial ──────────────────
const PULL = {
  'A': { grupo:'pull', n:'Scapular pull en barra', d:'3x8-10', note:'Descompresion + activacion · Colgado · Solo depresion y retraccion escapular · Sin flexion de codo · Traccion descompresiva L4-S1 · PARAR si irradiacion S1 al colgar', wid:'scapular-pull',
    variant:'S1-2: banda de suspension — pie en banda carga parcial · S3-4: barra agarre ancho ROM completo sin flexion codo · S5-6: pausa 2s en retraccion maxima · S7+: lastre ligero tobillera 1-2 kg' },
  'B': { grupo:'pull', n:'Jalon al pecho agarre ancho', d:'4x10 — excentrico 3 seg', note:'Escapulas activas · Sin carga axial · No arquear la lumbar arriba del recorrido (brazos overhead) — costillas abajo', wid:'jalon-ancho', gym:true,
    variant:'S1-2: 50% exc 4s · S3-4: 60% exc 3s · S5-6: 70% pausa abajo · S7+: dominada asistida',
    homeAlt:{ n:'Remo invertido en mesa (Australian row)', d:'4x10 — excentrico 3 seg', note:'Tumbado bajo mesa · Agarre ancho · Escapulas activas · Sustituto directo del jalon', variant:'S1-2: rodillas muy flexionadas carga parcial · S3-4: rodillas a 90° exc 3s · S5-6: piernas extendidas · S7+: pies elevados en silla' } },
  'C': { grupo:'pull', n:'Remo en maquina sentado', d:'4x10 codos pegados', note:'No flexionar columna al tirar · Respaldo de pecho si la maquina lo tiene', wid:'remo-maquina', gym:true,
    variant:'S1-2: carga ligera pausa 1s escapulas · S3-4: carga media pausa 1s · S5-6: carga alta exc 3s · S7+: carga alta pausa + exc 4s',
    homeAlt:{ n:'Remo con banda anclada (sentado en suelo)', d:'4x10 codos pegados', note:'Banda anclada baja · Sentado en suelo · Tronco erguido · Sin carga axial', variant:'S1-2: banda ligera pausa 1s · S3-4: banda media pausa 1s · S5-6: banda fuerte exc 3s · S7+: banda fuerte pausa + exc 4s' } },
};

// ─── PUSH — empuje sin carga axial ─────────────────────────────────
const PUSH = {
  'A': { grupo:'push', n:'Aperturas en maquina pec deck', d:'3x12', note:'Empuje sin carga axial · Espalda fija en respaldo — sin separar de la maquina', wid:'pec-deck', gym:true,
    variant:'S1-2: carga ligera rango parcial · S3-4: carga media rango completo · S5-6: carga alta exc 3s · S7+: carga alta pausa 1s en contraccion',
    homeAlt:{ n:'Aperturas con banda cruzada', d:'3x12', note:'Banda anclada a ambos lados altura de pecho · Aduccion horizontal controlada', variant:'S1-2: banda ligera · S3-4: banda media · S5-6: banda fuerte exc 3s · S7+: banda fuerte pausa 1s' } },
  'B': { grupo:'push', n:'Fondos en maquina asistida (chest dip)', d:'3x12', note:'Empuje de pecho + triceps SIN carga axial · Maquina asistida (no colgarse del propio peso) · Codos a 90 max · Tronco ligeramente inclinado · Parar si molestia en hombro', wid:'fondos-triceps',
    variant:'S1-2: asistencia alta rango parcial · S3-4: asistencia media rango completo · S5-6: asistencia baja exc 3s · S7+: asistencia minima control · F3: lastre ligero' },
};

// ─── SHOULDER — hombro (sin overhead axial) ────────────────────────
const SHOULDER = {
  'A': { grupo:'shoulder', n:'Elevaciones laterales con mancuernas', d:'3x15 peso ligero', note:'Deltoides medio — sentado · Sin overhead (evita carga axial)', wid:'elevaciones-lat', gym:true,
    variant:'S1-2: sentado carga muy ligera · S3-4: sentado carga ligera exc 3s · S5-6: sentado carga media · S7+: de pie carga media + pausa 1s arriba',
    homeAlt:{ n:'Elevaciones laterales con banda', d:'3x15 — sentado', note:'Banda bajo los pies · Agarre neutro · Deltoides medio', variant:'S1-2: banda muy ligera · S3-4: banda ligera exc 3s · S5-6: banda media · S7+: banda media + pausa 1s' } },
  'B': { grupo:'shoulder', n:'Rear delt fly en maquina (pajaros inverso)', d:'3x15 lento', note:'Deltoides posterior · Codos ligeramente flexionados · Pausa 1s en apertura maxima · Sin balancear torso', wid:'rear-delt-fly', gym:true,
    variant:'S1-2: carga minima ROM parcial · S3-4: carga ligera ROM completo · S5-6: carga media exc 3s · S7+: carga media pausa 1s arriba',
    homeAlt:{ n:'Pajaros inverso con mancuernas', d:'3x15 torso inclinado', note:'Sentado · Torso inclinado 45° · Lumbar neutra · Codos ligeramente doblados', wid:'rear-delt-fly', variant:'S1-2: mancuernas muy ligeras ROM parcial · S3-4: mancuernas ligeras ROM completo · S5-6: mancuernas medias exc 3s · S7+: mancuernas medias pausa 1s arriba' } },
};

// ─── ARM — brazos ──────────────────────────────────────────────────
const ARM = {
  'A': { grupo:'arm', n:'Extension de triceps en polea alta', d:'4x15 codos fijos', note:'Cuerda — separar al final', wid:'triceps-polea', gym:true,
    variant:'S1-2: carga minima codos bien fijados · S3-4: carga media + separacion al final · S5-6: carga alta exc 3s · S7+: unilateral alternando',
    homeAlt:{ n:'Extension de triceps con banda sobre cabeza', d:'4x15 codos fijos', note:'Banda anclada alta o sostenida · Codos pegados', variant:'S1-2: banda ligera · S3-4: banda media exc 3s · S5-6: banda fuerte + separacion · S7+: unilateral banda fuerte' } },
  'B': { grupo:'arm', n:'Curl de biceps en barra Z', d:'3x12', note:'Codos fijos al torso', wid:'curl-barra', gym:true,
    variant:'S1-2: carga ligera rango completo · S3-4: carga media exc 3s · S5-6: carga alta pausa 1s arriba · S7+: carga alta exc 4s + pausa',
    homeAlt:{ n:'Curl de biceps con banda', d:'3x12 — codos fijos', note:'Banda bajo los pies · Codos pegados al torso', variant:'S1-2: banda ligera · S3-4: banda media exc 3s · S5-6: banda fuerte pausa 1s · S7+: unilateral banda fuerte exc 4s' } },
  'C': { grupo:'arm', n:'Curl martillo con mancuernas', d:'3x12', note:'Braquial + biceps', wid:'curl-martillo', gym:true,
    variant:'S1-2: carga ligera alternado · S3-4: carga media bilateral · S5-6: carga media exc 3s · S7+: carga alta unilateral con apoyo',
    homeAlt:{ n:'Curl martillo con banda (agarre neutro)', d:'3x12 — alternado', note:'Banda bajo los pies · Agarre neutro (pulgares arriba)', variant:'S1-2: banda ligera alternado · S3-4: banda media bilateral · S5-6: banda fuerte exc 3s · S7+: unilateral banda fuerte' } },
};

// ─── QUAD — cuadriceps / pierna (sin carga axial directa) ──────────
const QUAD = {
  'A': { grupo:'quad', n:'Leg Extension (extension de cuadriceps)', d:'3x12 — carga moderada', note:'Bajo impacto lumbar · CIATICA: si hay dolor no hagas dorsiflexion — apunta los dedos adelante · Si persiste: asiento atras + caderas adelante para crear holgura en el ciatico', wid:'leg-extension', gym:true,
    variant:'S1-2: carga muy ligera rango parcial · S3-4: carga ligera rango completo dedos neutros · S5-6: carga media exc 2s · S7+: carga media-alta pausa 1s',
    homeAlt:{ n:'Wall sit isometrico', d:'3x30-45 seg', note:'Espalda en la pared · Rodillas a 90° · Sin carga axial · Cuadriceps puro', variant:'S1-2: 100-110° 20s · S3-4: 90° 30s · S5-6: 90° 45s · S7+: unilateral 20s' } },
  'B': { grupo:'quad', n:'Leg Curl (curl femoral)', d:'3x12 — carga moderada', note:'No pone carga axial · Evitar redondear la espalda · CIATICA: si hay tiron apunta dedos adelante e inclina el torso atras al extender', wid:'leg-curl', gym:true,
    variant:'S1-2: carga muy ligera foco no redondear · S3-4: carga ligera torso neutro · S5-6: carga media exc 3s · S7+: carga alta pausa 1s',
    homeAlt:{ n:'Nordic curl excentric asistido', d:'3x6 — descenso 4 seg', note:'Pies sujetos bajo sofa o cama · Bajar lento · Volver con manos · Cadena posterior sin carga axial', variant:'S1-2: descenso hasta 45° · S3-4: descenso completo asistido · S5-6: descenso + pausa · S7+: intento de subida sin asistencia' } },
  'C': { grupo:'quad', n:'Prensa inclinada 45 grados', d:'4x10 — descenso 3 seg', note:'BUTTWINK: manos bajo la zona lumbar — si la espalda se redondea o el coxis se levanta has llegado al rango maximo · Coxis pegado al asiento siempre', wid:'prensa', gym:true,
    variant:'S1-2: carga ligera talones elevados · S3-4: carga media sin buttwink · S5-6: rango completo carga alta exc 3s · S7+: unilateral — un pie bloquea la rotacion pelvica',
    homeAlt:{ n:'Sentadilla sumo con banda (motor)', d:'4x15 — pausa 2 seg abajo', note:'Version principal en casa · Pies muy abiertos · Banda en muslos · Sin carga axial', variant:'S1-2: banda ligera ROM parcial · S3-4: banda media ROM completo · S5-6: banda fuerte pausa 2s · S7+: mancuerna goblet' } },
  'D': { grupo:'quad', n:'Sumo squat con peso (KB o mancuerna)', d:'3x10 — profundidad comoda', note:'Sustituye a sentadilla con barra · Peso entre las piernas (goblet) · Pies anchos dedos afuera — fuerza la verticalidad del torso · Espalda neutra', wid:'sumo-squat-kb', gym:true,
    variant:'S1-2: peso corporal ROM parcial · S3-4: KB 8-12kg ROM completo · S5-6: KB 16-20kg profundidad maxima · S7+: KB 24kg+ pausa 2s',
    homeAlt:{ n:'Sentadilla sumo con banda', d:'3x15', note:'Pies muy abiertos · Puntas afuera 45° · Gluteo medio e interno · Sin carga axial', variant:'S1-2: banda ligera ROM parcial · S3-4: banda media ROM completo · S5-6: banda fuerte · S7+: mancuerna goblet' } },
  'E': { grupo:'quad', n:'Split squat — sentadilla a una pierna', d:'3x10 cada lado — muy lento', note:'Unilateral bajo impacto lumbar · NIVEL AVANZADO (anti-rotacion): peso en un solo brazo opuesto a la pierna adelantada — obliga al QL y estabilizadores · Lento = dificil · Pausas isometricas abajo', wid:'bulgara',
    variant:'S1-2: peso corporal ROM parcial — ambos brazos a los lados · S3-4: peso corporal ROM completo pausa 2s · S5-6: mancuerna ligera ambas manos · S7+: mancuerna un solo brazo (anti-rotacion QL) · F3: pie trasero en banco con carga anti-rotacion' },
  'F': { grupo:'quad', n:'Step up al banco', d:'3x10 cada lado', note:'Banco a altura de rodilla · Subir con talon completo · Bajar controlado 3 seg · Sin impacto lumbar', wid:'step-up',
    variant:'S1-2: escalon bajo 20cm · S3-4: banco 35-40cm · S5-6: banco + pausa arriba 2s · S7+: mancuernas ligeras' },
  'G': { grupo:'quad', n:'Wall sit isometrico', d:'3x30-45 seg', note:'Espalda pegada a la pared · Rodillas 90° · Sin carga axial · Cuadriceps', wid:'wall-sit',
    variant:'S1-2: 100-110° 20s · S3-4: 90° 30s · S5-6: 90° 45s · S7+: unilateral 20s' },
  'H': { grupo:'quad', n:'Sentadilla goblet ligera con pausa', d:'3x10 — pausa 2 seg abajo', note:'Patron de sentadilla SIN fatiga · KB/mancuerna ligera entre las piernas · Tronco vertical · Espalda neutra · Movilidad y control', wid:'goblet-squat',
    variant:'S1-2: peso corporal · S3-4: KB 8kg · S5-6: KB 12kg · S7+: KB 16kg pausa 3s' },
  'I': { grupo:'quad', n:'Sentadilla goblet con cunas en los talones', d:'3x10 — pausa 2 seg abajo', note:'Goblet (KB/mancuerna frente al pecho) con cunas o discos bajo los talones · La elevacion del talon permite mas profundidad y mantiene el tronco mas vertical (menos inclinacion = menos palanca lumbar) · Espalda neutra · Limitar la profundidad al rango sin buttwink (sin retroversion pelvica)', wid:'goblet-squat-cunas', gym:true,
    variant:'S1-2: peso corporal con cunas ROM parcial · S3-4: KB 8-10 kg · S5-6: KB 12-16 kg pausa 2s · S7+: KB 20 kg+ pausa 3s',
    homeAlt:{ n:'Sentadilla goblet con talones en cuna (mancuerna o sin peso)', d:'3x12 — pausa 2 seg abajo', note:'Cunas improvisadas (libro fino o tablon) bajo los talones · Mancuerna ligera o peso corporal · Tronco vertical', variant:'S1-2: peso corporal · S3-4: mancuerna ligera · S5-6: mancuerna media pausa 2s · S7+: mancuerna media pausa 3s' } },
};

// ─── GLUTE — gluteo / hip (cadena posterior sin carga axial) ───────
const GLUTE = {
  'A': { grupo:'glute', n:'Hip thrust en banco', d:'3x12', note:'Motor gluteo · Objetivo de progresion', wid:'hip-thrust',
    variant:'S1-2: glute bridge bilateral isometrico 5s · S3-4: hip thrust bilateral PC pausa 2s · S5-6: hip thrust unilateral PC · S7+: hip thrust bilateral con barra' },
  'B': { grupo:'glute', n:'Glute bridge unilateral', d:'3x12 cada lado — pausa 2 seg', note:'Una pierna en el aire · Pelvis nivelada', wid:'glute-bridge-uni',
    variant:'S1-2: bilateral como base · S3-4: unilateral pierna libre flexionada · S5-6: unilateral pierna libre extendida · S7+: mancuerna en cadera de trabajo' },
  'C': { grupo:'glute', n:'Clamshell con banda elastica', d:'3x15 cada lado', note:'Gluteo medio · Pelvis estable · Rotadores externos', wid:'clamshell',
    variant:'S1-2: sin banda · S3-4: banda ligera · S5-6: banda media · S7+: banda fuerte + pausa 2s arriba' },
  'D': { grupo:'glute', n:'Monster walk lateral con banda', d:'3x15m', note:'Gluteo medio · Cadera neutral', wid:'monster-walk',
    variant:'S1-2: banda en muslos ritmo lento · S3-4: banda en muslos 15m · S5-6: 15m + pausa isometrica cada 5 pasos · S7+: banda en tobillos si sin irradiacion' },
  'E': { grupo:'glute', n:'Abduccion en maquina', d:'3x15', note:'Gluteo medio — sentado', wid:'abduccion-maq', gym:true,
    variant:'S1-2: sin carga — solo ROM · S3-4: carga ligera · S5-6: carga media pausa 1s · S7+: carga alta exc 3s',
    homeAlt:{ n:'Side-lying abduccion con banda', d:'3x15 cada lado', note:'Banda en tobillos · Tumbado de lado · Misma activacion que maquina', variant:'S1-2: sin banda · S3-4: banda ligera · S5-6: banda media · S7+: banda fuerte pausa 1s arriba' } },
  'F': { grupo:'glute', n:'Single leg reverse hyper', d:'3x12 cada lado', note:'Tumbado boca abajo en banco · Extension cadera pura sin carga axial · Parar si irradiacion S1', wid:'single-leg-hyper',
    variant:'S1-2: sin peso ROM parcial 3x8 · S3-4: sin peso ROM completo 3x10 · S5-6: tobillera ligera 1-2 kg · S7+: tobillera 3-4 kg exc 2s' },
  'G': { grupo:'glute', n:'Cable pull-through en polea baja', d:'3x12', note:'Bisagra de cadera de pie · Cuerda entre piernas · Espalda neutra · Carga posterior (no axial)', wid:'cable-pull-through',
    variant:'S1-2: carga muy ligera ROM parcial 30° · S3-4: carga ligera ROM completo · S5-6: carga media exc 3s · S7+: carga alta pausa 1s · F3: progresar a RDL barra' },
};

// ─── CARD — cardio de sala ─────────────────────────────────────────
const CARD = {
  'A': { grupo:'cardio', n:'Ergometro de remo', d:'2000m — FC 110-125', note:'Drive con piernas primero · Espalda neutra · Damper 3-4 · Anotar parcial 500m y media', wid:'ergometro', gym:true,
    homeAlt:{ n:'Caminata activa o marcha', d:'20-25 min — ritmo moderado', note:'Alternativa cardio en casa · Paso largo · Tronco erguido · Sin impacto' } },
  'B': { grupo:'cardio', n:'Bici estatica (spinning)', d:'15-20 min — FC 110-120 — sin standing', note:'Sin standing en F2 · Cadencia 70-85 rpm', wid:'bici-estatica', gym:true,
    homeAlt:{ n:'Marcha activa o step en sitio', d:'20 min — ritmo moderado', note:'Step elevando rodillas · O marcha exterior' } },
  'C': { grupo:'cardio', n:'Eliptica', d:'15-20 min — FC 110-125 — resistencia 3-5', note:'Sin impacto · Postura erguida', wid:'eliptica', gym:true,
    homeAlt:{ n:'Marcha activa o step en sitio', d:'20 min — ritmo moderado', note:'Step elevando rodillas · O marcha en exterior' } },
  'D': { grupo:'cardio', n:'Eliptica — cierre largo', d:'60 min — FC 110-125 — resistencia 3-5', note:'Sesion de cierre · Ritmo aerobico constante · Sin standing · Postura erguida · Anotar FC media y distancia', wid:'eliptica', gym:true,
    homeAlt:{ n:'Caminata exterior larga', d:'55-60 min — ritmo moderado', note:'Alternativa en casa · Paso largo activo · FC max 125' } },
};

// ─── NECK — Cuello / cervical (prevencion hernia cervical + base para core) ──
// Misma filosofia que el resto del plan: control NEUTRO y anti-movimiento
// isometrico ANTES de cargar. La debilidad de los flexores profundos del cuello
// (longus colli/capitis) provoca el chin-poke (cabeza adelantada) que cizalla
// C5-C6/C6-C7 — el mismo fallo que aparece en plancha, hollow y L-sit cuando
// se intensifica el core. Entrenarlos es el requisito para subir intensidad.
const NECK = {
  'A': { grupo:'cuello', plano:'flexor-profundo', equipo:'bw',
    n:'Chin tuck supino (flexion craneocervical)', d:'3x10 — hold 5 seg', wid:'chin-tuck',
    note:'Boca arriba, rodillas dobladas · Desliza el menton hacia el cuello (doble menton) alargando la nuca SIN levantar la cabeza · Activa los flexores profundos (longus colli), no el esternocleidomastoideo · Es el cimiento: el mismo control que evita el chin-poke en plancha y hollow',
    variant:'S1-2: retraccion suave sin elevar 3x8 · S3-4: retraccion + hold 5 seg 3x10 · S5-6: retraccion + cabeza despegada 2 cm 3x10 · S7+: retraccion + sostener cabeza despegada 10 seg 3x8' },
  'B': { grupo:'cuello', plano:'flexor-profundo-postural', equipo:'pared',
    n:'Chin tuck de pie contra pared (postural)', d:'3x8 — hold 5 seg', wid:'chin-tuck-pared',
    note:'De pie, occipucio y espalda alta contra la pared · Haz doble menton llevando la nuca hacia la pared sin extender · Reentrena la cabeza adelantada del trabajo de escritorio · Hombros bajos y relajados',
    variant:'S1-2: contra pared con feedback 3x6 · S3-4: contra pared hold 5 seg 3x8 · S5-6: de pie sin pared 3x8 · S7+: sentado en silla cada hora (micro-pausas antisedentarismo)' },
  'C': { grupo:'cuello', plano:'flexor-profundo-endurance', equipo:'bw',
    n:'Elevacion de cabeza con doble menton (endurance flexor profundo)', d:'3x8-10', wid:'head-lift',
    note:'Supino · Primero haz el chin tuck y MANTENLO, luego despega la cabeza 2-3 cm · El menton no debe adelantarse (si se adelanta manda el ECM, no los flexores profundos) · Baja lento · Endurance del estabilizador craneocervical que sostiene la cabeza en el core',
    variant:'S1-2: no introducir — dominar el chin tuck antes · S3-4: despegue minimo 3x6 · S5-6: despegue 3 cm + 2 seg 3x8 · S7+: despegue + sostener 10 seg 3x8' },
  'D': { grupo:'cuello', plano:'anti-movimiento', equipo:'bw',
    n:'Isometricos cervicales multidireccionales (auto-resistidos)', d:'3x6 seg cada direccion', wid:'iso-cervical',
    note:'Cabeza neutra con doble menton suave · Aplica resistencia con tu propia mano contra frente, nuca y cada lateral · EMPUJA sin que la cabeza se mueva (isometrico puro, anti-movimiento) · 6 seg por direccion al 30-50% · Es el equivalente cervical del Pallof anti-rotacion del core',
    variant:'S1-2: 20% intensidad solo frontal y laterales 3x5s · S3-4: 30% las 4 direcciones 3x6s · S5-6: 50% las 4 direcciones 3x6s · S7+: 50% + diagonales 3x6s' },
  'E': { grupo:'cuello', plano:'movilidad', equipo:'bw',
    n:'Neck CARs — movilidad cervical controlada', d:'2x3 cada direccion', wid:'neck-cars',
    note:'Circulos cervicales LENTOS y controlados en rango sin dolor · Tronco y hombros quietos · NUNCA forzar el final ni dejar caer la cabeza atras en extension-rotacion (cierra el foramen cervical) · Movilidad articular activa — los Hip CARs del cuello',
    variant:'S1-2: flexion/extension y rotaciones por separado, rango corto · S3-4: medio circulo inferior (sin extension) 2x3 · S5-6: circulo completo lento controlado 2x3 · S7+: circulo completo + pausa en cada punto' },
  'F': { grupo:'cuello', plano:'extensor-profundo', equipo:'bw/banco',
    n:'Extension cervical prona con retraccion escapular', d:'3x8 — hold 3 seg', wid:'prone-neck-ext',
    note:'Boca abajo (cabeza fuera del borde del banco o frente al suelo) · Doble menton y eleva la cabeza solo hasta la linea del cuerpo — NO hiperextender — mientras juntas las escapulas · Fortalece extensores profundos y trapecio inferior · Equilibra el ratio flexor/extensor cervical',
    variant:'S1-2: solo retraccion escapular sin elevar la cabeza 3x10 · S3-4: elevar la cabeza hasta neutro 3x8 · S5-6: neutro + 3 seg hold 3x8 · S7+: + ligera resistencia (toalla en la nuca) 3x8' },
  'G': { grupo:'cuello', plano:'flexibilidad-postural', equipo:'bw',
    n:'Estiramiento trapecio superior y elevador de la escapula', d:'2x30 seg cada lado', wid:'upper-trap-stretch',
    note:'Sentado, una mano sujeta el asiento (hombro abajo) · Con la otra mano lleva suavemente la cabeza hacia el lado opuesto (trapecio) y luego mirando a la axila (elevador) · Estiramiento suave sin tiron · Libera la tension postural de las pantallas',
    variant:'S1-2: solo trapecio superior 2x20s · S3-4: trapecio + elevador 2x30s · S5-6: + ligera presion de la mano · S7+: + respiracion prolongada 40s en cada posicion' },
  'H': { grupo:'cuello', plano:'anti-movimiento-resistido', equipo:'banda',
    n:'Isometrico cervical con banda elastica', d:'3x10 seg cada direccion', wid:'iso-cervical-banda',
    note:'Banda anclada a la altura de la cabeza (o pasada por frente/nuca) · Resiste la traccion manteniendo la cabeza inmovil con doble menton · Progresion del isometrico auto-resistido con carga graduable y constante · Cuello neutro, sin dejar que la banda te lleve al end-range',
    variant:'S1-2: no introducir — usar el auto-resistido antes · S3-4: banda ligera frontal y posterior 3x8s · S5-6: banda ligera 4 direcciones 3x10s · S7+: banda media 4 direcciones 3x10s' },
};

// Lookup combinado con IDs GLOBALES prefijados por grupo (CORE-A, HIP-B, QUAD-C, ...)
const CAT = {};
for (const [pfx, grp] of [['CORE',CORE],['HIP',HIP],['HINGE',HINGE],['PULL',PULL],['PUSH',PUSH],['SHOULDER',SHOULDER],['ARM',ARM],['QUAD',QUAD],['GLUTE',GLUTE],['CARD',CARD],['NECK',NECK]])
  for (const k in grp) CAT[pfx + '-' + k] = grp[k];

// (CAT ya construido arriba con los 10 grupos)

// Resolver: expande bloques con exIds (catalogo) o los pasa tal cual si ya tienen exs
function expandBlock(b){
  if (b.exIds) return { id:b.id, name:b.name, dur:b.dur, color:b.color,
    exs:[ ...b.exIds.map(id => CAT[id]).filter(Boolean), ...(b.exs || []) ] };
  return b;
}
function buildSessions(week){
  const out = {};
  for (const k in week) out[k] = Object.assign({}, week[k], { blocks: week[k].blocks.map(expandBlock) });
  return out;
}

// Bloque de movilidad de cadera para la pestana Movilidad (disponible toda la semana)
const MOB_BLOCK_HIP = expandBlock({ id:'MOB-H', name:'Movilidad de cadera — grupo HIP', dur:'15-20 min', color:'#7A3DAA',
  exIds:['HIP-A','HIP-B','HIP-C','HIP-D','HIP-E','HIP-F','HIP-G','HIP-H','HIP-I','HIP-J','HIP-K','HIP-L2'] });

// Rutina de cuello para la pestana Movilidad (prevencion cervical, diaria)
const MOB_BLOCK_NECK = expandBlock({ id:'MOB-N', name:'Cuello — prevencion cervical', dur:'8-10 min', color:'#1B8A9C',
  exIds:['NECK-A','NECK-B','NECK-C','NECK-D','NECK-E','NECK-F','NECK-G','NECK-H'] });

const WEEK = {

  // ─── 1 — LUNES: Cadena posterior + Core + Biceps ──────────────
  1: {
    name: 'Lunes', tag: 'Posterior + Core + Biceps', neural: false,
    dur: '160 min', loc: 'Gym', homeLoc: 'Casa',
    keyExs: 'Hiperext bilateral · Hiperext unilateral · RDL bilateral · RDL unilateral banco',
    cardio: 'Ergometro 2000m (apertura) · Eliptica 60 min (cierre)',
    blocks: [
      MOB_BLOCK_A1,
      MOB_BLOCK_B_LUN,
      { id: 'C', name: 'Cardio apertura — Ergometro 2000m', dur: '15-20 min', color: '#185FA5', exIds: ['CARD-A'] },
      { id: 'D', name: 'Lumbar — Cadena posterior', dur: '45 min', color: '#3C3489', exIds: ['HINGE-A','HINGE-B','HINGE-C','HINGE-D'] },
      { id: 'E', name: 'Cuello (prep cervical) + Core REPETICIONES (control dinamico) + Biceps', dur: '38 min', color: '#993C1D', exIds: ['NECK-A','NECK-D','CORE-A','CORE-B','CORE-M','CORE-N','GLUTE-F','CORE-G2','ARM-B','ARM-C'] },
      { id: 'F', name: 'Cardio cierre — Eliptica 60 min', dur: '60 min', color: '#185FA5', exIds: ['CARD-D'] },
    ]
  },

  // ─── 2 — MARTES: Piscina ligera + estabilidad ─────────────────
  2: {
    name: 'Martes', tag: 'Piscina ligera + estabilidad', neural: false,
    dur: '75 min', loc: 'Gym ligero + Piscina', homeLoc: 'Casa',
    keyExs: 'Glute bridge · Hip thrust ligero · Sentadilla goblet ligera · Nado suave',
    cardio: 'Aquajogging suave en piscina',
    pool: 'Estabilidad + gluteo + sentadilla ligera (tierra) · Nado suave adaptable (espalda+crol+braza)',
    blocks: [
      MOB_BLOCK_A1,
      { id: 'D', name: 'Estabilidad + pierna ligera', dur: '25-30 min', color: '#0F6E56', exIds: ['HIP-A','HIP-G','HIP-I','HIP-K','GLUTE-B','GLUTE-A','GLUTE-C','GLUTE-D','QUAD-H','QUAD-G'] },
      { id: 'E', name: 'Cuello (prep cervical) + Core ISOMETRICO (anti-movimiento + bracing pre-piscina)', dur: '18-22 min', color: '#993C1D', exIds: ['NECK-A','NECK-D','CORE-E','CORE-D','CORE-P','CORE-F','CORE-I'] },
      POOL_UNIFICADA,
    ]
  },

  // ─── 4 — JUEVES: Pecho + Tiro horizontal + Core ────────────────
  4: {
    name: 'Jueves', tag: 'Empuje + Tiro', neural: false,
    dur: '160 min', loc: 'Gym', homeLoc: 'Casa',
    keyExs: 'Scapular pull (descompresion) · Jalon ancho · Remo maquina · Pec deck · Fondos asistidos',
    cardio: 'Ergometro 2000m (apertura) · Eliptica 60 min (cierre)',
    blocks: [
      MOB_BLOCK_A1,
      MOB_BLOCK_B_JUE,
      { id: 'C', name: 'Cardio apertura — Ergometro 2000m', dur: '15-20 min', color: '#185FA5', exIds: ['CARD-A'] },
      { id: 'D', name: 'Empuje + Tiro (sin carga axial)', dur: '50 min', color: '#3C3489', exIds: ['PULL-A','PULL-B','PULL-C','PUSH-A','PUSH-B','SHOULDER-A','ARM-A'] },
      {
        id: 'E', name: 'Cuello (prep cervical) + Core REPETICIONES (anti-rotacion dinamica + flexor cadera) + Neural', dur: '28 min', color: '#993C1D',
        exIds: ['NECK-A','NECK-D','CORE-G','CORE-J','CORE-O','GLUTE-F','CORE-A'],
        exs: [
          { n: 'Neural flossing nervio ciatico', d: '2x10 cada lado', note: 'Sin dolor · Deslizamiento puro', wid: 'neural-flossing', variant: 'S1-2: angulo 30-40° muy suave · S3-4: angulo 60° ritmo lento · S5-6: angulo 80° · S7+: angulo completo + dorsiflexion' },
        ]
      },
      { id: 'F', name: 'Cardio cierre — Eliptica 60 min', dur: '60 min', color: '#185FA5', exIds: ['CARD-D'] },
    ]
  },

  // ─── 5 — VIERNES: Piscina ligera + estabilidad ────────────────
  5: {
    name: 'Viernes', tag: 'Piscina ligera + estabilidad', neural: false,
    dur: '75 min', loc: 'Gym ligero + Piscina', homeLoc: 'Casa',
    keyExs: 'Glute bridge · Hip thrust ligero · Sentadilla goblet ligera · Nado suave',
    cardio: 'Aquajogging suave en piscina',
    pool: 'Estabilidad + gluteo + sentadilla ligera (tierra) · Nado suave adaptable (espalda+crol+braza)',
    blocks: [
      MOB_BLOCK_A1,
      { id: 'D', name: 'Estabilidad + pierna ligera', dur: '25-30 min', color: '#0F6E56', exIds: ['HIP-A','HIP-G','HIP-I','HIP-K','GLUTE-B','GLUTE-A','GLUTE-C','GLUTE-D','QUAD-H','QUAD-G'] },
      { id: 'E', name: 'Cuello (prep cervical) + Core ISOMETRICO (anti-movimiento + bracing pre-piscina)', dur: '18-22 min', color: '#993C1D', exIds: ['NECK-A','NECK-D','CORE-C','CORE-H','CORE-Q','CORE-K','CORE-I'] },
      POOL_UNIFICADA,
    ]
  },

  // ─── 0 — DOMINGO: Recuperacion activa (casa) ──────────────────
  0: {
    name: 'Domingo', tag: 'Recuperacion activa — casa', neural: false,
    dur: '90 min', loc: 'Casa / Exterior',
    blocks: [
      MOB_BLOCK_A1,
      {
        id: 'D', name: 'Recuperacion activa', dur: '45 min', color: '#444441',
        exs: [
          { n: 'Caminata exterior', d: '30-40 min — ritmo suave', note: 'Terreno llano · Paso largo · Brazos activos · FC max 110 · Si llueve: marcha activa en casa', wid: 'caminata' },
          { n: 'Dead hang en barra', d: '4x35 seg', note: 'Traccion descompresiva + fuerza de agarre', wid: 'dead-hang', variant: 'S1-2: 4x20s · S3-4: 4x25s · S5-6: 4x35s · S7+: 4x45s · F3: hollow body hang 3x10-15s' },
          { n: 'Fondos de triceps en banco', d: '3x12', note: 'Version progresiva con piernas avanzadas (Domingo) · Solo sin irradiacion', wid: 'fondos-triceps', variant: 'S1-2: rodillas muy flexionadas · S3-4: piernas a 90° · S5-6: piernas extendidas · S7+: piernas elevadas en banco · F3: entre paralelas' },
          { n: 'Goblet squat — movilidad', d: '3x10 con pausa 3s abajo', note: 'Solo con mancuerna ligera · Movilidad + patron squat', wid: 'goblet-squat', variant: 'S1-2: peso corporal · S3-4: KB 8kg · S5-6: KB 12kg · S7+: KB 16kg' },
          { n: 'Plancha con extension de cadera activa', d: '2x8 cada lado', note: 'Desde plancha sobre codos · Elevar pierna extendida hasta la cadera · Gluteo activo · Lumbar neutra — no arquear al subir · Version suave de recuperacion', wid: 'plank-hip-extension', variant: 'S1-2: desde rodillas 2x6 · S3-4: plancha completa elevacion parcial · S5-6: elevacion hasta horizontal · S7+: tobillera ligera' },
        ]
      },
      {
        id: 'E', name: 'Vuelta a la calma', dur: '30 min', color: '#444441',
        exs: [
          { n: 'Pigeon pose en banco', d: '2x60 seg cada lado', note: 'Cierre piriforme · Sin prisa', wid: 'pigeon-pose' },
          { n: 'Child pose con soporte', d: '3 min', note: 'Flexion lumbar pasiva · Apertura toracica', wid: 'child-pose' },
          { n: 'Legs up the wall (Viparita)', d: '5 min', note: 'Descarga venosa · Parasimpatico', wid: 'viparita' },
          { n: 'Neural flossing nervio ciatico', d: '2x6 cada lado', note: 'Muy suave · Solo sin irradiacion', wid: 'neural-flossing' },
          { n: 'Respiracion diafragmatica profunda', d: '5 min', note: 'Cierre total · 4-7-8 o respiracion de caja', wid: 'respiracion-diafragmatica' },
          { n: 'Sauna o bano caliente', d: '10-15 min si disponible', note: 'Vasodilatacion + relajacion muscular profunda · Temperatura 38-40°C · No superar 42°C', wid: 'sauna' },
        ]
      },
    ]
  },

  // ─── 3 — MIERCOLES: Neural ─────────────────────────────────────
  3: {
    name: 'Miercoles', tag: 'Descanso neural', neural: true,
    dur: '90 min', loc: 'Casa / Exterior',
    blocks: [
      MOB_BLOCK_A1_NEURAL,
      MOB_BLOCK_B_MIE,
      {
        id: 'D', name: 'Funcional bodyweight + banda elastica', dur: '30 min', color: '#3C3489',
        exs: [
          { n: 'Dead bug con extension completa', d: '2x8 cada lado', note: 'Version suave · Lumbar pegada al suelo', wid: 'dead-bug', variant: 'S1-2: un miembro solo · S3-4: contralateral completo · S5-6: press palma rodilla' },
          { n: 'Bird dog con pausa', d: '2x8 cada lado — pausa 3 seg', note: 'Control pelvico · Version corta', wid: 'bird-dog' },
          { n: 'Glute bridge unilateral', d: '2x10 cada lado — pausa 2 seg', note: 'Sin carga axial · Pelvis nivelada', wid: 'glute-bridge-uni', variant: 'S1-2: bilateral como base · S3-4: unilateral pierna libre flexionada · S5-6: unilateral pierna libre extendida · S7+: mancuerna en cadera' },
          { n: 'Superman hold en suelo', d: '2x8 — pausa 2 seg', note: 'Erectores en elongacion · Version suave · Brazos pegados al cuerpo o manos en la nuca (NO extendidos al frente) para no sumar palanca lumbar · Cabeza neutra · No arquear de mas', wid: 'superman' },
          { n: 'Single leg reverse hyper', d: '3x12 cada lado', note: 'Tumbado boca abajo en banco · Extension cadera pura sin carga axial · Parar si irradiacion S1', wid: 'single-leg-hyper', variant: 'S1-2: sin peso — ROM parcial 3x8 · S3-4: sin peso ROM completo 3x10 · S5-6: tobillera ligera 1-2 kg 3x12 · S7+: tobillera 3-4 kg 3x12 exc 2s' },
          { n: 'Iso hold cinta yoga puerta', d: '3x20 seg', note: 'Cinta colgada del marco · Tension isometrica posterior · Sin carga axial', wid: 'iso-hold-cinta', variant: 'S1-2: tension minima 10 seg · S3-4: 15 seg moderado · S5-6: 20 seg · S7+: 25 seg una mano' },
          { n: 'Hamstring squeeze', d: '2x8 cada lado', note: 'Isometrico suave · Angulo bajo', wid: 'hamstring-squeeze' },
          { n: 'L-sit progresion', d: '3x series segun nivel', note: 'Sin carga axial · Core + flexores cadera', wid: 'l-sit', variant: 'S1-2: tucked L-sit en sillas 3x5 seg · S3-4: tucked L-sit 3x8 seg · S5-6: un pie extendido 3x8 seg · S7+: L-sit completo 3x10 seg · F3: L-sit en paralelas o anillas' },
          { n: 'HF fall back (banco)', d: '2x8 cada lado', note: 'Sentado en el borde del banco · Inclinacion suave hacia atras · Pierna extendida sujeta con la mano · Flexor de cadera en rango elongado · Lumbar neutra', wid: 'hf-fall-back', variant: 'S1-2: inclinacion 20-30° pierna semiflexionada · S3-4: 45° pierna extendida · S5-6: 60° + pausa 2s · S7+: variante rodilla flexionada encadenada' },
          { n: 'Banded HF raise (tumbado)', d: '2x10 cada lado', note: 'Tumbado en banco · Banda ligera al pie · Rodilla al pecho de forma controlada · Version neural — sin carga alta', wid: 'banded-hf-raise', variant: 'S1-2: banda ligera ROM parcial · S3-4: banda media ROM completo · S5-6: + pausa 1s arriba · S7+: de pie version resistida' },
        ]
      },
      {
        id: 'E', name: 'Vuelta a la calma — Estiramientos + Neural', dur: '20 min', color: '#444441',
        exs: [
          { n: 'Pigeon pose en banco', d: '2x60 seg cada lado', note: 'Cierre piriforme · Sin prisa', wid: 'pigeon-pose' },
          { n: '90/90 stretch activo', d: '2x45 seg cada lado', note: 'Rotacion interna final', wid: '90-90', variant: 'S1-2: pasivo con apoyo de manos · S3-4: activo contraccion gluteo 5s · S5-6: activo con inclinacion tronco · S7+: ambas posiciones encadenadas' },
          { n: 'Legs up the wall (Viparita)', d: '5 min', note: 'Descarga venosa · Parasimpatico', wid: 'viparita' },
          { n: 'Neural flossing nervio ciatico', d: '2x6 cada lado', note: 'Muy suave · Solo sin irradiacion', wid: 'neural-flossing', variant: 'S1-2: angulo 30-40° · S3-4: angulo 60° · S5-6: angulo 80° · S7+: angulo completo + dorsiflexion' },
          { n: 'Respiracion diafragmatica profunda', d: '5 min', note: 'Cierre total del dia · 4-7-8 o caja', wid: 'respiracion-diafragmatica' },
          { n: 'Sauna o bano caliente', d: '10-15 min si disponible', note: 'Vasodilatacion + relajacion muscular profunda · Temperatura 38-40°C · No superar 42°C', wid: 'sauna' },
        ]
      },
    ]
  },

  // ─── 6 — SABADO: Pierna + Gluteo ──────────────────────────────
  6: {
    name: 'Sabado', tag: 'Pierna + Gluteo', neural: false,
    dur: '120 min', loc: 'Gym', homeLoc: 'Casa',
    keyExs: 'Leg Extension · Leg Curl · Prensa 45° · Sumo squat KB · Split squat anti-rotacion · Hinge rango parcial',
    cardio: 'Eliptica — 15-20 min FC 110-125',
    blocks: [
      MOB_BLOCK_A1,
      MOB_BLOCK_B_VIE,
      { id: 'C', name: 'Cardio sala — Eliptica', dur: '15-20 min', color: '#185FA5', exIds: ['CARD-C'] },
      { id: 'D', name: 'Pierna — Squat + Bisagra', dur: '55 min', color: '#3C3489', exIds: ['QUAD-A','QUAD-B','QUAD-C','QUAD-D','QUAD-E','QUAD-F','HINGE-E','HINGE-F','HINGE-G'] },
      { id: 'E', name: 'Hip, TFL y abductores', dur: '35 min', color: '#993C1D', exIds: ['HIP-G','GLUTE-C','GLUTE-E','GLUTE-D','HIP-H','GLUTE-B','HIP-J','HIP-L2'] },
      { id: 'CR', name: 'Cuello (prep cervical) + Core REPETICIONES (control dinamico, casa-posible)', dur: '18 min', color: '#993C1D', exIds: ['NECK-A','NECK-D','CORE-G2','CORE-A','CORE-M','GLUTE-F','CORE-B'] },
    ]
  },

};

// Genera SESSIONS (forma que consume la app) a partir del plan WEEK + catalogo
const SESSIONS = buildSessions(WEEK);

// ─── JUEVES — rotación 3 semanas bloque D ────────────────────────
// Todos los grupos musculares cada semana; varía el ejercicio concreto.
// Ciclo A (WEEK_NUM % 3 === 1): jalón + pec deck + laterales
// Ciclo B (WEEK_NUM % 3 === 2): remo + fondos  + rear delt
// Ciclo C (WEEK_NUM % 3 === 0): jalón + fondos  + laterales
// app.js inyecta el bloque correcto en getCurSession() para sessId 4.
const WEEK_D_CYCLE = [
  { id:'D', name:'Empuje + Tiro — Ciclo A', dur:'45 min', color:'#3C3489',
    exIds:['PULL-A','PULL-B','PUSH-A','SHOULDER-A','ARM-A'] },
  { id:'D', name:'Empuje + Tiro — Ciclo B', dur:'45 min', color:'#3C3489',
    exIds:['PULL-A','PULL-C','PUSH-B','SHOULDER-B','ARM-A'] },
  { id:'D', name:'Empuje + Tiro — Ciclo C', dur:'45 min', color:'#3C3489',
    exIds:['PULL-A','PULL-B','PUSH-B','SHOULDER-A','ARM-A'] },
];

// ═══════════════════════════════════════════════════════════════════
// ─── MOB_BLOCK — BLOQUE EXTRA DE MOVILIDAD (nuevo) ────────────────
// Contiene los 3 grupos: Cadera, Espalda, Estabilidad + Foam Roller
// Puede integrarse como bloque adicional en cualquier sesión
// ═══════════════════════════════════════════════════════════════════

const MOB_BLOCK_MOVILIDAD_CADERA = {
  id: 'MOB-C',
  name: 'Movilidad de Cadera',
  dur: '20-25 min',
  color: '#7A3DAA',
  exs: [
    {
      n: 'Split Squat con carga en banco',
      d: '3x8 cada lado — progresivo',
      note: 'Pie trasero elevado en banco · Flexion profunda de cadera · Rodilla delantera no supera la punta del pie · Carga ligera progresiva',
      wid: 'split-squat-banco',
      variant: 'S1-2: solo peso corporal ROM parcial · S3-4: peso corporal ROM completo · S5-6: mancuerna ligera 5-8kg c/u · S7+: mancuernas medias 10-14kg c/u · F3: barra en rack'
    },
    {
      n: 'Flexion profunda de cadera en maquina',
      d: '3x12 cada lado — rango controlado',
      note: 'Maquina de flexion de cadera · Movimiento asistido · Solo rango sin dolor · Sin retroversion pelvica al final del rango',
      wid: 'flexion-cadera-maquina',
      variant: 'S1-2: carga muy ligera ROM 60-80° · S3-4: carga ligera ROM 90°+ · S5-6: carga media ROM completo exc 2s · S7+: carga media-alta pausa 1s en flexion maxima'
    },
    {
      n: 'Movilidad de abductores en suelo',
      d: '2x45 seg cada lado',
      note: 'Tumbado de lado · Apoyo de brazo inferior · Pierna superior extendida y elevada lateralmente · Estiramiento adductor + activacion abductor',
      wid: 'movilidad-abductores-suelo',
      variant: 'S1-2: estiramiento pasivo en suelo sin movimiento · S3-4: elevacion activa 10 rep + hold 20s · S5-6: elevacion con banda resistencia ligera · S7+: elevacion + circunduccion 5 rep lenta'
    },
    {
      n: 'Estocada lateral con carga (kettlebell)',
      d: '3x10 cada lado',
      note: 'Apertura lateral con pie externo en flexion · Rodilla tracking sobre pie · Kettlebell en goblet (dos manos) o un lado · Cadena posterior activa en el descenso',
      wid: 'estocada-lateral-kb',
      variant: 'S1-2: sin carga — lateral bodyweight ROM parcial · S3-4: sin carga ROM completo · S5-6: KB 8-12kg goblet · S7+: KB 16-20kg goblet + pausa 2s abajo · F3: KB en rack (uno o dos)'
    },
    {
      n: 'Pancake (estiramiento en straddle)',
      d: '2x60-90 seg — flexibilidad activa',
      note: 'Sentado con las piernas muy abiertas en V · Banda elastica anclada al frente (en casa: a un mueble bajo o al pie de la cama; en gym: polea ligera) para traccionar el torso manteniendo la espalda RECTA · Inclina desde la cadera, sin redondear la lumbar · Abre caderas y estira aductores e isquiotibiales · La rigidez de cadera se compensa con mala postura dorsal y cervical',
      wid: 'pancake-straddle',
      variant: 'S1-2: V estrecha, manos en el suelo, espalda erguida sin inclinar · S3-4: banda ligera, inclinacion suave desde la cadera · S5-6: V amplia, banda media, pecho hacia el suelo con espalda recta · S7+: polea/cable con carga ligera para traccion constante (flexibilidad activa) · F3: pancake completo pecho al suelo'
    },
  ]
};

const MOB_BLOCK_MOVILIDAD_ESPALDA = {
  id: 'MOB-E',
  name: 'Movilidad de Espalda',
  dur: '15-18 min',
  color: '#1A6E8A',
  exs: [
    {
      n: 'Extension toracica en cuadrupedia',
      d: '2x10 — lento y controlado',
      note: 'A cuatro patas · Manos bajo hombros · Rodillas bajo caderas · Extender un brazo hacia el techo mientras se rota la columna toracica · Lumbar estatica · Mirar hacia la mano elevada',
      wid: 'ext-toracica-cuadrupedia',
      variant: 'S1-2: rotacion minima 30-40° · S3-4: rotacion media 60° · S5-6: rotacion completa con pausa 2s · S7+: rotacion completa + extension de brazo y pierna opuesta'
    },
    {
      n: 'Extension toracica sobre fitball',
      d: '2 min — posicion pasiva progresiva',
      note: 'Fitball bajo zona media toracica (T4-T8) · Brazos cruzados en pecho o detras de cabeza · Dejar que la gravedad extienda la columna · NUNCA lumbar sobre el fitball',
      wid: 'ext-toracica-fitball',
      variant: 'S1-2: brazos cruzados en pecho — extension minima · S3-4: manos en nuca — extension media · S5-6: brazos extendidos hacia atras — extension completa · S7+: extension completa + pequenas oscilaciones (2cm) para movilizar segmento a segmento'
    },
    {
      n: 'Movilidad toracica en banco',
      d: '2x10 — apertura controlada',
      note: 'Arrodillado frente al banco · Codos apoyados sobre el banco a 90° · Dejar caer el pecho hacia el suelo manteniendo la cadera sobre las rodillas · Abre el pecho y moviliza T5-T10',
      wid: 'movilidad-toracica-banco',
      variant: 'S1-2: caida pasiva con apoyo de codos — rango minimo · S3-4: caida con pausa 3s en fondo · S5-6: caida completa + extension activa desde la posicion mas baja · S7+: agregar banda en el cuello escapular para apertura guiada'
    },
    {
      n: 'Flexion con extension en cuadrupedia',
      d: '2x12 — cat-cow toracico puro',
      note: 'Cat-cow enfocado exclusivamente en la zona toracica · Lumbar y pelvis lo mas estaticas posible · Al flexionar: cifosis toracica exagerada, escapulas abriendose · Al extender: apertura toracica, escapulas acercandose · Cabeza sigue la columna sin tension cervical',
      wid: 'flexion-extension-cuadrupedia',
      variant: 'S1-2: movimiento minimo — solo observar donde hay rigidez · S3-4: rango completo ritmo lento 3s por fase · S5-6: rango completo + pausa 2s en cada extremo · S7+: anadir rotacion alternada de cadera en el extremo de extension'
    },
    {
      n: 'Apertura toracica con disco (thoracic plate opener)',
      d: '2x8-10 — lento con pausa',
      note: 'Arrodillado frente a un foam roller horizontal · Disco sujeto con ambas manos (en casa: mancuerna o mochila con peso) · Al sentarte hacia los talones, lleva los brazos por encima de la cabeza dejando los codos sobre el rodillo y abre el pecho · Extension TORACICA, nunca lumbar · Descarga el cuello mejorando la extension dorsal',
      wid: 'apertura-toracica-disco',
      variant: 'S1-2: sin peso, brazos sobre el rodillo, rango corto · S3-4: disco ligero 2-5kg + pausa 2s · S5-6: disco 5-10kg apertura completa · S7+: tumbado en banco con los omoplatos en el borde, disco con brazos extendidos dejando caer el peso por gravedad (arco toracico)'
    },
    {
      n: 'Inclinacion lateral con pica (side bend)',
      d: '2x8 cada lado — controlado',
      note: 'Arrodillado en banco o de pie · Pica/palo (en casa: palo de escoba) sujeto con ambas manos por encima de la cabeza, brazos estirados · Inclina el tronco lateralmente con la espalda recta, sin rotar · Estira intercostales, dorsal y oblicuos del lado opuesto · El movimiento es toracico/costal — lumbar neutra',
      wid: 'side-bend-pica',
      variant: 'S1-2: sin pica, manos en la cabeza, rango corto · S3-4: pica overhead rango medio + pausa 2s · S5-6: pica rango completo con control excentrico · S7+: de pie con barra ligera sobre los hombros (mas estabilidad central) — nunca llevar la inclinacion a flexion lumbar'
    },
    {
      n: 'Extension toracica en banco con pica (overhead)',
      d: '2x60-90 seg — pasivo progresivo',
      note: 'Arrodillado frente a un banco (en casa: silla, cama o sofa firme) · Codos apoyados en el banco, pica sujeta por encima de la cabeza · Deja caer el pecho hacia el suelo entre los brazos: extension toracica + estiramiento de dorsales · Cadera sobre las rodillas y lumbar neutra — no arquear la lumbar para bajar mas',
      wid: 'ext-toracica-banco-pica',
      variant: 'S1-2: codos en banco, caida minima · S3-4: con pica, pausa 3s en el fondo · S5-6: sin pica, solo codos, dejando caer cabeza y pecho mas profundo · S7+: profundidad maxima + respiraciones largas exhalando en el fondo'
    },
  ]
};

const MOB_BLOCK_ESTABILIDAD_FOAM = {
  id: 'MOB-F',
  name: 'Estabilidad, Fuerza y Foam Roller',
  dur: '30-35 min',
  color: '#993C1D',
  exs: [
    {
      n: 'Sentadilla en apoyo unilateral con Foam Roller',
      d: '3x8 cada lado',
      note: 'De pie con el Foam Roller bajo el pie de trabajo (longitudinal) · La inestabilidad del FR activa la musculatura estabilizadora del tobillo, rodilla y cadera · Descenso lento 3s · Rodilla tracking sobre el segundo dedo del pie · Tronco erguido',
      wid: 'squat-unilateral-fr',
      variant: 'S1-2: apoyo bilateral con FR solo como referencia · S3-4: unilateral parcial ROM 60° · S5-6: unilateral ROM completo · S7+: unilateral ROM completo + pausa 2s abajo'
    },
    {
      n: 'Movilidad y activacion de cadera en cuadrupedia con Foam Roller',
      d: '2x10 — circunduccion lenta',
      note: 'A cuatro patas con el Foam Roller bajo las rodillas (transversal) · La inestabilidad activa el core y los flexores de cadera · Elevar y circunducir una pierna lentamente manteniendo la pelvis nivelada · PARAR si la pelvis rota o se inclina',
      wid: 'hip-mob-cuadrupedia-fr',
      variant: 'S1-2: solo elevacion sin circunduccion · S3-4: circunduccion pequena 5cm radio · S5-6: circunduccion media 10cm radio con control pelvico total · S7+: circunduccion completa + pausa 2s en cada punto cardinal'
    },
    {
      n: 'Puente de gluteo con apoyo en Foam Roller',
      d: '3x12 — pausa 2 seg arriba',
      note: 'Tumbado boca arriba · Talones sobre el Foam Roller (transversal) · La inestabilidad del FR maximiza la activacion de isquiotibiales y gluteo · Pelvis nivelada en la cima · REQUISITO: cadera no cae de lado al subir',
      wid: 'glute-bridge-fr',
      variant: 'S1-2: bilateral con FR fijo (pisado con ambos pies juntos) · S3-4: bilateral con FR libre sobre talones · S5-6: unilateral — un pie sobre FR, otro en el aire · S7+: unilateral + pausa 3s arriba'
    },
    {
      n: 'Plancha abdominal sobre Foam Roller',
      d: '3x20-30 seg',
      note: 'Codos apoyados sobre el Foam Roller (transversal) · La inestabilidad anteroposterior del FR activa el serrato anterior y el core profundo · Caderas al nivel de los hombros · Lumbar neutra — ni hundida ni elevada',
      wid: 'plank-fr',
      variant: 'S1-2: rodillas en suelo — solo codos en FR 20s · S3-4: completo 20s en FR · S5-6: completo 30s en FR con micro-oscilaciones hacia adelante y atras · S7+: completo 30s + 5 rep de deslizamiento controlado codos adelante/atras'
    },
    {
      n: 'Ischium Walk (caminata sobre isquiones)',
      d: '3x10m — ida y vuelta',
      note: 'Sentado en el suelo con piernas extendidas · Avanzar utilizando solo la contraccion alterna de gluteo e isquiotibiales (un isquion adelanta al otro) · Tronco erguido · Sin apoyo de manos · Activa la cadena posterior profunda sin carga axial',
      wid: 'ischium-walk',
      variant: 'S1-2: con apoyo ligero de manos en suelo 10m · S3-4: sin apoyo de manos 10m · S5-6: sin apoyo + brazos cruzados en pecho 15m · S7+: con pequeno peso en manos 15m'
    },
    {
      n: 'Control motor con Foam Roller — cuadrupedia',
      d: '3x10 cada lado — muy lento',
      note: 'A cuatro patas con el Foam Roller colocado transversalmente bajo las rodillas y otro longitudinalmente bajo la columna dorsal · Elevar y extender una pierna hacia atras sin que el FR lumbar se desplace · Mide y entrena el control segmentario de la columna bajo carga funcional',
      wid: 'motor-control-fr',
      variant: 'S1-2: solo un FR bajo rodillas — extension parcial de pierna · S3-4: extension completa de pierna con FR bajo rodillas · S5-6: agregar FR lumbar — extension completa · S7+: FR lumbar + extension simultanea de brazo y pierna opuestos (bird-dog sobre FR)'
    },
    {
      n: 'Puente de gluteo a una pierna',
      d: '3x12 cada lado — pausa 2 seg arriba',
      note: 'Tumbado boca arriba · Una pierna flexionada con el pie en el suelo · La otra pierna extendida o flexionada en el aire · Empujar con el talon del pie apoyado · Pelvis perfectamente nivelada en el punto mas alto · El lado libre NO debe caer',
      wid: 'single-leg-bridge',
      variant: 'S1-2: bilateral como base (ambos pies en suelo) · S3-4: unilateral pierna libre flexionada 90° · S5-6: unilateral pierna libre extendida horizontal · S7+: pie de trabajo sobre banco elevado + pierna libre extendida · F3: con mancuerna en cadera de trabajo'
    },
    {
      n: 'Elevacion iliaca (Iliac Elevation)',
      d: '3x10 cada lado — lento y controlado',
      note: 'De pie con el pie del lado de trabajo sobre una superficie elevada (step o banco bajo 15-20cm) · El otro pie en el suelo libre · Elevar activamente el hemipelvis del lado libre usando el cuadrado lumbar y el oblicuo · Bajar controlado · Trabaja la estabilizacion pelvica lateral sin carga axial de cadera',
      wid: 'iliac-elevation',
      variant: 'S1-2: elevacion minima en superficie de 10cm — apoyo en pared · S3-4: elevacion completa en surface 15cm — apoyo en pared · S5-6: elevacion completa sin apoyo de pared · S7+: elevacion completa + pausa 2s en punto alto + oscilacion descendente controlada (3 seg)'
    },
  ]
};

// ═══════════════════════════════════════════════════════════════════
// ─── EX_DB — BASE DE DATOS DE EJERCICIOS ──────────────────────────
// Contiene la info detallada que aparece al pulsar "i" en cada ej.
// ═══════════════════════════════════════════════════════════════════

const EX_DB = {};

EX_DB['pelvic-clock'] = {
  nombre: 'Activacion de core en colchon',
  categoria: 'Protocolo matutino',
  color: '#0F6E56',
  descripcion: 'Ejercicios de activacion de core y movilidad pelvica en decubito supino antes de levantarse de la cama. Preparan la musculatura estabilizadora para la carga del dia.',
  posicion: 'Tumbado boca arriba en la cama. Rodillas dobladas, pies apoyados. Brazos a los lados del cuerpo.',
  pasos: [
    'Activa el core isometricamente: "brace" suave al 20% de tension maxima. Exhala lentamente.',
    'Pelvic tilt: aplana la zona lumbar contra el colchon muy suavemente, sin retroversion activa.',
    'Balanceo lateral de rodillas: deja caer las rodillas 2 cm a cada lado sin mover los pies del colchon.',
  ],
  errores: ['Retroversion pelvica activa — no es el objetivo.', 'Movimientos bruscos o amplios — todo debe ser suave y milimetrico.'],
  variantes: ['Adaptar la intensidad al nivel de dolor matutino.'],
  notas_columna: 'El protocolo matutino es critico en la hernia discal activa porque el disco esta mas hidratado por la noche y mas vulnerable en los primeros minutos tras levantarse. La activacion isometrica del core antes de cualquier movimiento reduce el riesgo de reagudizacion al incorporarse.'
};

EX_DB['side-lying-decomp'] = {
  nombre: 'Descompresion lateral (side-lying spinal decompression)',
  categoria: 'Descompresion / Movilidad lumbar',
  color: '#0F6E56',
  descripcion: 'Descompresion lateral pasiva tumbado sobre el lado no sintomatico. Crea apertura foraminal en el lado afectado mediante flexion lateral pasiva.',
  posicion: 'Tumbado sobre el lado derecho (lado no sintomatico). Almohada gruesa o toalla enrollada bajo la cintura/flanco lumbar.',
  pasos: [
    'Tumbarse sobre el lado no sintomatico (derecho).',
    'Colocar almohada gruesa o toalla firmemente enrollada justo bajo la cintura.',
    'Dejar caer la cadera y las costillas hacia el colchon abrazando la curva.',
    'Relajarse por completo. Respiracion diafragmatica.',
    'Mantener 2-3 minutos.',
  ],
  errores: ['Tumbarse sobre el lado sintomatico: cierra el foramen en lugar de abrirlo.', 'Almohada demasiado pequena: no genera la apertura lateral necesaria.', 'Tension muscular activa: debe ser completamente pasivo.'],
  variantes: ['Duracion progresiva: 2 min → 3 min.', 'Anadir respiracion diafragmatica consciente sincronizada con la apertura lateral.'],
  notas_columna: 'La flexion lateral pasiva sobre el lado derecho abre fisicamente los neuroforamenes del lado izquierdo (L5-S1 izquierda). Posicion de referencia para recuperacion en dias de mayor sensibilidad. Complementa la posicion de Viparita Karani como herramienta de descompresion pasiva.'
};

EX_DB['hip-flexor'] = {
  nombre: 'Hip flexor stretch — estiramiento del psoas',
  categoria: 'Protocolo matutino',
  color: '#0F6E56',
  descripcion: 'Estiramiento del psoas iliaco en posicion de caballero. El psoas es el flexor de cadera principal y con frecuencia esta en acortamiento en personas con dolor lumbar cronico.',
  posicion: 'Posicion de caballero: una rodilla en el suelo, el otro pie adelantado a 90 grados.',
  pasos: [
    'Activa el gluteo trasero (contrae el gluteo del lado de la rodilla en el suelo).',
    'Mantén el tronco erguido — NO te inclines hacia adelante.',
    'Empuja la pelvis suavemente hacia adelante sin retroversion — el estiramiento debe sentirse en la ingle/muslo anterior.',
    'Mantén 40 segundos. Respira diafragmaticamente.',
  ],
  errores: ['Retroversion pelvica — anula el estiramiento del psoas.', 'Inclinarse hacia adelante — pierde el estiramiento.', 'Dolor lumbar al hacerlo — reducir la amplitud.'],
  variantes: ['S1-2: rango muy corto, apoyo en pared. S3-4: rango medio sin apoyo. S5-6+: brazo ipsilateral elevado para aumentar el estiramiento lateral.'],
  notas_columna: 'El psoas se origina en los cuerpos vertebrales L1-L4 y en los discos intervertebrales L1-L5. Un psoas acortado tracciona directamente sobre los segmentos afectados L4-L5 y L5-S1, aumentando la lordosis lumbar y la presion discal posterior. El estiramiento diario es parte del protocolo de descarga.'
};

EX_DB['neural-flossing'] = {
  nombre: 'Neural flossing — nervio ciatico',
  categoria: 'Protocolo neural',
  color: '#D4831A',
  descripcion: 'Tecnica de deslizamiento neural del nervio ciatico. Moviliza el nervio a traves de su recorrido desde la raiz lumbar hasta el pie, reduciendo la tension neural acumulada.',
  posicion: 'Sentado en el borde de una silla o tumbado boca arriba.',
  pasos: [
    'Sentado: extiende la rodilla del lado afectado mientras echas la cabeza hacia atras.',
    'Vuelve a flexionar la rodilla mientras llevas la barbilla al pecho.',
    'El movimiento debe ser suave y continuo — como un acordeon.',
    'PARAR inmediatamente si hay reproduccion de irradiacion o calambre.',
  ],
  errores: ['Hacer el movimiento brusco o rapido.', 'Continuar si hay irradiacion reproducida.', 'Hacer con irradiacion activa intensa — esperar ventana de calma.'],
  variantes: ['S1-2: angulo 30-40° muy suave. S3-4: angulo 60°. S5-6: angulo 80° + dorsiflexion pasiva. S7+: angulo completo + dorsiflexion activa.'],
  notas_columna: 'El neural flossing es una tecnica de movilizacion neural que se diferencia del estiramiento neural en que no mantiene la tension — el nervio se desliza en lugar de estirarse. Esto reduce el riesgo de irritacion adicional de la raiz. Solo realizar en ventanas sin irradiacion activa.'
};

EX_DB['good-morning'] = {
  nombre: 'Good morning con banda elastica',
  categoria: 'Hip hinge',
  color: '#3C3489',
  descripcion: 'Bisagra de cadera con resistencia de banda elastica. Activa los isquiotibiales y erectores lumbares como unidad funcional en posicion neutra.',
  posicion: 'De pie, banda elastica detrás del cuello o cruzada sobre los hombros. Pies a anchura de caderas.',
  pasos: [
    'Activa el core antes de iniciar.',
    'Empuja las caderas hacia atras manteniendo la espalda recta.',
    'Inclina el tronco hacia adelante hasta que la espalda sea paralela al suelo o se note tension en isquiotibiales.',
    'Regresa a la posicion erguida activando el gluteo.',
  ],
  errores: ['Redondear la espalda lumbar.', 'Flexionar demasiado las rodillas (convierte en sentadilla).', 'Usar banda demasiado fuerte que fuerza la posicion.'],
  variantes: ['S1-2: banda ligera 3x12. S3-4: banda media 3x10. S5-6: banda fuerte 3x10. S7+: barra vacia 3x10. F3: Seated good morning con barra.'],
  notas_columna: 'El good morning es el primer patron hinge que se introduce porque la banda elastica fuerza la postura correcta sin carga axial compresiva. Cualquier redondeo lumbar es visible inmediatamente — la banda actua como biofeedback postural.'
};

EX_DB['rdl-mancuernas'] = {
  nombre: 'RDL — Romanian Deadlift con mancuernas',
  categoria: 'Hip hinge',
  color: '#3C3489',
  descripcion: 'Bisagra de cadera con carga excentrica en los isquiotibiales y gluteo mayor. Es el patron fundamental de flexion de tronco segura con la columna en posicion neutra.',
  posicion: 'De pie, pies a anchura de caderas, mancuernas a los lados del cuerpo, palmas hacia los muslos. Rodillas ligeramente flexionadas.',
  pasos: [
    'Inspira y activa el core antes de iniciar.',
    'Empuja las caderas hacia ATRAS. Las mancuernas bajan pegadas a las piernas.',
    'Mantén la espalda completamente neutra — ni hiperlordosis ni cifosis.',
    'Baja hasta sentir tension en isquiotibiales.',
    'NO fuerces el rango — si se pierde la posicion neutra, es el limite.',
    'Exhala y activa el gluteo para volver a la posicion inicial.',
  ],
  errores: ['Redondear la espalda lumbar — error mas peligroso con extrusion discal activa.', 'Flexionar demasiado las rodillas — convierte en sentadilla.', 'Dejar las mancuernas separadas del cuerpo.', 'No activar el gluteo en la subida.'],
  variantes: ['S1-2: 8-10 kg — patron y activacion glutea. S3-4: 12-14 kg rango parcial. S5-6: 16-18 kg rango completo. S7+: 20 kg+ criterio F3.'],
  notas_columna: 'El RDL es el ejercicio mas importante de la cadena posterior en F2. La columna neutra bajo carga excentrica es el criterio de exito. Con extrusion L4-L5 y L5-S1, priorizar el patron sobre la carga en todo momento.'
};

EX_DB['dead-bug'] = {
  nombre: 'Dead bug con extension completa',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Ejercicio de estabilizacion del core que entrena la anti-extension lumbar. Requiere mantener la columna lumbar pegada al suelo mientras se mueven brazos y piernas de forma coordinada.',
  posicion: 'Tumbado boca arriba. Brazos extendidos hacia el techo. Caderas y rodillas a 90 grados.',
  pasos: [
    'Presiona activamente la zona lumbar contra el suelo. Este contacto debe mantenerse DURANTE TODO EL EJERCICIO.',
    'Manten la nuca apoyada en el suelo con la barbilla en ligera retraccion (doble menton suave): el cuello NO se levanta ni se tensa en ningun momento. Mandibula y lengua relajadas.',
    'Exhala y extiende simultaneamente el brazo derecho (hacia atras) y la pierna izquierda (hacia adelante).',
    'La zona lumbar NO debe despegarse del suelo — si lo hace, el rango es excesivo.',
    'Vuelve lentamente a la posicion inicial.',
    'Repite con brazo izquierdo y pierna derecha.',
  ],
  errores: ['La zona lumbar se despega del suelo — DETENER EL MOVIMIENTO.', 'Levantar la cabeza o tirar de la barbilla hacia el pecho para mirarse el abdomen — carga los flexores cervicales y el esternocleidomastoideo. La nuca permanece en el suelo.', 'Contener la respiracion — la apnea dispara la tension del cuello y los trapecios.', 'Velocidad excesiva — el beneficio es el control.', 'Extensiones asimetricas.'],
  variantes: ['S1-2: solo extension de un miembro a la vez. S3-4: extension contralateral completa. S5-6: anadir press de palma contra rodilla. S7+: dead bug con fitball.', 'Cervical: si aparece tension en el cuello, coloca una toalla fina doblada bajo la cabeza para que la nuca descanse del todo y manten la mirada al techo. Antes de sacrificar la posicion del cuello, reduce los miembros que mueves (solo pierna, o solo brazo).'],
  notas_columna: 'El dead bug activa los multifidos ipsilaterales al segmento afectado L5-S1 izq mediante el patron cruzado. La lumbar despegada convierte el ejercicio en extension lumbar bajo carga: contraproducente con extrusion bilateral activa. Cervical: al ser un ejercicio en supino, el error de cuello mas comun es elevar la cabeza para controlar el abdomen; la nuca debe descansar en el suelo (o sobre una toalla) con la mandibula relajada para no cargar los flexores cervicales.'
};

EX_DB['bird-dog'] = {
  nombre: 'Bird dog con pausa',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Ejercicio de estabilizacion cuadrupeda que entrena el control pelvico y la coordinacion de la cadena posterior. Activa los multifidos lumbares sin carga compresiva significativa.',
  posicion: 'A cuatro patas: rodillas bajo las caderas, manos bajo los hombros. Columna en posicion neutra.',
  pasos: [
    'Activa el core — columna neutra, pelvis sin inclinacion.',
    'Manten el cuello largo y alineado con el resto de la columna: la mirada va al suelo (un punto entre las manos), sin levantar la barbilla para mirar al frente ni dejar caer la cabeza.',
    'Extiende el brazo derecho hacia adelante y la pierna izquierda hacia atras SIMULTANEAMENTE.',
    'La pelvis NO debe rotar ni inclinarse.',
    'Pausa 3 segundos en la posicion extendida.',
    'Vuelve lentamente sin dejar caer el brazo o la pierna.',
    'Repite con el lado contrario.',
  ],
  errores: ['Pelvis que rota al elevar la pierna.', 'Hiperextension lumbar al elevar la pierna.', 'Levantar la barbilla para mirar al frente — extiende la cervical y la carga; el cuello sigue a la columna, con la mirada al suelo.', 'Dejar caer la cabeza entre los hombros — encoge los trapecios.', 'Velocidad excesiva — la pausa es parte del ejercicio.'],
  variantes: ['S1-2: brazo o pierna por separado. S3-4: contralateral con pausa 3s. S5-6: banda en el tobillo. S7+: sobre superficie inestable.', 'Cervical: si el cuello se cansa de sostener la cabeza, acorta la palanca (mueve solo brazo o solo pierna) y comprueba en un espejo lateral que oreja, hombro y cadera quedan en linea. La coronilla "empuja" hacia delante, no la barbilla.'],
  notas_columna: 'El bird dog es el ejercicio de activacion de multifidos mas validado para dolor lumbar inespecifico y hernia discal en Fase 1 y 2. La co-contraccion de multifidos y transverso abdominal que produce es el mecanismo protector del segmento discal afectado. Cervical: en cuadrupedia la cabeza pesa en voladizo; mantener el cuello neutro (mirada al suelo) evita que los extensores cervicales y los trapecios se sobrecarguen al sostenerla.'
};

EX_DB['remo-unilateral-pierna-elevada'] = {
  nombre: 'Remo unilateral en banco con pierna contraria elevada',
  categoria: 'Core F2 / Tiro',
  color: '#993C1D',
  descripcion: 'Remo unilateral con mancuerna apoyado en un banco, con la pierna contraria extendida y elevada. Combina el patron de tiro horizontal (dorsal, romboides, biceps) con una fuerte demanda anti-rotacion del core y activacion de la cadena posterior por la pierna en suspension. La carga axial sobre la columna es minima porque el tronco esta horizontal y apoyado.',
  posicion: 'Una mano y la rodilla del mismo lado apoyadas en el banco; el tronco queda horizontal. La otra pierna se extiende hacia atras y se eleva hasta la altura de la cadera. Columna y cuello neutros, mirada al suelo.',
  pasos: [
    'Coloca una mano y una rodilla en el banco; el tronco queda horizontal y paralelo al suelo.',
    'Extiende la pierna contraria hacia atras y elevala hasta la altura de la cadera — mantenla isometrica todo el ejercicio (activa gluteo e isquios).',
    'Activa el core: lumbar neutra, pelvis sin rotar.',
    'Rema con el brazo libre llevando el codo hacia la cadera; la escapula retrae primero.',
    'El reto es NO permitir que la pelvis ni el tronco roten hacia el lado que rema — es un ejercicio anti-rotacion.',
    'Baja la mancuerna controlando el excentrico sin perder la posicion de la pierna.',
    'Cuello largo y mirada al suelo durante toda la serie.',
  ],
  errores: ['Rotar la pelvis o el tronco al tirar — pierde el componente anti-rotacion y carga la lumbar de forma asimetrica.', 'Dejar caer la pierna elevada o llevarla por encima de la cadera (hiperextension lumbar).', 'Tirar con la zona baja de la espalda en lugar de la escapula y el dorsal.', 'Levantar la cabeza para mirar al frente — el cuello sigue a la columna, mirada al suelo.'],
  variantes: ['S1-2: sin pierna elevada, remo apoyado clasico con carga ligera. S3-4: pierna elevada a media altura, remo controlado. S5-6: pierna a la altura de la cadera + pausa 1s arriba. S7+: pierna elevada + excentrico 3s + carga progresiva.', 'Casa: remo con banda anclada baja al frente en la misma posicion (sustituye la mancuerna).'],
  notas_columna: 'Para una extrusion bilateral L4-L5 y L5-S1, los ejercicios anti-rotacion son de los mas protectores: entrenan el core a RESISTIR el giro en lugar de generarlo, evitando el cizallamiento rotacional sobre el disco. El apoyo en banco mantiene el tronco horizontal y elimina la carga compresiva axial, mientras la pierna elevada activa el gluteo y los multifidos de forma isometrica. El criterio de seguridad es mantener la pelvis estable: si no puedes controlar la rotacion, baja la carga o regresa a la version sin pierna elevada.'
};

EX_DB['plank-lateral-abduccion-banda'] = {
  nombre: 'Plancha lateral con abduccion de cadera resistida con banda',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Plancha lateral sobre el antebrazo a la que se anade una abduccion de cadera de la pierna superior contra una banda elastica. Combina el trabajo anti-flexion lateral del core (cuadrado lumbar, oblicuos) con la activacion del gluteo medio, clave para la estabilidad pelvica. Sin carga axial sobre la columna.',
  posicion: 'Plancha lateral apoyado sobre el antebrazo, cuerpo en linea, cadera elevada. Banda elastica anclada rodeando la pierna superior (tobillo o muslo). Cuello en linea con la columna.',
  pasos: [
    'Adopta la plancha lateral: codo bajo el hombro, cadera elevada, cuerpo en linea recta.',
    'Activa el core para no dejar caer la cadera — anti-flexion lateral.',
    'Con la banda rodeando la pierna superior, eleva esa pierna en abduccion contra la resistencia.',
    'Manten la pelvis nivelada y el tronco estable — no rotar la cadera hacia atras.',
    'Pausa 1 segundo en la abduccion maxima.',
    'Baja la pierna controlando el excentrico sin perder la altura de la cadera.',
    'Cuello en linea con la columna; si se carga, apoya la cabeza sobre el brazo de abajo.',
  ],
  errores: ['Dejar caer la cadera inferior — se pierde la plancha.', 'Rotar la pelvis hacia atras al abrir la pierna (compensacion del TFL).', 'Llevar la pierna a la abduccion con la lumbar en vez del gluteo.', 'Dejar caer la cabeza hacia el suelo o girarla para mirar al techo.'],
  variantes: ['S1-2: plancha lateral con rodilla inferior apoyada, abduccion sin banda. S3-4: plancha completa, abduccion sin banda o banda ligera. S5-6: plancha completa con banda media + pausa 1s arriba. S7+: banda fuerte + excentrico 3s.'],
  notas_columna: 'La plancha lateral es uno de los "Big 3" de McGill para la estabilizacion lumbar: entrena el cuadrado lumbar y los oblicuos sin generar compresion ni flexion del disco. Anadir la abduccion resistida activa el gluteo medio, cuya debilidad (frecuente en el lado afecto en presentaciones antalgicas L5-S1) provoca caida pelvica y sobrecarga compensatoria de la columna lumbar. El criterio de seguridad es mantener la pelvis nivelada: si se rota o cae, reducir la banda o regresar a la version con rodilla apoyada.'
};

EX_DB['marcha-overhead-banda'] = {
  nombre: 'Marcha con carga overhead (KB) y banda en el pie',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Ejercicio de estabilidad global: se sostiene una kettlebell overhead con un brazo bloqueado mientras se realiza una marcha (elevacion de rodilla) controlada contra una banda anclada al pie. Exige estabilidad escapulo-humeral overhead y un fuerte control anti-extension y anti-rotacion del core para no arquear la lumbar bajo la carga elevada.',
  posicion: 'De pie, KB sostenida sobre la cabeza con el brazo extendido y el codo bloqueado. Banda elastica anclada baja rodeando el pie que va a marchar. Costillas abajo, lumbar neutra.',
  pasos: [
    'Lleva la KB a posicion overhead con el brazo totalmente extendido y el hombro activo (empaquetado, lejos de la oreja).',
    'Fija las costillas abajo y activa el core — la clave es NO arquear la lumbar para sostener el peso arriba.',
    'Con la banda rodeando el pie, eleva la rodilla (marcha) de forma lenta y controlada contra la resistencia.',
    'Manten la KB perfectamente vertical y estable durante toda la marcha.',
    'Baja el pie con control y repite; cambia de lado segun el protocolo.',
    'Cuello neutro y hombro estable — no encogerlo hacia la oreja.',
  ],
  errores: ['Arquear la lumbar (hiperextension) para sostener la KB — el fallo mas peligroso.', 'Dejar que la KB se desplace hacia delante o lateralmente.', 'Encoger el trapecio del lado de la carga.', 'Marcha con impulso en vez de control.'],
  variantes: ['S1-2: sin KB, solo marcha con banda para el patron y el equilibrio. S3-4: KB ligera 4-6 kg overhead estatica + marcha sin banda. S5-6: KB media + banda ligera + pausa 1s con la rodilla arriba. S7+: KB mas pesada + banda media controlada.', 'Casa: misma marcha resistida sosteniendo una mancuerna ligera overhead en lugar de la KB.'],
  notas_columna: 'La carga overhead obliga al core a trabajar en anti-extension: el peso por encima de la cabeza tiende a arquear la lumbar, y resistir ese arqueo es exactamente lo que protege el segmento L4-L5/L5-S1 al ensenar a mantener la pelvis neutra bajo carga. La marcha resistida anade un componente anti-rotacion y de control de cadera. Criterio de seguridad absoluto: si la lumbar se arquea o aparece irradiacion S1, bajar el peso o quitar la KB. Introducir solo desde S3-4 en adelante, nunca en fase inicial.'
};

EX_DB['bird-dog-resistido'] = {
  nombre: 'Bird-dog resistido con polea o banda',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Progresion del bird-dog clasico en la que la mano que se extiende tracciona contra una banda o polea anclada al frente, mientras la pierna contraria se extiende hacia atras. La resistencia frontal aumenta la demanda anti-rotacion y de co-contraccion de multifidos y transverso, sin anadir carga compresiva axial.',
  posicion: 'Cuadrupedia: rodillas bajo las caderas, manos bajo los hombros, columna neutra. Una mano sujeta la banda/polea anclada al frente. Cuello largo, mirada al suelo.',
  pasos: [
    'Adopta la cuadrupedia con la columna neutra y el core activo.',
    'Sujeta la banda o el asa de la polea anclada al frente con una mano.',
    'Extiende la pierna contraria hacia atras hasta la altura de la cadera mientras traccionas con el brazo, coordinando ambos movimientos.',
    'La resistencia frontal intenta rotar y flexionar tu tronco: tu trabajo es resistirla manteniendo la pelvis nivelada.',
    'No arquees la lumbar al extender la pierna — costillas abajo.',
    'Pausa, vuelve con control y repite; alterna lados.',
    'Cuello largo y mirada al suelo durante toda la serie.',
  ],
  errores: ['Permitir que el tronco rote hacia el lado de la traccion.', 'Hiperextender la lumbar al extender la pierna.', 'Elevar la pierna por encima de la cadera.', 'Levantar la barbilla para mirar al frente.'],
  variantes: ['S1-2: bird-dog clasico sin resistencia para dominar el patron. S3-4: solo traccion de brazo con banda ligera, pierna estatica. S5-6: brazo + pierna coordinados con banda media + pausa 2s. S7+: banda o polea fuerte + excentrico lento.'],
  notas_columna: 'El bird-dog es el ejercicio de activacion de multifidos mas validado para hernia discal lumbar; anadir resistencia frontal convierte la fase de extension en un reto anti-rotacion que refuerza la co-contraccion protectora del segmento L4-L5/L5-S1 sin carga axial. La resistencia debe ser moderada: si provoca rotacion de la pelvis o arqueo lumbar, reducir la banda o volver al bird-dog clasico. Progresar solo cuando el patron base se ejecuta con la pelvis perfectamente estable.'
};

EX_DB['rotacion-toracica-banda'] = {
  nombre: 'Rotacion toracica controlada con banda',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Movimiento de rotacion controlada de la columna toracica con una banda anclada en alto, en posicion de media sentadilla con base ancha. Entrena la movilidad rotacional del segmento dorsal y el control del core, disociando la rotacion toracica de la lumbar, que debe permanecer fija.',
  posicion: 'De pie en media sentadilla, pies mas anchos que los hombros, sujetando con ambas manos una banda anclada en alto a un costado. Pelvis y lumbar neutras y fijas.',
  pasos: [
    'Adopta la media sentadilla con base ancha y pelvis estable.',
    'Sujeta la banda anclada en alto a un costado con los brazos semiextendidos.',
    'Rota de forma controlada hacia el lado de la banda llevando el giro a la columna TORACICA (caja toracica), no a la lumbar.',
    'La pelvis y la zona lumbar permanecen fijas y mirando al frente — el movimiento es dorsal.',
    'Acompana el giro con la mirada y el cuello; hombros lejos de las orejas.',
    'Vuelve con control resistiendo la banda; completa las repeticiones y cambia de lado.',
  ],
  errores: ['Rotar desde la lumbar en vez de la columna toracica — es el error a evitar con hernia.', 'Mover la pelvis o los pies con el giro.', 'Tirones bruscos o usar impulso en lugar de control.', 'Perder la posicion neutra de la lumbar al rotar.'],
  variantes: ['S1-2: anti-rotacion pura tipo Pallof — resistir la banda sin girar. S3-4: rotacion toracica de rango corto con banda ligera. S5-6: rango medio con banda media + pausa 1s. S7+: rango completo controlado con banda media y excentrico 3s.'],
  notas_columna: 'La rotacion bajo carga es uno de los movimientos mas sensibles para una hernia L4-L5/L5-S1 si se ejecuta desde la lumbar. La clave terapeutica de este ejercicio es disociar: la movilidad rotacional debe salir de la columna toracica (que esta hecha para rotar) mientras la lumbar permanece neutra y estable (anti-rotacion). Por eso la progresion empieza en anti-rotacion pura (Pallof) y solo anade rango toracico cuando hay control. Si se siente que el giro "baja" a la lumbar o aparece irradiacion, reducir el rango o volver a la version isometrica.'
};

EX_DB['goblet-squat-cunas'] = {
  nombre: 'Sentadilla goblet con cunas en los talones',
  categoria: 'Cuadriceps / Pierna',
  color: '#993C1D',
  descripcion: 'Sentadilla goblet (kettlebell o mancuerna sostenida frente al pecho) realizada con cunas o discos bajo los talones. La elevacion del talon aumenta el rango de dorsiflexion disponible, lo que permite descender mas y mantener el tronco mas vertical, reduciendo la inclinacion hacia delante y la palanca sobre la columna lumbar.',
  posicion: 'De pie con los talones sobre cunas, discos o un tablon (2-4 cm). Pies a la anchura de los hombros. KB/mancuerna sostenida con ambas manos frente al pecho (goblet). Columna neutra, mirada al frente.',
  pasos: [
    'Coloca los talones sobre las cunas; pies a la anchura de los hombros.',
    'Sujeta la KB frente al pecho con los codos bajo el peso.',
    'Activa el core y desciende manteniendo el tronco lo mas vertical posible.',
    'Baja hasta la profundidad en la que la lumbar se mantenga neutra (sin buttwink).',
    'Empuja con todo el pie para subir, sin perder la verticalidad del torso.',
    'Pausa 2 segundos abajo si el estadio lo indica.',
  ],
  errores: ['Buttwink: retroversion pelvica y flexion lumbar en el punto bajo — limitar la profundidad.', 'Inclinar el tronco hacia delante (la cuna existe precisamente para evitarlo).', 'Separar la KB del cuerpo.', 'Rodillas que colapsan hacia dentro.'],
  variantes: ['S1-2: peso corporal con cunas, ROM parcial. S3-4: KB 8-10 kg. S5-6: KB 12-16 kg + pausa 2s. S7+: KB 20 kg+ + pausa 3s.', 'Casa: cunas improvisadas (libro fino o tablon) y mancuerna ligera o peso corporal.'],
  notas_columna: 'La cuna bajo el talon compensa una dorsiflexion de tobillo limitada, que es una causa frecuente de inclinacion excesiva del tronco en la sentadilla. Al permitir un torso mas vertical, se reduce el brazo de palanca sobre L4-L5/L5-S1 y la carga compresiva/cizallante sobre el disco. El criterio de seguridad sigue siendo la lumbar neutra: limitar la profundidad al punto previo al buttwink y parar ante cualquier irradiacion S1.'
};

EX_DB['plank-lateral-banco-hip-dips'] = {
  nombre: 'Plancha lateral en banco con elevacion de cadera (hip dips)',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Version dinamica de la plancha lateral con el antebrazo apoyado en un banco. Se baja y sube la cadera de forma controlada (hip dips), lo que entrena los oblicuos y el cuadrado lumbar de forma concentrica y excentrica, reforzando el complejo lumbopelvico lateral sin carga axial.',
  posicion: 'Plancha lateral con el antebrazo apoyado en un banco, cuerpo en linea, pies apilados o escalonados. Cuello en linea con la columna.',
  pasos: [
    'Apoya el antebrazo en el banco y adopta la plancha lateral con el cuerpo en linea.',
    'Activa el core para sostener la cadera elevada.',
    'Baja la cadera de forma controlada hacia el banco sin dejarla caer de golpe.',
    'Sube de nuevo apretando el oblicuo del lado de abajo hasta recuperar la linea.',
    'Manten el recorrido comodo y el tronco sin rotar.',
    'Cuello en linea con la columna; no dejar caer la cabeza hacia el banco.',
  ],
  errores: ['Dejar caer la cadera de golpe en lugar de controlar el excentrico.', 'Rotar el tronco adelante o atras durante el movimiento.', 'Recorrido excesivo que rompe la alineacion.', 'Dejar caer la cabeza hacia el banco.'],
  variantes: ['S1-2: plancha lateral isometrica en banco (sin dips). S3-4: hip dips de recorrido corto controlado. S5-6: recorrido completo + pausa 1s arriba. S7+: recorrido completo con excentrico 3s o con los pies en el suelo (palanca larga).'],
  notas_columna: 'La plancha lateral (uno de los "Big 3" de McGill) entrena el cuadrado lumbar y los oblicuos sin flexion ni compresion del disco. Al hacerla dinamica con hip dips se anade trabajo excentrico del complejo lumbopelvico lateral, util para la estabilidad frontal que protege L4-L5/L5-S1, manteniendo el banco como apoyo elevado para reducir la exigencia respecto al suelo. Controlar siempre el descenso: la cadera no debe caer pasivamente.'
};

EX_DB['pallof-press-media-rodilla'] = {
  nombre: 'Pallof press en media rodilla',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Variante del Pallof press en posicion de media rodilla. Con una banda o polea anclada lateralmente a la altura del pecho, se extienden los brazos al frente resistiendo el giro. La posicion de media rodilla elimina la ayuda de las piernas y anade un componente anti-extension y de estabilidad de cadera.',
  posicion: 'Media rodilla: una rodilla en el suelo, la otra pierna flexionada al frente con el pie apoyado. Banda/polea anclada lateralmente a la altura del pecho, sujeta con ambas manos en el centro del pecho. Pelvis neutra.',
  pasos: [
    'Adopta la media rodilla con la cadera de la pierna atrasada extendida y el gluteo activo.',
    'Sujeta la banda con ambas manos en el centro del pecho; la banda tira hacia su anclaje lateral.',
    'Activa el core: pelvis neutra, sin arquear la lumbar ni inclinarte hacia el anclaje.',
    'Extiende los brazos al frente (press) resistiendo el giro que impone la banda.',
    'Manten 1-2 segundos con los brazos extendidos y vuelve al pecho con control.',
    'Hombros y cuello relajados, sin encoger los trapecios.',
  ],
  errores: ['Arquear la lumbar al extender los brazos (perder la anti-extension).', 'Inclinarse o rotar hacia el anclaje de la banda.', 'Dejar caer la cadera de la pierna atrasada (gluteo inactivo).', 'Encoger los hombros hacia las orejas al presionar.'],
  variantes: ['S1-2: isometrico en el pecho con banda ligera. S3-4: press completo con banda media. S5-6: press + pausa 2s con los brazos extendidos. S7+: banda fuerte o rodilla sobre superficie inestable.'],
  notas_columna: 'El Pallof press es el ejercicio anti-rotacion de referencia y de los mas protectores para una extrusion L4-L5/L5-S1: entrena el core a RESISTIR la rotacion sin generarla, evitando el cizallamiento rotacional del disco. La posicion de media rodilla anade anti-extension (hay que evitar arquear la lumbar) y activacion del gluteo de la pierna atrasada, reproduciendo el control pelvico necesario en el dia a dia. Mantener la pelvis neutra es el criterio: si se arquea o se inclina, reducir la banda.'
};

EX_DB['remo-plancha-lateral'] = {
  nombre: 'Remo en plancha lateral con banda',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Plancha lateral sobre el antebrazo en la que el brazo superior, libre, rema contra una banda anclada baja al frente. Combina la estabilidad lateral del core (anti-flexion lateral) con el control escapular y del dorsal del lado que rema, todo sin carga axial sobre la columna.',
  posicion: 'Plancha lateral sobre el antebrazo, cuerpo en linea, cadera elevada. El brazo superior sujeta una banda anclada baja y al frente. Cuello en linea con la columna.',
  pasos: [
    'Adopta la plancha lateral con el codo bajo el hombro y la cadera elevada.',
    'Con el brazo superior sujeta la banda anclada baja y al frente.',
    'Activa el core para no dejar caer la cadera (anti-flexion lateral).',
    'Rema llevando el codo hacia la cadera, retrayendo primero la escapula.',
    'No permitas que el tronco rote ni que la cadera baje mientras remas.',
    'Vuelve con control y repite; cuello en linea con la columna.',
  ],
  errores: ['Dejar caer la cadera inferior al concentrarte en el remo.', 'Rotar el tronco hacia atras al tirar.', 'Tirar con el brazo sin retraer la escapula.', 'Dejar caer la cabeza o girarla hacia el techo.'],
  variantes: ['S1-2: plancha lateral con rodilla apoyada + remo con banda ligera. S3-4: plancha completa con remo banda ligera. S5-6: plancha completa banda media + pausa 1s. S7+: banda fuerte + excentrico 3s.'],
  notas_columna: 'Combina dos patrones seguros para L4-L5/L5-S1: la plancha lateral (estabilizacion del cuadrado lumbar y oblicuos sin compresion discal) y el remo con banda (tiro sin carga axial). El reto anadido es mantener la pelvis y el tronco estables mientras una fuerza asimetrica (el remo) intenta rotarlos, lo que refuerza el control anti-rotacion protector. Si la cadera cae o el tronco rota, reducir la banda o pasar a la version con rodilla apoyada.'
};

EX_DB['renegade-row-oso'] = {
  nombre: 'Renegade row en posicion de oso (bear)',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Remo unilateral con mancuerna desde la posicion de oso (cuadrupedia con las rodillas despegadas del suelo). Es un ejercicio anti-rotacion muy exigente: mientras una mano rema, el resto del cuerpo debe impedir que la pelvis y la columna roten, con el apoyo estable de la otra mano y las puntas de los pies.',
  posicion: 'Posicion de oso: manos bajo los hombros, rodillas flexionadas y despegadas 2-3 cm del suelo, espalda plana y paralela al suelo. Una mancuerna bajo una mano. Cuello largo, mirada al suelo.',
  pasos: [
    'Adopta la posicion de oso con la espalda plana y las rodillas justo despegadas del suelo.',
    'Reparte el peso entre las dos manos y las puntas de los pies; pelvis nivelada.',
    'Rema una mancuerna con un brazo llevando el codo hacia la cadera.',
    'El objetivo es que la pelvis y el tronco NO roten ni se inclinen mientras remas (anti-rotacion).',
    'Baja la mancuerna con control y completa las repeticiones antes de cambiar de lado.',
    'Cuello largo y mirada al suelo durante toda la serie.',
  ],
  errores: ['Rotar o inclinar la pelvis hacia el lado que rema — el fallo principal.', 'Elevar demasiado las caderas o redondear la espalda.', 'Apoyar las rodillas (pierde la posicion de oso) salvo en la regresion.', 'Tirar con impulso en lugar de control.'],
  variantes: ['S1-2: en cuadrupedia con rodillas apoyadas, remo ligero sin rotar. S3-4: posicion de oso (rodillas elevadas) con remo ligero. S5-6: posicion de oso con remo medio + pausa 1s. S7+: posicion de oso con carga progresiva y excentrico 3s.', 'Casa: remo con banda anclada baja o peso casero en la misma posicion.'],
  notas_columna: 'La posicion de oso con remo unilateral es de las formas mas intensas de entrenar la anti-rotacion sin carga axial sobre la columna: la fuerza asimetrica del remo intenta rotar la pelvis y el raquis, y resistir ese giro es exactamente el control que protege el segmento L4-L5/L5-S1. Empezar siempre desde la regresion con rodillas apoyadas y progresar a la posicion de oso solo cuando se mantiene la pelvis perfectamente estable. Parar ante cualquier irradiacion S1.'
};

EX_DB['woodchop-banda'] = {
  nombre: 'Woodchop con banda (anclaje alto)',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Movimiento de "corte de lena" diagonal: desde un anclaje alto se tracciona la banda en diagonal hacia la cadera opuesta. Activa la musculatura rotadora del tronco (oblicuos), pero la rotacion debe generarse en la columna toracica y las caderas, no en la lumbar, que permanece estable.',
  posicion: 'De pie con los pies anchos, banda o polea anclada en alto a un costado. Se sujeta el asa con ambas manos por encima del hombro del lado del anclaje. Lumbar neutra.',
  pasos: [
    'Sujeta el asa con ambas manos arriba, del lado del anclaje alto.',
    'Activa el core con la lumbar neutra y los pies firmes.',
    'Tracciona en diagonal de arriba hacia la cadera opuesta (chop descendente).',
    'Genera el giro pivotando los pies y rotando desde el TORACICO y las caderas, no desde la lumbar.',
    'Controla el retorno resistiendo la banda, sin tirones.',
    'Hombros y cuello relajados acompanando el giro de la columna alta.',
  ],
  errores: ['Rotar desde la lumbar en vez de la columna toracica y las caderas — el error a evitar con hernia.', 'Mantener los pies clavados sin pivotar (fuerza el giro a la zona lumbar).', 'Usar impulso brusco en lugar de control.', 'Perder la posicion neutra de la lumbar al cortar.'],
  variantes: ['S1-2: anti-rotacion pura (Pallof diagonal) sin girar. S3-4: chop de rango corto con banda ligera, pivotando los pies. S5-6: rango completo con banda media y control excentrico. S7+: banda fuerte, rango completo con pivote de cadera coordinado.'],
  notas_columna: 'El woodchop entrena el patron rotacional funcional, pero en una hernia L4-L5/L5-S1 la rotacion es segura solo si se disocia correctamente: el giro sale de la columna toracica (disenada para rotar) y de las caderas (pivote de pies), mientras la lumbar permanece neutra y estable. Por eso la progresion arranca en anti-rotacion (Pallof diagonal) y solo anade rango cuando el control es bueno. Pivotar los pies es clave: clavarlos obliga a la lumbar a absorber el giro. Reducir rango o volver a la version isometrica si el giro "baja" a la lumbar.'
};

EX_DB['bird-dog-banda-pie'] = {
  nombre: 'Bird-dog con banda en el pie (cuadrupedia)',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Variante del bird-dog en la que una banda elastica rodea un pie y se sujeta con la mano contraria (o se ancla), de modo que la resistencia se opone a la extension de la pierna. Se extienden simultaneamente el brazo y la pierna contrarios contra la banda, sumando trabajo de gluteo y cadena posterior al control de estabilidad del bird-dog.',
  posicion: 'Cuadrupedia: rodillas bajo las caderas, manos bajo los hombros, columna neutra. Banda rodeando un pie y sujeta por la mano contraria o anclada. Cuello largo, mirada al suelo.',
  pasos: [
    'Adopta la cuadrupedia con la columna neutra y el core activo.',
    'Coloca la banda rodeando un pie, sujeta por la mano contraria o anclada.',
    'Extiende simultaneamente el brazo y la pierna contrarios contra la resistencia de la banda.',
    'La banda resiste la extension de la pierna: controla el movimiento sin arquear la lumbar.',
    'Manten la pelvis nivelada y vuelve con control; alterna lados.',
    'Cuello largo y mirada al suelo durante toda la serie.',
  ],
  errores: ['Arquear la lumbar al extender la pierna contra la banda.', 'Elevar la pierna por encima de la cadera.', 'Rotar la pelvis al vencer la resistencia.', 'Levantar la barbilla para mirar al frente.'],
  variantes: ['S1-2: bird-dog sin banda dominando el patron. S3-4: banda ligera con recorrido parcial. S5-6: banda media con recorrido completo + pausa 2s. S7+: banda fuerte con excentrico lento.'],
  notas_columna: 'A diferencia del bird-dog resistido por el brazo (que enfatiza la anti-rotacion frente a una traccion frontal), aqui la banda resiste la extension de la pierna, lo que aumenta la activacion del gluteo y la cadena posterior mientras la columna debe permanecer neutra y estable. Sigue siendo un ejercicio sin carga axial, idoneo para L4-L5/L5-S1, con el mismo criterio: si aparece arqueo lumbar o irradiacion, reducir la banda o volver al bird-dog clasico.'
};

EX_DB['hip-thrust'] = {
  nombre: 'Hip thrust en banco',
  categoria: 'Gluteo',
  color: '#993C1D',
  descripcion: 'Ejercicio de activacion maxima del gluteo mayor en extension de cadera. Produce la mayor activacion EMG del gluteo de cualquier ejercicio, con minima carga lumbar.',
  posicion: 'Hombros apoyados en el borde de un banco, pies apoyados en el suelo, rodillas a 90 grados en la posicion alta. Barra o peso en las caderas.',
  pasos: [
    'Posicion inicial: hombros en el banco, cadera baja cerca del suelo.',
    'Activa el core — lumbar neutra.',
    'Empuja con los talones y aprieta el gluteo: eleva la cadera hasta que el tronco este horizontal.',
    'La pelvis NO debe inclinarse anteriorposterior en ningun momento.',
    'Pausa 1-2 segundos en la posicion alta apretando el gluteo al maximo.',
    'Baja lentamente controlando el excentrico.',
  ],
  errores: ['Hiperextension lumbar en la posicion alta — es el gluteo quien sube la cadera, no la espalda.', 'Rodillas que caen hacia dentro.', 'Pies demasiado lejos o cerca — la rodilla debe quedar a 90° arriba.'],
  variantes: ['S1-2: glute bridge bilateral isometrico 5s. S3-4: hip thrust bilateral sin barra, pausa 2s. S5-6: hip thrust unilateral PC. S7+: hip thrust bilateral con barra.'],
  notas_columna: 'El hip thrust produce la mayor activacion del gluteo mayor de cualquier ejercicio con la menor carga axial sobre la columna lumbar. Es el ejercicio de referencia para la cadena posterior en F2 porque la posicion horizontal del tronco elimina la carga compresiva discal.'
};

EX_DB['clamshell'] = {
  nombre: 'Clamshell con banda elastica',
  categoria: 'Gluteo medio',
  color: '#993C1D',
  descripcion: 'Activacion del gluteo medio en posicion lateral. Esencial para la estabilidad pelvica y la prevencion de la tendencia antalgica de desplazar el peso al lado sano.',
  posicion: 'Tumbado de lado con cadera y rodilla flexionadas a 45-60 grados. Cabeza apoyada.',
  pasos: [
    'Activa el core para estabilizar la pelvis — no debe moverse durante el ejercicio.',
    'Mantén los pies juntos y eleva la rodilla superior abriendo como una almeja.',
    'El rango debe ser comodo — sin rotacion de pelvis.',
    'Pausa 1-2 segundos arriba.',
    'Baja controlado — excentrico completo.',
  ],
  errores: ['Pelvis que rota hacia atras al abrir — limitar el rango.', 'Compensar con el tronco.'],
  variantes: ['S1-2: sin banda si genera irradiacion. S3-4: banda ligera. S5-6: banda media. S7+: banda fuerte + pausa 2s arriba.'],
  notas_columna: 'El gluteo medio debilitado en el lado izquierdo es frecuente en la presentacion antalgica con desplazamiento de carga. El clamshell lo activa en cadena cerrada lateral sin carga axial — ideal en F2.'
};

EX_DB['hollow-body'] = {
  nombre: 'Hollow body hold',
  categoria: 'Core calistenia',
  color: '#993C1D',
  descripcion: 'Posicion isometrica de calistenia que activa el core anterior de forma global. La columna lumbar permanece en flexion neutra activa durante toda la posicion.',
  posicion: 'Tumbado boca arriba. Zona lumbar pegada al suelo. Brazos extendidos sobre la cabeza.',
  pasos: [
    'Aplana la zona lumbar contra el suelo activamente.',
    'Eleva ligeramente los hombros y las piernas del suelo.',
    'Al elevar los hombros, lleva la barbilla suavemente hacia el pecho (doble menton) y dirige la mirada a los muslos: el cuello queda largo y la cabeza no cae hacia atras ni tira hacia el techo.',
    'Mantén la posicion con respiracion controlada.',
    'La lumbar NO debe despegarse del suelo en ningun momento.',
  ],
  errores: ['Lumbar separada del suelo — DETENER y reducir el rango.', 'Contener la respiracion.', 'Echar la cabeza hacia atras o tirar de la barbilla hacia el techo al elevar los hombros — sobrecarga los flexores cervicales (es la causa nº1 de tension de cuello en este ejercicio).', 'Sostener la cabeza solo con el cuello en lugar de elevarla desde el abdomen.'],
  variantes: ['S1-2: rodillas flexionadas 15s. S3-4: piernas a 45° 20s. S5-6: piernas a 30° 25s. S7+: piernas a 15° 30s. F3: hollow body hang en barra.', 'Cervical (regresion): manten cabeza y hombros APOYADOS en el suelo y trabaja solo el tren inferior (piernas elevadas / rodillas a 90°, estilo dead bug hold) hasta que el cuello tolere la elevacion. Alternativa: cruza las manos sobre el pecho o llevalas tras la nuca para sostener el peso de la cabeza y descargar el cuello.', 'Cervical (bloque de apoyo): coloca un bloque de yoga en su altura mas baja (o una toalla doblada encima para amortiguar) bajo la nuca, de modo que la cabeza descanse en neutro — oreja en linea con el hombro, sin que la barbilla se proyecte hacia arriba. Eleva los hombros solo lo justo para no perder el contacto con el apoyo; mirada a los muslos y lumbar pegada al suelo. Si el bloque queda alto y te empuja la barbilla hacia arriba (extension cervical), baja la altura o usa solo la toalla. Quita el apoyo cuando el cuello tolere la elevacion.'],
  notas_columna: 'La posicion hollow activa el transverso abdominal, el recto anterior y los oblicuos en sinergia. Con extrusion bilateral L4-L5 y L5-S1, la lumbar pegada al suelo es el criterio absoluto — una lumbar despegada genera presion discal posterior. Cervical: es el ejercicio de core con mas tension de cuello porque la cabeza se eleva sin apoyo; la elevacion debe partir del abdomen con barbilla hacia el pecho y mirada a los muslos. Si el cuello se carga, usar la regresion con cabeza apoyada antes que aguantar con tension.'
};

EX_DB['plank-anterior'] = {
  nombre: 'Plancha anterior',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Ejercicio isometrico de core en posicion prona sobre los codos. Activa el core global con especial enfasis en el transverso abdominal y el serrato anterior.',
  posicion: 'Apoyado sobre los codos y las puntas de los pies. Cuerpo en linea recta desde los talones hasta la cabeza.',
  pasos: [
    'Empuja los codos activamente contra el suelo.',
    'Activa el core: lumbar neutra — ni hundida ni elevada.',
    'Cuello largo y en linea con la columna: mira al suelo a unos 20-30 cm por delante de las manos, con la barbilla ligeramente metida. La cabeza no se hunde entre los hombros ni se eleva para mirar al frente.',
    'Aprieta los gluteos para estabilizar la pelvis.',
    'Respira con ritmo constante.',
  ],
  errores: ['Cadera que cae (lumbar hiperextendida) — el error mas comun.', 'Cadera demasiado elevada.', 'Levantar la cabeza para mirar al frente — hiperextiende la cervical y carga la nuca; la mirada va al suelo.', 'Dejar caer la cabeza entre los hombros y encoger los trapecios hacia las orejas — "empuja" el suelo alejando los hombros de las orejas.', 'Codos muy adelantados respecto a los hombros.'],
  variantes: ['S1-2: 20s sobre rodillas. S3-4: 30s completo. S5-6: 45s. S7+: elevacion alterna de pie.', 'Cervical: si el cuello se carga, acorta primero el tiempo y la palanca (variante sobre rodillas) manteniendo el cuello neutro, y baja activamente los hombros alejandolos de las orejas. Mejor 20s con cuello largo que 45s craneando la cabeza.'],
  notas_columna: 'La plancha anterior en codos es preferible a la plancha en manos en F2 porque el centro de gravedad mas bajo reduce la demanda lumbar. Con extrusion activa, la posicion prona puede generar molestia en algunos casos — evaluar individualmente. Cervical: en prono la tendencia es levantar la cabeza para mirar al frente (extension cervical sostenida) y encoger los trapecios; mantener la mirada al suelo y los hombros lejos de las orejas evita la tension de cuello.'
};

EX_DB['plank-hip-extension'] = {
  nombre: 'Plancha con extension de cadera activa',
  categoria: 'Core F2-F3',
  color: '#993C1D',
  descripcion: 'Variante dinamica de la plancha anterior: desde posicion de plancha sobre los codos, se eleva una pierna extendida hacia atras hasta la altura de la cadera. Combina anti-extension del core con activacion del gluteo y trabajo isometrico de los flexores de cadera de la pierna de apoyo.',
  posicion: 'Plancha anterior sobre codos. Lumbar neutra. Pelvis nivelada.',
  pasos: [
    'Adopta la posicion de plancha anterior: codos bajo los hombros, cuerpo en linea.',
    'Cuello largo y neutro: mirada al suelo por delante de las manos, barbilla ligeramente metida, hombros lejos de las orejas. No mires al frente.',
    'Activa el core y los gluteos antes de mover la pierna.',
    'Eleva una pierna extendida hacia atras hasta la altura de la cadera — no mas.',
    'Manten la pelvis horizontal: no dejes que rote ni se incline hacia el lado de la pierna elevada.',
    'Pausa 1-2 segundos arriba con gluteo apretado.',
    'Baja con control y repite el mismo lado o alterna.',
  ],
  errores: [
    'Arquear la lumbar al elevar la pierna — DETENER si ocurre.',
    'Pelvis que rota hacia la pierna elevada — limitar la altura de elevacion.',
    'Perder la tension del core durante el movimiento.',
    'Elevar la pierna por encima de la cadera — genera hiperextension lumbar.',
    'Levantar la cabeza para mirar al frente al subir la pierna — extiende la cervical; manten la mirada al suelo y el cuello neutro.',
  ],
  variantes: ['S1-2: desde rodillas, elevar pierna 10 cm 3x6 cada lado. S3-4: plancha completa, elevacion hasta 45° 3x8. S5-6: plancha completa, elevacion hasta horizontal 3x10. S7+: tobillera ligera o banda en tobillos 3x10.', 'Cervical: el esfuerzo de elevar la pierna tiende a "tirar" la cabeza hacia arriba; manten la barbilla metida y la nuca larga durante toda la serie. Si no puedes sostener el cuello neutro, vuelve a la variante sobre rodillas.'],
  notas_columna: 'La extension de cadera activa en plancha es exigente para la lumbar si se supera la horizontal — la pierna NO debe subir mas alla de la cadera con extrusion activa. La pierna de apoyo trabaja los flexores de cadera isometricamente, lo cual es el estimulo terapeutico principal para el psoas iliaco sin carga axial. Cervical: como en toda plancha, mantener la mirada al suelo y los hombros lejos de las orejas; el impulso de elevar la pierna no debe arrastrar la cabeza hacia la extension.'
};

EX_DB['hf-fall-back'] = {
  nombre: 'HF fall back (caida hacia atras en banco)',
  categoria: 'Flexores de Cadera F2-F3',
  color: '#7A3DAA',
  descripcion: 'Ejercicio de fuerza excentriica e isometrica para los flexores de cadera realizado sentado en el borde de un banco. La persona se inclina progresivamente hacia atras manteniendo una pierna extendida elevada sujeta con la mano, poniendo los flexores de cadera bajo tension en rango elongado. La variante con rodilla flexionada reduce la demanda pero permite mayor rango de inclinacion.',
  posicion: 'Sentado en el borde de un banco o caja. Tronco erguido. Una pierna extendida elevada por delante (sujeta con ambas manos bajo el muslo o el tobillo). La otra pierna con el pie apoyado en el suelo.',
  pasos: [
    'Sienta en el borde del banco con una pierna extendida y elevada — sujetala con las manos.',
    'Activa el core para estabilizar la lumbar antes de inclinarte.',
    'Inclinate lentamente hacia atras manteniendo la pierna elevada en la misma posicion.',
    'Llega hasta el angulo donde sientas la tension en el flexor de cadera de la pierna elevada.',
    'Manten la posicion 1-2 segundos y vuelve al inicio de forma controlada.',
    'Variante 2: misma mecanica pero con la rodilla flexionada a 90° — permite mayor inclinacion con menos tension.',
  ],
  errores: [
    'Soltar la pierna al inclinarse — siempre mantener la sujecion.',
    'Lumbar que se flexiona en exceso al caer hacia atras — el movimiento viene de la cadera, no de la columna.',
    'Inclinar demasiado rapido — el control excentrico es el objetivo principal.',
    'Elevar la pierna mas alla de lo que el flexor permite — compensacion con la lumbar.',
  ],
  variantes: [
    'S1-2: inclinacion minima 20-30°, pierna semiflexionada — solo isometrico 3x20s.',
    'S3-4: inclinacion 45°, pierna extendida — movimiento controlado 3x8 cada lado.',
    'S5-6: inclinacion 60°, pausa 2s en el punto de maxima tension 3x10.',
    'S7+: inclinacion maxima + variante con rodilla flexionada encadenadas 3x10.',
  ],
  notas_columna: 'El HF fall back es uno de los pocos ejercicios que carga el psoas iliaco y el recto femoral en rango elongado sin carga axial sobre la columna. Especialmente util en recuperacion de hernia discal L4-L5/L5-S1 porque el paciente esta sentado (descarga) y la lumbar se puede mantener neutra con control activo. Progresar muy gradualmente en el angulo de inclinacion.'
};

EX_DB['kb-hf-raise'] = {
  nombre: 'KB HF raise (elevacion de rodilla con kettlebell)',
  categoria: 'Flexores de Cadera F3',
  color: '#7A3DAA',
  descripcion: 'Ejercicio de fuerza para los flexores de cadera de pie sobre una plataforma (caja, step o escalon), con una kettlebell colgada del pie mediante una tobillera o un lazo. La elevacion de la rodilla hasta la altura de la cadera trabaja los flexores en rango concentrico y excentriico contra la carga de la KB. La plataforma es imprescindible para dar recorrido a la bajada.',
  posicion: 'De pie sobre una plataforma de 20-30 cm. Una mano apoyada en una barra o pared para equilibrio. KB colgada del pie de la pierna de trabajo mediante tobillera de carga o lazo seguro.',
  pasos: [
    'Sube a la plataforma. Asegura la KB al pie con la tobillera o el lazo.',
    'Ponte de pie erguido con el core activo. Apoya la mano libre en una barra.',
    'Eleva la rodilla de la pierna con KB hasta la altura de la cadera — movimiento controlado, sin balanceo.',
    'Pausa 1-2 segundos en la posicion alta con la rodilla flexionada.',
    'Baja con control excentrico — no dejes caer la pierna.',
    'Repite sin que la KB toque el suelo entre repeticiones.',
  ],
  errores: [
    'Balancear el torso para ayudar a subir — solo deben trabajar los flexores de la pierna de trabajo.',
    'No usar plataforma — sin ella el recorrido es insuficiente.',
    'KB mal sujeta — revisar el amarre antes de cada serie.',
    'Subir la rodilla mas alla de la horizontal — no aporta beneficio adicional y desestabiliza.',
    'Bajar demasiado rapido — el excentrico es fundamental.',
  ],
  variantes: [
    'S1-2: sin KB, solo elevacion de rodilla controlada con pausa 2s 3x12.',
    'S3-4: KB 4-6 kg, 3x10, excentrico 2s.',
    'S5-6: KB 8 kg, 3x8, excentrico 3s + pausa 2s arriba.',
    'S7+: KB 10-12 kg, 3x8, excentrico 3s + pausa 2s arriba.',
  ],
  notas_columna: 'La KB HF raise es la variante mas especifica de fortalecimiento del psoas iliaco y el recto femoral con carga externa directa. Al realizarse de pie y sin carga axial en la columna (la carga cuelga del pie), es compatible con fases intermedias de recuperacion discal. La plataforma es imprescindible para que la KB no toque el suelo y se mantenga la tension durante todo el recorrido.'
};

EX_DB['banded-hf-raise'] = {
  nombre: 'Banded HF raise (elevacion de rodilla con banda)',
  categoria: 'Flexores de Cadera F2-F3',
  color: '#7A3DAA',
  descripcion: 'Ejercicio de fuerza para los flexores de cadera con resistencia de banda elastica. Existen dos posiciones: (1) tumbado en un banco, donde la banda anclada al pie resiste la flexion de rodilla hacia el pecho; (2) de pie apoyado en un banco, donde la banda resiste la elevacion de rodilla. La banda proporciona resistencia variable y tension constante.',
  posicion: 'Posicion 1 (tumbado): tumbado en un banco con la banda anclada a un punto fijo a los pies. Banda unida al pie de la pierna de trabajo. Posicion 2 (de pie): de pie frente a un banco o barra, una mano apoyada, banda anclada baja detras y unida al pie de la pierna de trabajo.',
  pasos: [
    'POSICION TUMBADO: Tumba en el banco con la banda lista. Flexiona la rodilla llevandola hacia el pecho de forma controlada contra la resistencia de la banda. Pausa 1s arriba. Baja con control excentrico.',
    'POSICION DE PIE: De pie con la mano de apoyo. La banda tira del pie hacia atras. Eleva la rodilla hacia adelante y arriba hasta la altura de la cadera resistiendo la banda. Pausa 1s arriba. Baja con control.',
    'En ambas posiciones: core activo, lumbar neutra, sin compensar con el tronco.',
  ],
  errores: [
    'Compensar con el tronco para ayudar a subir la rodilla — solo trabajan los flexores de cadera.',
    'Banda con demasiada tension al inicio — comienza con banda ligera.',
    'No controlar el excentrico — dejar que la banda tire de la pierna.',
    'Pelvis que rota al elevar la rodilla (de pie) — fijar la pelvis activamente.',
  ],
  variantes: [
    'S1-2: tumbado, banda ligera, ROM parcial (rodilla a 90°) 3x10.',
    'S3-4: tumbado, banda media, ROM completo (rodilla al pecho) 3x10.',
    'S5-6: de pie, banda media, pausa 1s arriba 3x10.',
    'S7+: de pie, banda fuerte, pausa 2s + excentrico 3s 3x10.',
  ],
  notas_columna: 'La variante tumbada es la mas segura en fases tempranas porque elimina la carga axial y el riesgo de inestabilidad. La variante de pie es mas funcional y transfiere mejor al patron de marcha. La banda genera tension progresiva — maxima en el punto de maxima flexion, lo que entrena exactamente el rango debil del psoas en personas con acortamiento por sedestacion prolongada.'
};

EX_DB['hip-flexor-plank'] = {
  nombre: 'Hip flexor plank (plancha flexor cadera en banco)',
  categoria: 'Core + Flexores de Cadera F2-F3',
  color: '#993C1D',
  descripcion: 'Variante de plancha sobre banco donde una rodilla esta apoyada en el banco y la otra pierna queda suspendida en el aire. Desde esa posicion estable, se realiza un movimiento de flexion y extension de la pierna suspendida. La rodilla en el banco actua como fulcro y estabilizador pelvico, permitiendo un trabajo de los flexores de cadera de la pierna libre en un entorno de core activo.',
  posicion: 'Manos en el suelo en posicion de plancha alta (brazos extendidos). Una rodilla apoyada sobre el banco (colocado lateralmente al cuerpo). La otra pierna extendida y suspendida, sin tocar el suelo ni el banco.',
  pasos: [
    'Coloca las manos en el suelo y apoya una rodilla sobre el banco — el cuerpo queda en un plano inclinado.',
    'Activa el core: lumbar neutra, pelvis estabilizada.',
    'Flexiona la pierna suspendida llevando la rodilla hacia el pecho de forma controlada.',
    'Extiende de nuevo la pierna hacia atras hasta la posicion inicial.',
    'El tronco y la pelvis no deben moverse — solo la pierna libre.',
    'Completa las repeticiones de un lado antes de cambiar.',
  ],
  errores: [
    'Pelvis que rota o se inclina al mover la pierna — reducir el rango de movimiento.',
    'Lumbar que se arquea al extender la pierna — es el error critico con extrusion discal.',
    'Manos demasiado adelantadas respecto a los hombros — sobrecarga la zona lumbar.',
    'Levantar la cabeza para mirar al frente — manten el cuello neutro, mirada al suelo y hombros lejos de las orejas.',
    'Rodilla del banco que se desplaza — asegurar que el banco es estable.',
  ],
  variantes: [
    'S1-2: posicion estatica mantenida sin mover la pierna suspendida — solo isometrico 3x20s.',
    'S3-4: flexion parcial de rodilla (45°) 3x10 cada lado.',
    'S5-6: flexion completa (rodilla al pecho) + extension hasta horizontal 3x12.',
    'S7+: extension completa mas alla de la horizontal + tobillera ligera 3x10.',
  ],
  notas_columna: 'Este ejercicio es una progresion del bird dog en banco, con mayor demanda sobre los flexores de cadera de la pierna libre y mayor reto de estabilizacion. La inclinacion del cuerpo (manos en suelo, rodilla en banco) reduce la carga lumbar respecto a una plancha horizontal convencional. Contraindicado si la extension de la pierna genera irradiacion S1. Cervical: al estar en plancha alta con las manos en el suelo, vigila no dejar caer la cabeza ni encoger los trapecios — cuello largo y mirada al suelo.'
};

EX_DB['hanging-ball-raise'] = {
  nombre: 'Hanging ball raise (elevacion con pelota en barra)',
  categoria: 'Core + Flexores de Cadera F3',
  color: '#993C1D',
  descripcion: 'Ejercicio avanzado de core y flexores de cadera realizado colgado de una barra de dominadas. Se sujeta una pelota medicinal entre los pies y se elevan ambas rodillas hacia el pecho de forma controlada. Combina la fuerza de prension y la descompresion lumbar del colgado con la activacion intensa del psoas, el recto femoral y el core anterior.',
  posicion: 'Colgado de una barra de dominadas con agarre prono, anchura de hombros. Pelota medicinal sujeta entre los pies (entre los tobillos o entre los empeines). Cuerpo en ligera retroversion pelvica (hollow suave).',
  pasos: [
    'Sube a la barra y cuelgate con los brazos extendidos.',
    'Coloca la pelota medicinal entre los pies — que quede bien sujeta antes de soltar el apoyo.',
    'Activa el core: pelvis en ligera retroversion, lumbar no en hiperlordosis.',
    'Eleva ambas rodillas hacia el pecho de forma controlada — no balancees el cuerpo.',
    'Pausa 1 segundo con las rodillas en la posicion mas alta.',
    'Baja con control excentrico completo — no dejes caer las piernas.',
    'PARAR si irradiacion S1 al colgarse o al elevar las piernas.',
  ],
  errores: [
    'Balancear el cuerpo para ayudar a elevar las rodillas — solo deben trabajar el core y los flexores de cadera.',
    'Soltar la pelota entre repeticiones — riesgo de caida.',
    'Pelvis en hiperlordosis al elevar — la retroversion es el criterio de seguridad lumbar.',
    'Irradiacion S1 al colgarse — SUSPENDER el ejercicio.',
    'Bajar las piernas demasiado rapido — el excentrico es fundamental.',
  ],
  variantes: [
    'S1-2: solo elevacion de rodillas sin pelota — tuck raise 3x8.',
    'S3-4: pelota 2-3 kg, elevacion de rodillas 3x8.',
    'S5-6: pelota 4-5 kg, pausa 1s arriba 3x8.',
    'S7+: pelota 6-8 kg, excentrico lento 3-4s 3x8.',
  ],
  notas_columna: 'El colgado descomprime los segmentos L4-L5 y L5-S1 de forma pasiva. Al anadir la elevacion de rodillas con pelota, se convierte en un ejercicio doble: descompresion + fuerza de flexores de cadera. Con extrusion activa, no introducir hasta S5 o superior y siempre evaluar si el colgado genera o alivia los sintomas antes de anadir la carga de la pelota.'
};

EX_DB['bulgarian-split-squat'] = {
  nombre: 'Bulgarian split squat',
  categoria: 'Fuerza Bilateral / Flexor Cadera F3',
  color: '#7A3DAA',
  descripcion: 'Variante de sentadilla unilateral con el pie trasero elevado sobre una plataforma baja y el pie delantero apoyado sobre un disco de peso. El descenso vertical de la cadera carga el cuadriceps y el gluteo del lado delantero mientras estira intensamente el flexor de cadera (psoas e iliaco) del lado trasero. La combinacion pie en plataforma + pie delantero en disco aumenta la demanda de estabilizacion del tobillo y la cadera.',
  posicion: 'De pie con el pie trasero elevado sobre una plataforma baja (15-20 cm). El pie delantero sobre un disco de peso plano (5-10 cm de elevacion frontal). Distancia entre pies: la suficiente para que en el fondo la rodilla delantera no supere la punta del pie. Tronco erguido.',
  pasos: [
    'Establece la posicion: pie trasero en la plataforma baja, pie delantero centrado sobre el disco.',
    'Coge las mancuernas en posicion neutra (a los lados) o en goblet (frente al pecho).',
    'Activa el core antes de iniciar el descenso.',
    'Desciende verticalmente controlando la rodilla delantera en tracking sobre el 2° dedo del pie.',
    'La rodilla trasera desciende hacia el suelo — sin tocarlo.',
    'Siente la tension del flexor de cadera trasero en el fondo del recorrido.',
    'Sube empujando con el talon delantero y apretando el gluteo.',
    'Excentrico de 3 segundos en el descenso.',
  ],
  errores: [
    'Rodilla delantera que cae hacia adentro (valgo) — activar el gluteo medio.',
    'Tronco que se inclina excesivamente hacia adelante — perder trabajo de gluteo.',
    'Pie trasero en posicion inestable — asegurar el apoyo antes de cada serie.',
    'Subir con impulso — el excentrico controlado es el objetivo.',
    'Disco demasiado alto para el nivel — empezar con disco plano o sin disco.',
  ],
  variantes: [
    'S1-2: solo peso corporal, sin disco ni plataforma, ROM parcial (60°).',
    'S3-4: peso corporal, pie trasero en plataforma, ROM completo.',
    'S5-6: mancuernas 6-8 kg c/u, pie delantero en disco, excentrico 3s.',
    'S7+: mancuernas 10-14 kg c/u, pausa 2s en el fondo + excentrico 3s.',
  ],
  notas_columna: 'El Bulgarian split squat es uno de los ejercicios mas eficientes para combinar fuerza de cuadriceps y gluteo con estiramiento activo del psoas contralateral. La elevacion del pie delantero sobre el disco aumenta el rango de dorsiflexion del tobillo, lo que permite un descenso mas vertical y menos estres lumbar que la sentadilla convencional. Contraindicado en fases tempranas con irradiacion activa — introducir a partir de S5 sin dolor.'
};

EX_DB['long-lunge'] = {
  nombre: 'Long lunge (estocada profunda con carga)',
  categoria: 'Flexores de Cadera + Movilidad F3',
  color: '#7A3DAA',
  descripcion: 'Estocada profunda donde se mantiene la posicion baja durante toda la serie, con carga en las manos (mancuernas o barra con discos). El nombre "long" hace referencia tanto a la longitud del paso (paso largo) como a la duracion de la posicion sostenida. Combina estiramiento activo del flexor de cadera trasero, fuerza del cuadriceps y gluteo delantero, y exigencia de control lumbar bajo carga.',
  posicion: 'De pie. Un paso largo hacia adelante hasta quedar en estocada profunda: rodilla delantera a 90°, rodilla trasera cerca del suelo. Tronco erguido. Carga en ambas manos (mancuernas a los lados o barra con discos sujeta delante).',
  pasos: [
    'Da un paso largo hacia adelante y baja hasta la posicion de estocada profunda.',
    'Rodilla trasera cerca del suelo — sin apoyarla.',
    'Tronco erguido — la carga en las manos actua como contrapeso que ayuda a mantener el equilibrio.',
    'Siente la tension en el flexor de cadera de la pierna trasera.',
    'Mantén la posicion el tiempo o las repeticiones indicadas.',
    'Para las variantes dinamicas: sube y vuelve a bajar de forma controlada.',
    'PARAR si irradiacion S1 al mantener la posicion baja.',
  ],
  errores: [
    'Paso demasiado corto — la rodilla delantera supera la punta del pie y reduce el trabajo del gluteo.',
    'Tronco que se inclina hacia adelante — perder la tension en el flexor de cadera trasero.',
    'Rodilla trasera que golpea el suelo sin control.',
    'Carga demasiado elevada para el nivel de estabilizacion lumbar actual.',
    'Irradiacion S1 al bajar — SUSPENDER.',
  ],
  variantes: [
    'S1-2: sin carga, posicion sostenida 3x20s cada lado, rodilla trasera en el suelo como apoyo.',
    'S3-4: sin carga, posicion sostenida 3x20s, rodilla trasera suspendida.',
    'S5-6: mancuernas 4-6 kg c/u, 3x10 cada lado.',
    'S7+: mancuernas 8-12 kg c/u o barra con discos, 3x10 + pausa 3s abajo.',
  ],
  notas_columna: 'El long lunge es un estiramiento activo de alta intensidad para el psoas iliaco en rango elongado. La carga en las manos no solo aumenta la dificultad sino que actua como ancla que mantiene el tronco erguido, mejorando la eficacia del estiramiento del flexor de cadera trasero. En personas con hiperlordosis lumbar asociada al acortamiento del psoas, este ejercicio aborda directamente la causa mecanica del patron doloroso.'
};

EX_DB['hip-flexor-pike'] = {
  nombre: 'Hip flexor pike (pike flexor cadera en banco)',
  categoria: 'Core + Flexores de Cadera F2-F3',
  color: '#993C1D',
  descripcion: 'Variante de plancha en banco donde se combina la elevacion de cadera (movimiento pike) con la extension de una pierna libre hacia arriba. Una rodilla permanece apoyada en el banco como punto de estabilizacion, mientras la otra pierna se extiende. El movimiento sincrona flexion de cadera de la pierna de apoyo con extension de la pierna libre, creando un patron de anti-extension avanzado.',
  posicion: 'Manos en el suelo en plancha alta. Una rodilla apoyada en el banco (estabilizador). La otra pierna extendida, paralela al suelo. Lumbar neutra al inicio.',
  pasos: [
    'Desde la posicion inicial (plancha con rodilla en banco, pierna libre extendida), activa el core.',
    'Eleva la cadera hacia arriba (movimiento pike) al mismo tiempo que extiendes la pierna libre hacia el techo.',
    'La rodilla del banco permanece en contacto con el banco durante todo el movimiento.',
    'En el punto alto: cadera elevada, pierna libre apuntando hacia el techo, cuerpo formando una L invertida.',
    'Baja de forma controlada volviendo a la posicion inicial de plancha.',
    'No arquear la lumbar al volver a la posicion baja.',
  ],
  errores: [
    'Arquear la lumbar en la posicion baja — es el error critico, genera presion discal posterior.',
    'Rotar la pelvis al elevar la pierna libre — mantener las caderas alineadas.',
    'Elevar la pierna libre demasiado rapido usando inercia — el movimiento debe ser controlado.',
    'Forzar el cuello mirando entre las manos en el pike — deja que la cabeza siga a la columna sin tensar la nuca.',
    'Rodilla del banco que se desplaza durante el pike — asegurar la posicion inicial.',
    'No llegar a la posicion pike completa en fases tempranas — progresar gradualmente.',
  ],
  variantes: [
    'S1-2: solo elevacion de cadera (sin pierna extendida) — pike parcial con ambas rodillas en banco 3x8.',
    'S3-4: pike con pierna libre extendida a 45° 3x8 cada lado.',
    'S5-6: pike completo, pierna libre vertical, pausa 1s arriba 3x10.',
    'S7+: pike completo + pausa 2s + descenso excentrico 3s 3x10.',
  ],
  notas_columna: 'El hip flexor pike es una de las progresiones mas funcionales del trabajo de flexores de cadera en cadena cerrada parcial. La posicion invertida (cadera sobre hombros en el punto alto) descomprime brevemente la columna lumbar durante el movimiento, lo que puede generar alivio si el dolor es de componente compresivo. La dificultad principal es mantener la lumbar neutra en el descenso — si esto falla, volver a la variante anterior. Cervical: en el punto alto, el peso se reparte hacia los hombros; no fuerces el cuello hacia el pecho ni cargues la cabeza — manten el cuello neutro y los hombros activos lejos de las orejas.'
};

// ─── NUEVOS EJERCICIOS — MOVILIDAD CADERA ─────────────────────────

EX_DB['split-squat-banco'] = {
  nombre: 'Split Squat con carga en banco',
  categoria: 'Movilidad de Cadera',
  color: '#7A3DAA',
  descripcion: 'Ejercicio de estocada profunda con el pie trasero elevado en un banco. Combina movilidad de la articulacion de cadera delantera (flexion profunda) con estiramiento activo del iliopsoas del lado trasero. Permite mayor carga que el lunge convencional con menor desplazamiento de centro de gravedad.',
  posicion: 'De pie de espaldas a un banco. Pie trasero colocado sobre el banco (empeine o puntas de pie segun nivel). Pie delantero avanzado lo suficiente para que la rodilla no supere la punta del pie en el fondo.',
  pasos: [
    'Establece la posicion: pie trasero en el banco, pie delantero avanzado, tronco erguido.',
    'Activa el core antes de iniciar el descenso.',
    'Desciende verticalmente controlando la rodilla delantera (tracking sobre el segundo dedo del pie).',
    'La rodilla trasera desciende hacia el suelo sin tocarlo.',
    'El tronco se mantiene erguido o ligeramente inclinado hacia adelante (no mas de 15°).',
    'En el fondo, sentir la tension en el flexor de cadera trasero y en el cuadriceps delantero.',
    'Sube empujando con el talon delantero, activando el gluteo.',
  ],
  errores: [
    'Rodilla delantera que cae hacia adentro — activar el gluteo medio para evitarlo.',
    'Tronco que se inclina excesivamente hacia adelante — pierde el trabajo de gluteo.',
    'Pie trasero que resbala — banco con superficie antideslizante.',
    'Ascender demasiado rapido sin control — el excentrico es la mitad del trabajo.',
  ],
  variantes: [
    'S1-2: solo peso corporal ROM parcial (60°).',
    'S3-4: peso corporal ROM completo.',
    'S5-6: mancuernas 5-8 kg c/u en posicion goblet o laterales.',
    'S7+: mancuernas 10-14 kg c/u + pausa 2s en el fondo.',
    'F3: barra en rack posterior — el clasico Bulgarian Split Squat.',
  ],
  notas_columna: 'El split squat en banco es la alternativa mas segura a la sentadilla convencional en F2 con hernia lumbar activa porque la base de sustentacion asimetrica distribuye la carga lejos del eje de la columna. La elevacion del pie trasero aumenta el rango de flexion de cadera delantera sin incrementar la carga axial. El flexor de cadera trasero se estira activamente — util para el psoas izquierdo frecuentemente acortado en antalgica.'
};

EX_DB['flexion-cadera-maquina'] = {
  nombre: 'Flexion profunda de cadera en maquina',
  categoria: 'Movilidad de Cadera',
  color: '#7A3DAA',
  descripcion: 'Ejercicio de flexion de cadera asistida en maquina especifica. Permite trabajar el rango profundo de flexion de cadera (mas alla de 90°) con resistencia controlada y reproducible, sin la variable de estabilidad del ejercicio libre.',
  posicion: 'Sentado en la maquina segun el protocolo especifico del equipo. Generalmente: respaldo reclinado, pierna a trabajar fijada en el brazo de palanca de la maquina.',
  pasos: [
    'Ajustar la maquina al rango objetivo: comenzar con limitador en 90°.',
    'Lumbar en contacto con el respaldo — no despegar la zona lumbar al final del rango.',
    'Flexionar la cadera de forma controlada hasta el tope del rango disponible.',
    'Pausa 1-2s en el punto mas profundo.',
    'Retorno controlado — no dejar caer la pierna.',
    'PARAR si hay dolor en la ingle o irradiacion hacia el muslo.',
  ],
  errores: [
    'Despegar la zona lumbar al final del rango — limitar el rango antes de que ocurra.',
    'Usar momentum al retornar.',
    'Carga excesiva que impide el control de la posicion lumbar.',
  ],
  variantes: [
    'S1-2: carga muy ligera ROM 60-80°.',
    'S3-4: carga ligera ROM 90°+.',
    'S5-6: carga media ROM completo exc 2s.',
    'S7+: carga media-alta pausa 1s en flexion maxima.',
  ],
  notas_columna: 'La maquina de flexion de cadera permite cuantificar y progresar el rango de flexion de cadera de forma objetiva. En personas con hernia lumbar, la limitacion del rango de flexion de cadera (menor de 100-110°) es frecuente y contribuye a la compensacion lumbar en movimientos del dia a dia como sentarse o agacharse.'
};

EX_DB['movilidad-abductores-suelo'] = {
  nombre: 'Movilidad de abductores en suelo',
  categoria: 'Movilidad de Cadera',
  color: '#7A3DAA',
  descripcion: 'Estiramiento activo de los abductores (gluteo medio, TFL, tensor de fascia lata) en posicion lateral en el suelo. El apoyo del brazo inferior permite controlar la inclinacion de la pelvis durante el movimiento.',
  posicion: 'Tumbado de lado. Pierna inferior flexionada ligeramente para estabilizar. Brazo inferior extendido como apoyo. Cuerpo alineado.',
  pasos: [
    'Posicion neutra: cuerpo alineado de lado, pelvis estable.',
    'Eleva la pierna superior extendida hacia el techo — trabajando activamente el abductor.',
    'Mantén la pelvis nivelada — no dejar que se incline.',
    'Baja controlado sin dejar que la pierna toque completamente la inferior.',
    'Variante estiramiento: llevar la pierna superior hacia adelante por encima de la inferior (cruzando) para estirar el TFL.',
  ],
  errores: [
    'Pelvis que rota hacia atras al elevar la pierna.',
    'Elevar demasiado — compensacion desde la columna lumbar.',
    'No mantener la pierna extendida — flexionar la rodilla reduce la activacion del TFL.',
  ],
  variantes: [
    'S1-2: estiramiento pasivo en suelo sin movimiento 45s.',
    'S3-4: elevacion activa 10 rep + hold 20s.',
    'S5-6: elevacion con banda resistencia ligera.',
    'S7+: elevacion + circunduccion 5 rep lenta.',
  ],
  notas_columna: 'El TFL y la banda iliotibial frecuentemente se tensan en respuesta al dolor lumbar como mecanismo de proteccion. La movilidad de abductores en suelo es un ejercicio de bajo riesgo que puede realizarse en dias de alta sensibilidad lumbar como alternativa a ejercicios de pie.'
};

EX_DB['estocada-lateral-kb'] = {
  nombre: 'Estocada lateral con carga (kettlebell)',
  categoria: 'Movilidad de Cadera',
  color: '#7A3DAA',
  descripcion: 'Ejercicio de apertura lateral de cadera con carga. Trabaja la movilidad en el plano frontal (adduccion-abduccion), fortalece el gluteo medio y los adductores, y entrena el patron de estabilizacion lateral de rodilla.',
  posicion: 'De pie con pies separados a 1.5-2 anchos de hombros. KB sostenido con dos manos a la altura del pecho (goblet) o a un lado (sujetado con la mano del lado de trabajo).',
  pasos: [
    'Pies separados ampliamente, puntas ligeramente hacia afuera (30°).',
    'Mantén el tronco erguido durante todo el movimiento.',
    'Desplaza el peso hacia un lado flexionando esa rodilla — la otra pierna queda extendida.',
    'La rodilla flexionada tracking sobre el pie (no caer hacia adentro).',
    'En el fondo, sentir el estiramiento en la cara interna del muslo de la pierna extendida.',
    'Regresa a la posicion central activando el gluteo.',
    'Alterna lados con control.',
  ],
  errores: [
    'Tronco que se inclina lateralmente — el tronco debe permanecer vertical.',
    'Rodilla que cae hacia adentro — activar gluteo medio.',
    'Pie de la pierna extendida que se levanta — ambas plantas deben permanecer en el suelo.',
    'Usar momentum — el movimiento debe ser lento y controlado.',
  ],
  variantes: [
    'S1-2: sin carga — lateral bodyweight ROM parcial.',
    'S3-4: sin carga ROM completo.',
    'S5-6: KB 8-12 kg goblet.',
    'S7+: KB 16-20 kg goblet + pausa 2s abajo.',
    'F3: KB en rack bilateral.',
  ],
  notas_columna: 'La estocada lateral entrena la cadena cinetica del plano frontal que frecuentemente es deficitaria en personas con dolor lumbar cronico — patron de movimiento raramente utilizado en la vida sedentaria. El trabajo en plano frontal activa el gluteo medio ipsilateral y los adductores contralaterales, mejorando la estabilidad pelvica lateral.'
};

// ─── NUEVOS EJERCICIOS — MOVILIDAD ESPALDA ───────────────────────

EX_DB['ext-toracica-cuadrupedia'] = {
  nombre: 'Extension toracica en cuadrupedia',
  categoria: 'Movilidad de Espalda',
  color: '#1A6E8A',
  descripcion: 'Ejercicio de rotacion y extension de la columna toracica en posicion cuadrupeda. Activa la musculatura rotadora toracica (multifidos, semispinalis) y mejora la apertura del torax, reduciendo la demanda compensatoria sobre la zona lumbar.',
  posicion: 'A cuatro patas. Rodillas bajo las caderas, manos bajo los hombros. Columna en posicion neutra.',
  pasos: [
    'Coloca una mano detras de la cabeza (codo apuntando al suelo).',
    'La otra mano se mantiene en el suelo como apoyo estable.',
    'Rota la columna toracica llevando el codo hacia el techo.',
    'La cabeza sigue el movimiento del codo — mirar hacia el techo al final.',
    'La pelvis y la zona lumbar permanecen completamente estaticas.',
    'Vuelve lentamente a la posicion neutra.',
    'Repite en el otro lado.',
  ],
  errores: [
    'La pelvis rota o la cadera se desplaza — la rotacion es solo toracica.',
    'La cabeza se adelanta sin seguir al tronco — desconexion cervicotoracica.',
    'Rango excesivo forzado — solo el rango natural de la toracica.',
  ],
  variantes: [
    'S1-2: rotacion minima 30-40°.',
    'S3-4: rotacion media 60°.',
    'S5-6: rotacion completa con pausa 2s.',
    'S7+: rotacion completa + extension de brazo y pierna opuesta.',
  ],
  notas_columna: 'La rigidez toracica es uno de los factores contribuyentes al dolor lumbar cronico — cuando la columna toracica no rota adecuadamente, la zona lumbar compensa. La movilidad toracica en cuadrupedia mejora la funcion de los segmentos T4-T12 sin generar carga sobre L4-S1.'
};

EX_DB['ext-toracica-fitball'] = {
  nombre: 'Extension toracica sobre fitball',
  categoria: 'Movilidad de Espalda',
  color: '#1A6E8A',
  descripcion: 'Ejercicio de movilidad pasiva de la columna toracica utilizando la curva del fitball como fulcro. La gravedad produce una extension suave y progresiva de los segmentos T4-T10, aumentando el rango de extension toracica.',
  posicion: 'Sentado frente al fitball. Colocar el fitball bajo la zona media de la espalda (T5-T8). Pies apoyados en el suelo, rodillas a 90 grados.',
  pasos: [
    'Apoya la zona toracica media sobre el fitball — NO la zona lumbar.',
    'Brazos cruzados en el pecho (inicio) o manos en la nuca (progression).',
    'Deja que la gravedad extienda la columna sobre la curva del fitball.',
    'El movimiento es pasivo — no forzar, dejar que ocurra con la respiracion.',
    'Exhala profundamente para facilitar la extension.',
    'Mantén 30-60 segundos en la posicion maxima comoda.',
    'Vuelve lentamente incorporandote con el core activo.',
  ],
  errores: [
    'Fitball bajo la zona lumbar — riesgo de hiperextension lumbar.',
    'Forzar el rango — la extension debe ser pasiva y progresiva.',
    'Cabeza colgando sin soporte — si hay molestia cervical, apoyar la cabeza.',
    'Variante de brazos extendidos (protraccion overhead, S5+): el brazo de palanca largo puede arrastrar la extension a la lumbar — mantener el fitball en T4-T8, nunca dejarlo bajar de T8.',
  ],
  variantes: [
    'S1-2: brazos cruzados en pecho — extension minima.',
    'S3-4: manos en nuca — extension media.',
    'S5-6: brazos extendidos hacia atras — extension completa.',
    'S7+: extension completa + pequeñas oscilaciones de 2cm para movilizar segmento a segmento.',
  ],
  notas_columna: 'La extension toracica pasiva sobre fitball moviliza los segmentos T4-T10 que con frecuencia muestran restriccion en postura de flexion prolongada (trabajo de escritorio, conduccion). La mejora de la extension toracica reduce la cifosis compensatoria que aumenta la tension en la charnela thoracolumbar.'
};

EX_DB['movilidad-toracica-banco'] = {
  nombre: 'Movilidad toracica en banco',
  categoria: 'Movilidad de Espalda',
  color: '#1A6E8A',
  descripcion: 'Apertura de pecho y movilizacion de la columna toracica utilizando un banco como punto de apoyo para los codos. El descenso del tronco crea una palanca que moviliza los segmentos T5-T10 en extension y los hombros en flexion.',
  posicion: 'Arrodillado frente a un banco. Codos apoyados sobre el banco a la anchura de los hombros. Manos juntas o en oraracion.',
  pasos: [
    'Codos sobre el banco, manos juntas.',
    'Deja caer el pecho hacia el suelo manteniendo las caderas sobre las rodillas.',
    'La cadera actua como punto de pivote — no desplazar hacia atras.',
    'En el fondo: sentir el estiramiento en la zona toracica media y en los dorsales.',
    'Mantén 3-5 segundos en el fondo.',
    'Regresa activando el core.',
  ],
  errores: [
    'Caderas que se desplazan hacia atras — pierde la apertura toracica.',
    'Lumbar que se hiperextiende — limitar el rango.',
    'Codos que se abren excesivamente — mantener anchura de hombros.',
  ],
  variantes: [
    'S1-2: caida pasiva con apoyo de codos — rango minimo.',
    'S3-4: caida con pausa 3s en fondo.',
    'S5-6: caida completa + extension activa desde la posicion mas baja.',
    'S7+: agregar banda en el cuello escapular para apertura guiada.',
  ],
  notas_columna: 'Este ejercicio moviliza simultaneamente la columna toracica en extension y la articulacion del hombro en flexion elevada — patron deficitario en personas con postura en cifosis. La posicion reduce la carga lumbar a cero durante el ejercicio.'
};

EX_DB['flexion-extension-cuadrupedia'] = {
  nombre: 'Flexion con extension en cuadrupedia (Cat-Cow toracico)',
  categoria: 'Movilidad de Espalda',
  color: '#1A6E8A',
  descripcion: 'Movimiento dinamico de flexion y extension de la columna toracica en cuadrupedia. A diferencia del cat-cow convencional, la version toracica busca aislar el movimiento en T1-T12 manteniendo la zona lumbar y la pelvis estaticas.',
  posicion: 'A cuatro patas. Rodillas bajo las caderas, manos bajo los hombros. Columna neutra.',
  pasos: [
    'FASE FLEXION (cat toracico): redondea solo la zona toracica — cifosis exagerada. Las escapulas se abren. La cabeza cae suavemente.',
    'La pelvis y la zona lumbar permanecen completamente ESTATICAS durante toda la flexion.',
    'FASE EXTENSION (cow toracico): extiende solo la zona toracica — lordosis toracica suave. Las escapulas se acercan. La cabeza se eleva suavemente.',
    'La pelvis y la zona lumbar permanecen ESTATICAS durante toda la extension.',
    'Ritmo lento: 3 segundos en cada extremo.',
    'Si la lumbar se mueve, reducir el rango hasta que no lo haga.',
  ],
  errores: [
    'Lumbar que participa en el movimiento — el movimiento debe ser solo toracico.',
    'Ritmo demasiado rapido — el movimiento lento es el que moviliza.',
    'Tension cervical — la cabeza sigue al tronco sin tension activa.',
  ],
  variantes: [
    'S1-2: movimiento minimo — observar donde hay rigidez.',
    'S3-4: rango completo ritmo lento 3s por fase.',
    'S5-6: rango completo + pausa 2s en cada extremo.',
    'S7+: anadir rotacion alternada de cadera en el extremo de extension.',
  ],
  notas_columna: 'El cat-cow toracico aislado es mas terapeutico que el cat-cow convencional porque evita la carga de flexion-extension repetida sobre L4-S1. La movilizacion segmentaria de T1-T12 mejora la distribucion de fuerzas a lo largo de toda la columna y reduce la carga concentrada en la zona lumbar.'
};

// ─── NUEVOS EJERCICIOS — ESTABILIDAD Y FOAM ROLLER ────────────────

EX_DB['squat-unilateral-fr'] = {
  nombre: 'Sentadilla en apoyo unilateral con Foam Roller',
  categoria: 'Estabilidad y Fuerza',
  color: '#993C1D',
  descripcion: 'Sentadilla unilateral sobre una superficie inestable (Foam Roller colocado longitudinalmente bajo el pie). La inestabilidad activa la cadena propioceptiva del tobillo, rodilla y cadera de forma mas intensiva que la superficie plana.',
  posicion: 'De pie. Foam Roller colocado longitudinalmente bajo el pie de trabajo. Otro pie libre en el aire o con contacto suave.',
  pasos: [
    'Posicion inicial: pie sobre el FR, tronco erguido, brazos extendidos al frente para el equilibrio.',
    'Activa el core antes del descenso.',
    'Desciende lentamente (3 seg) flexionando la rodilla sobre el FR.',
    'La rodilla tracking sobre el segundo dedo del pie — no caer hacia adentro.',
    'Fondo: segun el nivel, entre 60-90° de flexion de rodilla.',
    'Sube empujando con el talon, activando gluteo.',
  ],
  errores: [
    'Rodilla que cae hacia adentro — valgus de rodilla: signo de debilidad del gluteo medio.',
    'Tronco que se inclina excessivamente hacia adelante.',
    'Velocidad excesiva en el descenso — perder el control del FR.',
  ],
  variantes: [
    'S1-2: apoyo bilateral con FR como referencia tactil.',
    'S3-4: unilateral parcial ROM 60°.',
    'S5-6: unilateral ROM completo.',
    'S7+: unilateral ROM completo + pausa 2s abajo.',
  ],
  notas_columna: 'La superficie inestable del FR activa la musculatura estabilizadora del tobillo, rodilla y cadera significativamente mas que la superficie plana. Esto mejora el control motor en la cadena inferior, que es prerequisito para la vuelta segura a ejercicios de carga como la prensa y el squat.'
};

EX_DB['hip-mob-cuadrupedia-fr'] = {
  nombre: 'Movilidad y activacion de cadera en cuadrupedia con Foam Roller',
  categoria: 'Estabilidad y Fuerza',
  color: '#993C1D',
  descripcion: 'Ejercicio de circunduccion de cadera en cuadrupedia sobre Foam Roller. La inestabilidad del FR bajo las rodillas activa el core profundo y los flexores de cadera mientras se trabaja la movilidad articular.',
  posicion: 'A cuatro patas con el Foam Roller colocado transversalmente bajo ambas rodillas. Manos en el suelo bajo los hombros.',
  pasos: [
    'Estabilizar la posicion sobre el FR — encontrar el equilibrio antes de mover.',
    'Activa el core: pelvis neutra.',
    'Eleva una rodilla del FR hacia un lado (abduccion) lentamente.',
    'Circunduce la cadera describiendo un circulo controlado.',
    'La pelvis NO debe rotar ni inclinarse durante el movimiento.',
    'PARAR si la pelvis no puede mantenerse neutra — reducir el radio del circulo.',
  ],
  errores: [
    'Pelvis que rota o se inclina durante la circunduccion — reducir el radio.',
    'Movimiento demasiado rapido — la inestabilidad requiere control lento.',
    'Apoyar demasiado peso en las manos — las manos son guia, no soporte principal.',
  ],
  variantes: [
    'S1-2: solo elevacion sin circunduccion.',
    'S3-4: circunduccion pequeña 5cm radio.',
    'S5-6: circunduccion media 10cm radio con control pelvico total.',
    'S7+: circunduccion completa + pausa 2s en cada punto cardinal.',
  ],
  notas_columna: 'La combinacion de inestabilidad del FR + movilidad de cadera entrena simultaneamente la estabilizacion del core y la movilidad articular — dos deficit frecuentes en la hernia lumbar. La exigencia propioceptiva es alta: introducir progresivamente.'
};

EX_DB['glute-bridge-fr'] = {
  nombre: 'Puente de gluteo con apoyo en Foam Roller',
  categoria: 'Estabilidad y Fuerza',
  color: '#993C1D',
  descripcion: 'Puente de gluteo con los talones sobre el Foam Roller. La inestabilidad del FR bajo los talones activa los isquiotibiales como estabilizadores (funcion de control tibial) ademas de su funcion como flexores de rodilla, aumentando la demanda sobre la cadena posterior.',
  posicion: 'Tumbado boca arriba. Talones apoyados sobre el Foam Roller (colocado transversalmente). Brazos a los lados del cuerpo.',
  pasos: [
    'Estabilizar los talones sobre el FR antes de subir.',
    'Activa el core — zona lumbar neutra.',
    'Empuja con los talones sobre el FR y activa el gluteo: eleva la cadera.',
    'La pelvis debe subir nivelada — no caer de lado.',
    'Pausa 2 seg en la cima — apretando el gluteo al maximo.',
    'Baja controlado — el FR no debe rodar hacia los lados.',
  ],
  errores: [
    'Pelvis que cae de lado en el punto alto — signo de asimetria de gluteo.',
    'FR que se desplaza — talones no controlados.',
    'Usar la espalda para compensar en lugar del gluteo.',
  ],
  variantes: [
    'S1-2: bilateral con FR fijo (pisado con ambos pies juntos).',
    'S3-4: bilateral con FR libre sobre talones.',
    'S5-6: unilateral — un pie sobre FR, otro en el aire.',
    'S7+: unilateral + pausa 3s arriba.',
  ],
  notas_columna: 'La inestabilidad del FR convierte el puente de gluteo estandar en un ejercicio de control motor de la cadena posterior. La exigencia sobre los isquiotibiales como estabilizadores del FR es especialmente util para la integridad del segmento L5-S1.'
};

EX_DB['plank-fr'] = {
  nombre: 'Plancha abdominal sobre Foam Roller',
  categoria: 'Estabilidad y Fuerza',
  color: '#993C1D',
  descripcion: 'Plancha con los codos apoyados sobre el Foam Roller. La inestabilidad anteroposterior del FR activa el serrato anterior y el core profundo de forma significativamente mayor que la plancha en suelo plano.',
  posicion: 'Codos apoyados sobre el Foam Roller (transversal). Cuerpo en linea desde los talones hasta la cabeza. Pies en el suelo.',
  pasos: [
    'Apoya los codos sobre el FR y encuentra el equilibrio.',
    'Activa el core: lumbar neutra — ni hundida ni elevada.',
    'Aprieta los gluteos para estabilizar la pelvis.',
    'El FR tiende a rodar hacia adelante o atras — el core resiste esta tendencia.',
    'Respira con ritmo constante durante el isometrico.',
  ],
  errores: [
    'Cadera que cae — lumbar hiperextendida.',
    'Cadera demasiado elevada.',
    'Dejar que el FR ruede libremente — el control del FR es el ejercicio.',
  ],
  variantes: [
    'S1-2: rodillas en suelo — solo codos en FR 20s.',
    'S3-4: completo 20s en FR.',
    'S5-6: completo 30s en FR con micro-oscilaciones hacia adelante y atras.',
    'S7+: completo 30s + 5 rep de deslizamiento controlado codos adelante/atras.',
  ],
  notas_columna: 'La plancha sobre FR aumenta la activacion del serrato anterior un 30-40% respecto a la plancha plana segun estudios EMG. El serrato anterior es un estabilizador escapular clave y su activacion es beneficiosa para la postura en cifosis frecuente en dolor lumbar cronico.'
};

EX_DB['ischium-walk'] = {
  nombre: 'Ischium Walk — Caminata sobre isquiones',
  categoria: 'Estabilidad y Fuerza',
  color: '#993C1D',
  descripcion: 'Ejercicio de activacion de la cadena posterior profunda en posicion sedente en el suelo. El desplazamiento se realiza alternando la contraccion de gluteo e isquiotibiales de cada lado para avanzar el isquion correspondiente.',
  posicion: 'Sentado en el suelo con piernas extendidas o ligeramente flexionadas. Tronco erguido. Brazos cruzados en el pecho o libres para equilibrio.',
  pasos: [
    'Posicion inicial: sentado erguido, isquiones en contacto con el suelo.',
    'Contrae el gluteo y el isquiotibial del lado derecho — este movimiento adelanta el isquion derecho.',
    'Repite con el lado izquierdo.',
    'El avance debe sentirse como una "caminata sentada" alternando la contraccion bilateral.',
    'El tronco se mantiene erguido y no rota excesivamente.',
    'Recorrer 10 metros en cada direccion.',
  ],
  errores: [
    'Usar el tronco o los brazos para impulsarse — solo la contraccion de la cadena posterior.',
    'Inclinar el tronco excesivamente hacia adelante.',
    'Realizar el movimiento muy rapidamente — el control es mas importante que la velocidad.',
  ],
  variantes: [
    'S1-2: con apoyo ligero de manos en suelo 10m.',
    'S3-4: sin apoyo de manos 10m.',
    'S5-6: sin apoyo + brazos cruzados en pecho 15m.',
    'S7+: con pequeño peso en manos 15m.',
  ],
  notas_columna: 'El Ischium Walk activa la cadena posterior profunda (isquiotibiales, gluteo mayor) en posicion sin carga axial, lo que lo hace especialmente util en periodos de alta sensibilidad lumbar. Es tambien un ejercicio propioceptivo que mejora la conciencia corporal del hemipelvis, util para corregir la asimetria pelvica en antalgica.'
};

EX_DB['motor-control-fr'] = {
  nombre: 'Control motor con Foam Roller — cuadrupedia',
  categoria: 'Estabilidad y Fuerza',
  color: '#993C1D',
  descripcion: 'Ejercicio de control motor segmentario en cuadrupedia con Foam Roller bajo la columna dorsal. El objetivo es extender una extremidad sin desplazar el FR, lo que obliga al core a trabajar de forma extremadamente precisa.',
  posicion: 'A cuatro patas. Foam Roller longitudinal bajo la columna toracolumbar (T10-L2). Manos bajo los hombros, rodillas bajo las caderas.',
  pasos: [
    'Coloca el FR longitudinalmente bajo la columna — debe contactar desde la zona lumbar baja hasta la toracica.',
    'Activa el core: columna neutra, FR no debe desplazarse.',
    'Extiende lentamente una pierna hacia atras sin que el FR se mueva lateralmente.',
    'Si el FR se desplaza, la columna esta rotando o inclinandose — reducir el rango.',
    'Mantén 2-3s en extension.',
    'Regresa lentamente.',
    'Repite en el otro lado.',
  ],
  errores: [
    'FR que se desplaza lateralmente — la columna rota o se inclina en lugar de mantenerse neutra.',
    'Cadera que sube excesivamente al extender la pierna.',
    'Usar el momentum en lugar del control.',
  ],
  variantes: [
    'S1-2: solo un FR bajo rodillas — extension parcial de pierna.',
    'S3-4: extension completa de pierna con FR bajo rodillas.',
    'S5-6: agregar FR lumbar — extension completa de pierna.',
    'S7+: FR lumbar + extension simultanea de brazo y pierna opuestos (bird-dog sobre FR).',
  ],
  notas_columna: 'Este ejercicio es una de las progresiones mas exigentes de control motor lumbar disponibles sin carga externa. El FR convierte el bird-dog en un ejercicio con biofeedback inmediato — si la columna pierde la neutralidad, el FR lo muestra instantaneamente.'
};

EX_DB['single-leg-bridge'] = {
  nombre: 'Puente de gluteo a una pierna',
  categoria: 'Estabilidad y Fuerza',
  color: '#993C1D',
  descripcion: 'Variante unilateral del puente de gluteo. Elimina la simetria bilateral y obliga a la pelvis a mantenerse nivelada contra la gravedad con un solo punto de apoyo, aumentando significativamente la demanda sobre el gluteo medio y el core lateral.',
  posicion: 'Tumbado boca arriba. Una pierna flexionada con el pie en el suelo (pierna de trabajo). La otra pierna extendida o flexionada en el aire.',
  pasos: [
    'Posicion inicial: pierna de trabajo flexionada, pierna libre en el aire.',
    'Activa el core — lumbar neutra.',
    'Empuja con el talon de la pierna de trabajo: eleva la cadera.',
    'En el punto mas alto: la pelvis debe estar NIVELADA — no caer del lado libre.',
    'El gluteo del lado de trabajo esta contraido al maximo.',
    'Pausa 2 seg en el punto alto.',
    'Baja lentamente controlando que la pelvis no caiga antes del apoyo.',
  ],
  errores: [
    'Pelvis que cae del lado libre — el gluteo medio del lado de trabajo no trabaja suficiente.',
    'Lumbar que se hiperextiende en el punto alto.',
    'Bajar muy rapidamente — el excentrico es parte del trabajo.',
  ],
  variantes: [
    'S1-2: bilateral como base.',
    'S3-4: unilateral pierna libre flexionada 90°.',
    'S5-6: unilateral pierna libre extendida horizontal.',
    'S7+: pie de trabajo sobre banco elevado + pierna libre extendida.',
    'F3: con mancuerna en cadera de trabajo.',
  ],
  notas_columna: 'La version unilateral del puente de gluteo es terapeuticamente superior a la bilateral en casos de asimetria pelvica o debilidad unilateral del gluteo (frecuente en antalgica izquierda). La pelvis que cae del lado libre indica debilidad especifica que debe corregirse antes de progresar a ejercicios de carga unilateral.'
};

EX_DB['iliac-elevation'] = {
  nombre: 'Elevacion iliaca (Iliac Elevation)',
  categoria: 'Estabilidad y Fuerza',
  color: '#993C1D',
  descripcion: 'Ejercicio de estabilizacion pelvica lateral. Trabaja el cuadrado lumbar y los oblicuos del lado de soporte para elevar activamente el hemipelvis contralateral. Es fundamental para corregir la inclinacion pelvica lateral caracteristica de la postura antalgica.',
  posicion: 'De pie. El pie de soporte (el que esta en el suelo) sobre una superficie elevada (step o banco de 15-20 cm). El pie libre cuelga sin apoyo al lado.',
  pasos: [
    'Posicion inicial: pie de soporte en el step, pie libre colgando al nivel neutro.',
    'Activa el core.',
    'Eleva activamente el hemipelvis del lado libre usando el cuadrado lumbar ipsilateral — el pie libre sube.',
    'En el punto alto: el hemipelvis libre esta elevado por encima del nivel del soporte.',
    'Mantén 1-2 seg.',
    'Baja controlado — el hemipelvis libre desciende por debajo del nivel neutro (descenso controlado de cadera).',
    'Esto trabaja el rango completo del cuadrado lumbar.',
  ],
  errores: [
    'Usar el tronco para inclinar el cuerpo en lugar del cuadrado lumbar — el tronco debe permanecer recto.',
    'Flexionar la rodilla del lado libre — la pierna debe mantenerse extendida.',
    'Subir demasiado rapido — el control es el ejercicio.',
  ],
  variantes: [
    'S1-2: elevacion minima en superficie de 10 cm — apoyo en pared.',
    'S3-4: elevacion completa en superficie 15 cm — apoyo en pared.',
    'S5-6: elevacion completa sin apoyo de pared.',
    'S7+: elevacion completa + pausa 2s en punto alto + descenso controlado 3 seg.',
  ],
  notas_columna: 'La elevacion iliaca es el ejercicio mas especifico para el cuadrado lumbar ipsilateral al paso de soporte. En la postura antalgica con desplazamiento lateral, el cuadrado lumbar del lado de descarga frecuentemente esta debilitado. Su fortalecimiento es uno de los objetivos clave para restaurar la simetria pelvica.'
};

// ─── EJERCICIOS VARIOS (resumen — version compacta) ───────────────

EX_DB['hiperext'] = {
  nombre: 'Hiperextension banco 45 grados',
  categoria: 'Cadena posterior',
  color: '#3C3489',
  descripcion: 'Extension de cadera y columna en banco inclinado a 45 grados. Motor principal de la cadena posterior lumbar en F2. Progresion desde isometrico sin carga hasta carga pesada.',
  posicion: 'Caderas sobre el soporte acolchado del banco. Piernas fijas. Tronco colgando hacia abajo al inicio.',
  pasos: [
    'Posicion inicial: cadera en el soporte, tronco perpendicular al suelo.',
    'Activa el gluteo y los isquiotibiales.',
    'Eleva el tronco hasta la posicion horizontal (no hiperextender).',
    'Pausa 1-2s en el punto alto.',
    'Baja lentamente controlando el excentrico.',
  ],
  errores: ['Hiperextension lumbar al subir — el punto alto es la posicion horizontal.', 'No activar el gluteo — la espalda compensa.', 'Descenso incontrolado.'],
  variantes: ['S1-2: iso hold neutro 4x25s. S3-4: rango completo sin peso exc 3s. S5-6: +20kg 4x8 exc 3s. S7+: +40kg 4x6-8. F3: criterio 40kg 4x6.'],
  notas_columna: 'La hiperextension en banco 45° es el ejercicio central del programa de cadena posterior porque permite cuantificar la progresion de carga con precision. Con extrusion L5-S1 activa, comenzar siempre por el isometrico en posicion neutra antes de introducir rango de movimiento.'
};

EX_DB['superman'] = {
  nombre: 'Superman (extension en prono)',
  categoria: 'Cadena posterior',
  color: '#3C3489',
  descripcion: 'Extension de cadera y columna en prono elevando brazos y/o piernas. Combina extension espinal con alcance de brazos al frente (protraccion). Los brazos estirados al frente actuan como palanca larga que multiplica el momento extensor sobre la lumbar — por eso la posicion de los brazos es la variable que mas modula la carga, mas que el peso anadido.',
  posicion: 'Tumbado boca abajo. Cinta yoga o foam bajo el abdomen como fulcro. Cabeza neutra (mirada al suelo).',
  pasos: [
    'Activa el gluteo y lleva la pelvis a retroversion suave antes de elevar.',
    'Eleva hasta la horizontal — NO mas alto (el punto alto no es la hiperextension).',
    'Manten la cabeza neutra, en linea con la columna.',
    'Pausa 2 seg arriba y baja controlando el excentrico.',
    'Progresa primero la posicion de los brazos (pegados al cuerpo -> nuca -> extendidos al frente) y solo despues anade carga.',
  ],
  errores: [
    'Hiperextension lumbar al subir — el techo es la horizontal, no mas.',
    'Brazos extendidos al frente antes de tiempo — la palanca larga lleva la extension a la lumbar.',
    'Cabeza en hiperextension cervical (mirar al frente) — arrastra toda la cadena a extension.',
    'Elevar a la vez brazos y piernas con palanca completa en estadios bajos.',
  ],
  variantes: [
    'S1-2: brazos pegados al cuerpo, iso hold sin elevar piernas.',
    'S3-4: manos en la nuca, extension completa sin peso.',
    'S5-6: brazos extendidos al frente + tobillera ligera 1kg.',
    'S7+: brazos extendidos al frente + tobillera 2kg + pausa 3s.',
  ],
  notas_columna: 'El Superman es el ejemplo de libro de extension de espalda en protraccion: el alcance de brazos al frente alarga la palanca y, via dorsal ancho y fascia toracolumbar, puede arrastrar la extension hacia L4-L5/L5-S1, cerrando el foramen donde sale la raiz S1. Por eso en F2 se progresa por posicion de brazos (palanca) antes que por carga, y nunca se pasa de la horizontal. Si aparece irradiacion S1, reducir la palanca (brazos al cuerpo) o sustituir por single leg reverse hyper.'
};

EX_DB['protraccion-serrato-plancha'] = {
  nombre: 'Protraccion escapular en plancha (serrato) — hold',
  categoria: 'Espalda / escapular',
  color: '#1A6E8A',
  descripcion: 'Hold isometrico en plancha empujando el suelo para separar al maximo las escapulas (protraccion). Aisla el serrato anterior y entrena la protraccion escapular con la columna NEUTRA — la version segura de la protraccion, sin extension lumbar asociada.',
  posicion: 'Plancha sobre manos (o rodillas en estadios bajos). Manos bajo los hombros. Lumbar neutra, costillas abajo, gluteo activo.',
  pasos: [
    'Adopta la plancha con el cuerpo en linea y la lumbar neutra.',
    'Empuja el suelo alejandolo: las escapulas se separan y la parte alta de la espalda se redondea ligeramente (protraccion).',
    'El movimiento ocurre SOLO en las escapulas — la lumbar no se mueve.',
    'Manten la protraccion maxima 20-30 seg respirando.',
    'No dejes caer el pecho entre las escapulas (eso seria retraccion pasiva).',
  ],
  errores: [
    'Arquear o hundir la lumbar para "ayudar" — la protraccion es escapular, no lumbar.',
    'Subir las caderas o sacar el gluteo.',
    'Encoger los hombros hacia las orejas en vez de separar las escapulas.',
  ],
  variantes: [
    'S1-2: desde rodillas 3x15s.',
    'S3-4: plancha completa 3x20s.',
    'S5-6: plancha completa 3x30s.',
    'S7+: una mano sobre foam/balon (inestable) 3x20s.',
  ],
  notas_columna: 'Entrenar la protraccion escapular aislada y con lumbar neutra ensena a disociar el movimiento del hombro del de la columna. Es justo lo que protege en tareas de alcance overhead (jalon, nado, alcanzar un estante): si el serrato controla la protraccion, el hombro llega solo y no roba extension a L4-S1. Es el complemento defensivo de la regla de no extender la lumbar al protraer.'
};

EX_DB['serratus-wall-slide'] = {
  nombre: 'Serratus wall slide — hold isometrico',
  categoria: 'Espalda / escapular',
  color: '#1A6E8A',
  descripcion: 'De pie frente a la pared, antebrazos apoyados, se deslizan hacia arriba protraendo las escapulas y se mantiene la posicion alta. Serrato anterior y trapecio inferior en cadena cerrada, de pie y con lumbar neutra.',
  posicion: 'De pie frente a la pared, antebrazos y cantos de las manos en contacto, codos a la altura de los hombros. Costillas abajo, lumbar neutra, ligera retroversion.',
  pasos: [
    'Apoya los antebrazos en la pared y activa el abdomen (costillas abajo).',
    'Desliza los antebrazos hacia arriba manteniendo el contacto.',
    'Al llegar arriba, empuja la pared para protraer las escapulas y manten.',
    'Sostén 20-30 seg sin perder la posicion de costillas abajo.',
    'NO arquees la lumbar ni saques las costillas para alcanzar mas alto.',
  ],
  errores: [
    'Arquear la lumbar / sacar costillas para ganar altura — el limite es donde la lumbar deja de estar neutra.',
    'Despegar los antebrazos de la pared.',
    'Encoger los hombros hacia las orejas.',
  ],
  variantes: [
    'S1-2: rango bajo 3x15s.',
    'S3-4: rango medio 3x20s.',
    'S5-6: rango alto + protraccion maxima 3x25s.',
    'S7+: con banda alrededor de los antebrazos 3x30s.',
  ],
  notas_columna: 'El wall slide entrena el alcance overhead de forma segura: ensena a elevar los brazos protraendo la escapula SIN compensar con extension lumbar. Para L4-L5/L5-S1 es clave porque el fallo tipico al levantar los brazos es sacar las costillas y arquear la lumbar (cierre foraminal). La pared y el cue de costillas abajo hacen de biofeedback.'
};

EX_DB['glute-bridge'] = {
  nombre: 'Puente de gluteo dinamico',
  categoria: 'Gluteo / activacion',
  color: '#0F6E56',
  descripcion: 'Activacion del gluteo mayor en posicion supina. Version dinamica del glute bridge: subida controlada, pausa en el punto alto, bajada lenta.',
  posicion: 'Tumbado boca arriba. Rodillas flexionadas, pies en el suelo. Brazos a los lados.',
  pasos: [
    'Activa el core — lumbar neutra.',
    'Empuja con los talones: eleva la cadera.',
    'Pausa 2 seg en el punto alto apretando el gluteo.',
    'Baja lentamente.',
  ],
  errores: ['Arco lumbar excesivo en el punto alto.', 'No activar el gluteo — solo subir la cadera.'],
  variantes: ['Bilateral estandar · Unilateral con pierna libre · Con banda en muslos · Con talones en banco elevado.'],
  notas_columna: 'El glute bridge es el ejercicio de referencia de activacion glutea en F2. La posicion supina elimina completamente la carga axial sobre la columna.'
};

EX_DB['cat-cow'] = {
  nombre: 'Cat-cow toracico',
  categoria: 'Movilidad toracica',
  color: '#1A6E3A',
  descripcion: 'Flexion y extension de la columna toracica en cuadrupedia. Version controlada que aisla el movimiento en la zona toracica, manteniendo la lumbar estatica.',
  posicion: 'A cuatro patas. Rodillas bajo caderas, manos bajo hombros.',
  pasos: [
    'Redondea solo la zona toracica (cat) — escapulas se abren, cabeza cae.',
    'Extiende solo la zona toracica (cow) — escapulas se juntan, cabeza sube.',
    'La pelvis y la lumbar PERMANECEN ESTATICAS.',
  ],
  errores: ['Lumbar que participa — reducir el rango.', 'Movimiento demasiado rapido.'],
  variantes: ['Lento 3s por fase · Con pausa en cada extremo · Con rotacion alternada añadida.'],
  notas_columna: 'El cat-cow toracico aislado evita la carga repetida de flexion-extension sobre L4-S1 que el cat-cow convencional produce. Siempre especificar "solo toracico" al realizarlo.'
};

EX_DB['viparita'] = {
  nombre: 'Viparita Karani — piernas en la pared',
  categoria: 'Recuperacion',
  color: '#0F6E56',
  descripcion: 'Posicion restaurativa con piernas elevadas en la pared. Facilita el retorno venoso, activa el sistema parasimpatico y produce traccion pasiva sobre la zona lumbar.',
  posicion: 'Tumbado cerca de la pared. Piernas extendidas apoyadas en la pared. Gluteos separados 5-15 cm de la pared para mantener la lumbar neutra.',
  pasos: [
    'Situar los gluteos a 5-15 cm de la pared — NO pegados a la pared si provoca molestia lumbar.',
    'Piernas extendidas o ligeramente flexionadas segun la tension de isquiotibiales.',
    'Respiracion diafragmatica lenta durante toda la posicion.',
    'Durar el tiempo indicado sin tension.',
  ],
  errores: ['Gluteos pegados a la pared que generan tension lumbar.', 'Tension cervical — usar almohada bajo la cabeza si es necesario.'],
  variantes: ['5 min en dias normales · 8 min en dias neurales.'],
  notas_columna: 'La posicion supina con piernas elevadas reduce la presion intradiscal lumbar a los niveles mas bajos posibles. Ideal como cierre de sesion y como protocolo de recuperacion en dias de dolor elevado.'
};

EX_DB['pigeon-pose'] = {
  nombre: 'Pigeon pose — estiramiento piriforme',
  categoria: 'Movilidad cadera',
  color: '#0F6E56',
  descripcion: 'Estiramiento profundo del piriforme y los rotadores externos de cadera. En personas con citica, el piriforme puede comprimir el nervio ciatico cuando esta en espasmo.',
  posicion: 'En banco: espinilla delantera sobre el banco, tronco erguido. En suelo: posicion clasica de pigeon con la pierna delantera doblada en el suelo.',
  pasos: [
    'Versión banco: espinilla delantera apoyada sobre el banco, pie apuntando hacia el lateral.',
    'Tronco erguido — NO inclinarse hacia adelante inicialmente.',
    'Sentir el estiramiento en el gluteo de la pierna delantera.',
    'Mantener sin forzar.',
  ],
  errores: ['Inclinar excesivamente el tronco si provoca irradiacion.', 'Forzar la posicion del pie.'],
  variantes: ['En banco: mas seguro · En suelo: mayor intensidad · Con inclinacion de tronco: aumenta el estiramiento.'],
  notas_columna: 'El piriforme tenso puede irritar mecanicamente el nervio ciatico en su trayecto. El estiramiento del piriforme es parte del protocolo de descompresion neural diario.'
};

EX_DB['neural-flossing'] = {
  nombre: 'Neural flossing — nervio ciatico',
  categoria: 'Protocolo neural',
  color: '#D4831A',
  descripcion: 'Tecnica de deslizamiento neural del nervio ciatico. Moviliza el nervio a traves de su recorrido desde la raiz lumbar hasta el pie.',
  posicion: 'Sentado en el borde de una silla. Espalda erguida.',
  pasos: [
    'Extiende la rodilla del lado afectado al mismo tiempo que echas la cabeza hacia atras.',
    'Vuelve a flexionar la rodilla mientras llevas la barbilla al pecho.',
    'Movimiento suave y continuo — como un acordeon.',
    'PARAR si hay reproduccion de irradiacion.',
  ],
  errores: ['Movimiento brusco.', 'Continuar si hay irradiacion reproducida.'],
  variantes: ['S1-2: 30-40° muy suave · S3-4: 60° · S5-6: 80° + dorsiflexion pasiva · S7+: angulo completo + dorsiflexion activa.'],
  notas_columna: 'Solo realizar en ventanas sin irradiacion activa intensa. El nervio se desliza, no se estira.'
};

EX_DB['rear-delt-fly'] = {
  nombre: 'Rear delt fly / Pajaros inverso',
  categoria: 'Hombro posterior',
  color: '#6B5B95',
  descripcion: 'Ejercicio de aislamiento para el deltoides posterior y la musculatura escapular retractora. Contrarresta la postura cifótica que agrava las hernias discales.',
  posicion: 'Sentado en la máquina de rear delt. Ajusta el asiento para que los mangos queden a la altura de los hombros con los brazos extendidos al frente.',
  pasos: [
    'Siéntate con el pecho apoyado en el respaldo (si lo tiene) o el torso ligeramente inclinado hacia adelante.',
    'Agarra los mangos con codos ligeramente flexionados — NO los bloquees.',
    'Abre los brazos hacia los lados en arco horizontal hasta alinear con los hombros.',
    'Pausa 1 segundo en la apertura máxima — aprieta los deltoides posteriores.',
    'Vuelve al inicio de forma muy controlada (3 seg de excéntrico).',
  ],
  errores: [
    'Balancear el torso hacia atrás para ayudarse — genera compensación lumbar.',
    'Extender los codos completamente (sobrecarga la articulación).',
    'Encogerse de hombros — activa trapecios en vez de deltoides posteriores.',
    'Rango parcial sin pausa — pierde el pico de contracción.',
  ],
  variantes: ['S1-2: carga mínima ROM parcial · S3-4: carga ligera ROM completo · S5-6: carga media exc 3s · S7+: carga media pausa 1s arriba'],
  notas_columna: 'Movimiento en plano horizontal sin ninguna carga axial sobre L4-L5/L5-S1. El deltoides posterior y los romboides son estabilizadores escapulares clave: su debilidad contribuye a la postura cifótica que aumenta la presión discal. Realizar sentado evita cualquier carga de pie sobre la hernia.'
};

// ─── FICHAS NUEVAS (cierre de huecos — 2026-06-18) ────────────────

EX_DB['leg-extension'] = {
  nombre: 'Leg extension — extensión de cuádriceps en máquina',
  categoria: 'Cuádriceps / aislamiento',
  color: '#3C3489',
  descripcion: 'Extensión de rodilla en máquina sentado. Aísla el cuádriceps sin carga axial sobre la columna. El respaldo fija la pelvis y elimina cualquier compensación lumbar.',
  posicion: 'Sentado en la máquina, espalda apoyada en el respaldo. Rodillas alineadas con el eje de giro. Rodillo sobre la parte baja de las espinillas, justo encima de los tobillos.',
  pasos: [
    'Ajusta el respaldo para que las rodillas queden alineadas con el eje de la máquina.',
    'Espalda y lumbar pegadas al respaldo durante todo el movimiento.',
    'Extiende las rodillas hasta casi el bloqueo (sin chasquido), apretando el cuádriceps.',
    'Pausa breve arriba.',
    'Baja controlando el excéntrico (2-3 seg).',
  ],
  errores: ['Despegar la lumbar o los glúteos del respaldo al empujar.', 'Usar impulso o balanceo del tronco.', 'Bloqueo brusco de la rodilla.'],
  variantes: ['S1-2: carga ligera, ROM parcial, control. S3-4: ROM completo exc 3s. S5-6: carga media. S7+: carga media + pausa arriba.'],
  notas_columna: 'Uno de los ejercicios más seguros para la columna con extrusión L4-L5/L5-S1: la posición sentada con respaldo elimina por completo la carga axial y fija la pelvis, de modo que el cuádriceps trabaja aislado sin que la lumbar tenga que estabilizar. Útil para mantener masa de cuádriceps cuando la sentadilla pesada aún no está indicada. Mantener siempre la lumbar en contacto con el respaldo.'
};

EX_DB['leg-curl'] = {
  nombre: 'Leg curl — curl femoral en máquina',
  categoria: 'Isquiotibiales / aislamiento',
  color: '#3C3489',
  descripcion: 'Flexión de rodilla en máquina (tumbado o sentado) que aísla los isquiotibiales sin carga axial sobre la columna. Complementa la cadena posterior trabajada en RDL e hiperextensión.',
  posicion: 'Tumbado boca abajo (o sentado según máquina). Rodillo sobre la parte posterior baja de las piernas, justo encima de los talones. Caderas apoyadas.',
  pasos: [
    'Coloca el rodillo justo por encima de los talones.',
    'Caderas y pelvis pegadas al banco — no despegarlas.',
    'Flexiona las rodillas llevando los talones hacia los glúteos.',
    'Pausa breve en la contracción.',
    'Baja controlando el excéntrico (2-3 seg).',
  ],
  errores: ['Levantar las caderas del banco (genera extensión lumbar).', 'Usar impulso.', 'Rango parcial sin contracción completa.'],
  variantes: ['S1-2: carga ligera, control. S3-4: ROM completo exc 3s. S5-6: carga media. S7+: carga media + pausa arriba.'],
  notas_columna: 'Aísla los isquiotibiales sin ninguna carga axial sobre L4-L5/L5-S1. CLAVE: en la versión tumbada, mantener las caderas pegadas al banco — si se despegan, se produce extensión lumbar que puede irritar la raíz S1. Si aparece esa tendencia, preferir la máquina sentada, que fija mejor la pelvis. Refuerza la cadena posterior de forma analítica y segura.'
};

EX_DB['sumo-squat-kb'] = {
  nombre: 'Sumo squat con kettlebell / mancuerna',
  categoria: 'Pierna / glúteo',
  color: '#1A6E3A',
  descripcion: 'Sentadilla con piernas anchas y puntas abiertas, sujetando una kettlebell o mancuerna entre las piernas (goblet bajo). Énfasis en glúteo y aductores con tronco más vertical que la sentadilla convencional.',
  posicion: 'Pies más anchos que los hombros, puntas abiertas 30-45°. Kettlebell colgando entre las piernas con los brazos extendidos. Tronco erguido, lumbar neutra.',
  pasos: [
    'Activa el core y fija la lumbar neutra antes de bajar.',
    'Baja flexionando caderas y rodillas, llevando las rodillas hacia las puntas de los pies.',
    'Mantén el tronco lo más vertical posible y la lumbar neutra (no redondear abajo).',
    'Sube empujando el suelo y apretando los glúteos arriba.',
  ],
  errores: ['Redondear la lumbar en el punto bajo (butt wink) — limitar la profundidad.', 'Rodillas hacia dentro.', 'Inclinar el tronco en exceso hacia adelante.'],
  variantes: ['S1-2: rango parcial sin carga o muy ligera. S3-4: rango cómodo carga ligera. S5-6: carga media. S7+: rango completo carga media.'],
  notas_columna: 'La postura sumo con tronco vertical reduce el brazo de palanca sobre L4-L5/L5-S1 respecto a una sentadilla con más inclinación de tronco. El riesgo principal es el "butt wink" (retroversión pélvica con flexión lumbar) en el punto bajo: limitar siempre la profundidad al rango en que la lumbar se mantiene neutra. Parar ante cualquier irradiación S1.'
};

EX_DB['tfl-stretch'] = {
  nombre: 'Estiramiento del TFL / tensor de la fascia lata',
  categoria: 'Movilidad cadera',
  color: '#0F6E56',
  descripcion: 'Estiramiento del tensor de la fascia lata y la banda iliotibial. Un TFL tenso aumenta la tracción lateral sobre la pelvis y puede contribuir a desequilibrios que sobrecargan la zona lumbar.',
  posicion: 'De pie junto a una pared o en el suelo. Pierna a estirar cruzada por detrás de la otra, cadera empujada lateralmente hacia el lado contrario.',
  pasos: [
    'De pie: cruza la pierna a estirar por detrás de la otra.',
    'Empuja la cadera de ese lado hacia afuera (hacia la pared), inclinando ligeramente el tronco al lado contrario.',
    'Siente el estiramiento en la cara lateral de la cadera/muslo.',
    'Mantén sin rebotes, respirando, sin forzar.',
  ],
  errores: ['Rebotar.', 'Rotar o flexionar la lumbar para "sentir más" — el estiramiento es de cadera.', 'Forzar hasta el dolor.'],
  variantes: ['De pie contra pared (más suave) · En el suelo tumbado de lado · Con foam roller sobre el TFL (liberación miofascial).'],
  notas_columna: 'El TFL y la banda iliotibial se insertan en la pelvis y la rodilla; su tensión excesiva altera la mecánica pélvica y puede aumentar la carga compensatoria sobre L4-L5/L5-S1. Estirarlo ayuda a equilibrar las fuerzas laterales sobre la pelvis. Mantener la lumbar neutra durante el estiramiento: el movimiento debe sentirse en la cadera, nunca en la zona lumbar.'
};

// ═══════════════════════════════════════════════════════════════════
// ─── FICHAS DE CUELLO / CERVICAL ───────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

EX_DB['chin-tuck'] = {
  nombre: 'Chin tuck supino (flexión craneocervical)',
  categoria: 'Cuello / cervical',
  color: '#1B8A9C',
  descripcion: 'Activación de los flexores profundos del cuello (longus colli y longus capitis) mediante una retracción suave del mentón ("doble mentón") que alarga la nuca, sin levantar la cabeza. Es el ejercicio fundacional del cuello: el equivalente cervical de la activación isométrica del core.',
  posicion: 'Tumbado boca arriba, rodillas dobladas, pies en el suelo. Cabeza apoyada, mirada al techo. Hombros relajados lejos de las orejas.',
  pasos: [
    'Sin levantar la cabeza, desliza el mentón hacia el cuello como haciendo "doble mentón".',
    'Siente cómo la nuca se alarga y se acerca ligeramente al suelo.',
    'El esfuerzo está en los músculos profundos del frente del cuello, no en tensar la garganta.',
    'Mantén 5 segundos respirando con normalidad y suelta despacio.',
  ],
  errores: [
    'Levantar la cabeza del suelo (eso ya es elevación, no chin tuck) — domina primero la retracción pura.',
    'Adelantar el mentón o apretar la mandíbula: eso recluta el esternocleidomastoideo en vez de los flexores profundos.',
    'Tensar los hombros hacia las orejas.',
  ],
  variantes: [
    'S1-2: retracción muy suave sin elevar 3x8.',
    'S3-4: retracción + hold 5 seg 3x10.',
    'S5-6: retracción manteniendo la cabeza despegada 2 cm 3x10.',
    'S7+: retracción + sostener la cabeza despegada 10 seg 3x8.',
  ],
  notas_columna: 'Los flexores profundos del cuello son a la columna cervical (C5-C6/C6-C7, los niveles donde más se hernia) lo que el transverso del abdomen es a la lumbar: estabilizadores locales que mantienen los segmentos neutros. Si están débiles aparece la cabeza adelantada (chin-poke), que aumenta varias veces la carga sobre los discos cervicales. Reentrenarlos es el requisito previo para subir la intensidad del core: en plancha, hollow body y L-sit la cabeza debe sostenerse sin craquear el cuello — justo lo que entrena este ejercicio. Hacerlo a diario, también como reseteo postural durante el trabajo de pantalla.'
};

EX_DB['chin-tuck-pared'] = {
  nombre: 'Chin tuck de pie contra pared (postural)',
  categoria: 'Cuello / cervical',
  color: '#1B8A9C',
  descripcion: 'Versión de pie del chin tuck usando la pared como biofeedback. Reentrena la postura de cabeza adelantada que genera el trabajo sentado, integrando la flexión craneocervical en bipedestación.',
  posicion: 'De pie con los talones, glúteos, espalda alta y occipucio en contacto con la pared. Brazos relajados, hombros bajos.',
  pasos: [
    'Con el occipucio apoyado, haz "doble mentón" llevando la nuca hacia la pared.',
    'No mires hacia arriba ni extiendas el cuello: el movimiento es de retracción, no de extensión.',
    'Mantén 5 segundos sintiendo cómo crece la distancia entre orejas y hombros.',
    'Suelta sin perder la postura erguida.',
  ],
  errores: [
    'Extender el cuello (sacar la barbilla hacia arriba) en lugar de retraerla.',
    'Despegar la espalda alta de la pared arqueando para "llegar".',
    'Encoger los hombros.',
  ],
  variantes: [
    'S1-2: contra pared con feedback 3x6.',
    'S3-4: contra pared hold 5 seg 3x8.',
    'S5-6: de pie sin pared 3x8.',
    'S7+: sentado en la silla de trabajo cada hora (micro-pausas antisedentarismo).',
  ],
  notas_columna: 'La postura de cabeza adelantada sostenida durante horas frente a la pantalla es el principal factor mecánico de sobrecarga discal cervical en C5-C6/C6-C7. Esta variante traslada la activación de los flexores profundos a la posición funcional (de pie/sentado) en la que pasas el día, y la pared te enseña dónde está el neutro. Es prevención pura: realizada en micro-dosis frecuentes evita la fatiga postural que precede al dolor cervical.'
};

EX_DB['head-lift'] = {
  nombre: 'Elevación de cabeza con doble mentón (endurance flexor profundo)',
  categoria: 'Cuello / cervical',
  color: '#1B8A9C',
  descripcion: 'Progresión de fuerza-resistencia de los flexores profundos del cuello. Sobre el chin tuck mantenido, se despega ligeramente la cabeza para añadir carga, entrenando la capacidad de sostener la cabeza durante esfuerzos prolongados (como el core intenso).',
  posicion: 'Tumbado boca arriba, rodillas dobladas. Cabeza apoyada en el suelo.',
  pasos: [
    'Haz primero el chin tuck (doble mentón) y MANTENLO durante todo el ejercicio.',
    'Sin perder la retracción, despega la cabeza 2-3 cm del suelo.',
    'Comprueba que el mentón no se adelanta: si la barbilla se proyecta hacia arriba, manda el esternocleidomastoideo y debes bajar la dificultad.',
    'Baja la cabeza despacio manteniendo el doble mentón hasta apoyar.',
  ],
  errores: [
    'Soltar el chin tuck al elevar — la cabeza "cae hacia atrás" sobre el cuello.',
    'Proyectar la barbilla hacia el techo (compensación con músculos superficiales).',
    'Subir demasiado: el rango útil es pequeño, no se trata de hacer "abdominales de cuello".',
  ],
  variantes: [
    'S1-2: no introducir todavía — dominar el chin tuck primero.',
    'S3-4: despegue mínimo 3x6.',
    'S5-6: despegue 3 cm + 2 seg 3x8.',
    'S7+: despegue + sostener 10 seg 3x8.',
  ],
  notas_columna: 'La debilidad en resistencia (no en fuerza máxima) de los flexores profundos es lo que se asocia al dolor cervical crónico y a la cabeza adelantada. Este ejercicio entrena precisamente esa resistencia, que es la cualidad necesaria para que el cuello aguante una plancha larga o una serie de hollow holds sin claudicar en chin-poke. Introducir solo cuando el chin tuck puro sea impecable; la señal de progresión correcta es poder elevar SIN que la barbilla se adelante. Parar ante cualquier mareo, hormigueo en brazos o dolor cervical.'
};

EX_DB['iso-cervical'] = {
  nombre: 'Isométricos cervicales multidireccionales (auto-resistidos)',
  categoria: 'Cuello / cervical',
  color: '#1B8A9C',
  descripcion: 'Contracciones isométricas del cuello en las cuatro direcciones contra la resistencia de la propia mano, sin que la cabeza se mueva. Entrena la estabilidad anti-movimiento de la columna cervical en posición neutra: el equivalente cervical del Pallof press anti-rotación.',
  posicion: 'Sentado o de pie, cabeza neutra con un doble mentón suave. La mano se coloca sucesivamente en la frente, en la nuca y en cada sien.',
  pasos: [
    'Coloca la palma en la frente y empuja la cabeza contra la mano SIN que la cabeza se mueva (anti-flexión). 6 seg al 30-50%.',
    'Mano en la nuca, empuja hacia atrás sin moverte (anti-extensión).',
    'Mano en una sien, empuja lateralmente sin moverte (anti-inclinación). Repite al otro lado.',
    'Respira durante cada contracción; la cabeza permanece perfectamente quieta en neutro.',
  ],
  errores: [
    'Dejar que la cabeza ceda o avance: debe ser isométrico puro, sin movimiento.',
    'Aplicar el 100% de fuerza de golpe — sube progresivo y quédate en el 30-50% al inicio.',
    'Perder el doble mentón y caer en cabeza adelantada durante el empuje.',
  ],
  variantes: [
    'S1-2: 20% de intensidad, solo frontal y laterales 3x5s.',
    'S3-4: 30% en las 4 direcciones 3x6s.',
    'S5-6: 50% en las 4 direcciones 3x6s.',
    'S7+: 50% + diagonales (flexo-rotación resistida) 3x6s.',
  ],
  notas_columna: 'La función protectora número uno de la musculatura cervical no es mover la cabeza, sino impedir que se mueva cuando algo la empuja: resistir, no generar. Por eso el trabajo isométrico anti-movimiento es el más seguro y transferible para prevenir la hernia cervical, igual que el Pallof y la plancha lo son para la lumbar. Mantener el cuello neutro bajo carga es exactamente lo que se necesita durante el core intenso, donde el tronco genera tensiones que llegan al cuello. Nunca llevar a rango final bajo fuerza; el ejercicio se hace SIEMPRE en neutro.'
};

EX_DB['neck-cars'] = {
  nombre: 'Neck CARs — movilidad cervical controlada',
  categoria: 'Cuello / cervical',
  color: '#1B8A9C',
  descripcion: 'Rotaciones articulares controladas (Controlled Articular Rotations) de la columna cervical: círculos lentos y activos en todo el rango libre de dolor, manteniendo el tronco quieto. Mantiene la movilidad y la salud articular del cuello sin cargas ni rangos forzados.',
  posicion: 'Sentado o de pie, tronco erguido, hombros estables y quietos. Doble mentón suave de partida.',
  pasos: [
    'Lleva el mentón al pecho (flexión) y desde ahí dibuja un círculo muy lento: oreja al hombro, mirada que rota, nuca, y de vuelta.',
    'El movimiento es activo y controlado en cada grado, no un balanceo por inercia.',
    'Quédate dentro del rango sin dolor y sin sensación de "craqueo" forzado.',
    'No dejes caer la cabeza hacia atrás combinando extensión y rotación: esa posición cierra el foramen cervical.',
  ],
  errores: [
    'Forzar el final del rango o buscar que "suene" el cuello.',
    'Mover los hombros o el tronco para ganar amplitud.',
    'Pasar rápido por la zona de extensión + rotación (la más sensible para el disco y la raíz nerviosa).',
  ],
  variantes: [
    'S1-2: flexión/extensión y rotaciones por separado, rango corto.',
    'S3-4: medio círculo inferior (sin la fase de extensión) 2x3.',
    'S5-6: círculo completo lento y controlado 2x3.',
    'S7+: círculo completo + pausa activa en cada punto cardinal.',
  ],
  notas_columna: 'Son los "Hip CARs" del cuello: trabajan el rango articular activo sin carga axial, que es lo primero que se introduce de forma segura para mantener la salud del segmento. La clave de seguridad cervical es idéntica a la regla lumbar de no combinar extensión con rotación bajo carga: en el cuello esa combinación cierra el foramen y puede comprimir la raíz nerviosa, por eso las fases bajas se introducen sin extensión. El círculo completo debe ser indoloro en todo el arco; cualquier punto que provoque mareo, hormigueo en el brazo o dolor marca el límite a respetar.'
};

EX_DB['prone-neck-ext'] = {
  nombre: 'Extensión cervical prona con retracción escapular',
  categoria: 'Cuello / cervical',
  color: '#1B8A9C',
  descripcion: 'Fortalecimiento de los extensores profundos del cuello y del trapecio inferior en posición prona, elevando la cabeza solo hasta la línea del cuerpo mientras se juntan las escápulas. Equilibra el ratio flexor/extensor cervical y combate la cabeza adelantada desde la cadena posterior.',
  posicion: 'Boca abajo, con la cabeza fuera del borde del banco (o tumbado en el suelo mirando abajo). Frente hacia el suelo, brazos a los lados o en posición de "W".',
  pasos: [
    'Parte de un doble mentón suave.',
    'Eleva la cabeza solo hasta alinearla con el tronco — NO más arriba (nada de hiperextensión).',
    'Al mismo tiempo, junta y baja las escápulas (retracción + depresión escapular).',
    'Mantén 3 segundos en la línea neutra y baja con control.',
  ],
  errores: [
    'Hiperextender el cuello mirando al frente o hacia arriba: cierra el foramen cervical.',
    'Tirar con los trapecios superiores encogiendo los hombros hacia las orejas.',
    'Perder el doble mentón y proyectar la barbilla al elevar.',
  ],
  variantes: [
    'S1-2: solo retracción escapular sin elevar la cabeza 3x10.',
    'S3-4: elevar la cabeza hasta neutro 3x8.',
    'S5-6: neutro + 3 seg hold 3x8.',
    'S7+: + ligera resistencia (toalla/mano en la nuca) 3x8.',
  ],
  notas_columna: 'Un cuello sano necesita equilibrio entre flexores y extensores profundos: trabajar solo el chin tuck dejaría la cadena posterior débil. El trapecio inferior, además, estabiliza la escápula y reduce la tendencia a la cabeza adelantada y a la hipercifosis dorsal, el mismo patrón postural que sobrecarga tanto la cervical como, por compensación, la lumbar. El límite es neutro: elevar hasta la línea del cuerpo, nunca por encima, para no comprimir los discos cervicales en extensión. Parar ante mareo u hormigueo.'
};

EX_DB['upper-trap-stretch'] = {
  nombre: 'Estiramiento del trapecio superior y elevador de la escápula',
  categoria: 'Cuello / cervical',
  color: '#1B8A9C',
  descripcion: 'Estiramiento suave de los músculos que más acumulan tensión postural por el trabajo de pantalla: el trapecio superior y el elevador de la escápula. Libera la rigidez que mantiene la cabeza tensa y eleva los hombros.',
  posicion: 'Sentado en una silla. Una mano sujeta el borde del asiento para fijar el hombro abajo. La otra mano se apoya suavemente sobre la cabeza.',
  pasos: [
    'Con el hombro de un lado fijado hacia abajo (sujetando el asiento), lleva la cabeza hacia el lado contrario (oreja al hombro): estira el trapecio superior.',
    'Para el elevador, gira ligeramente la cara hacia la axila del lado contrario y deja caer la cabeza hacia delante.',
    'La mano de arriba solo acompaña el peso de la cabeza, sin tirar con fuerza.',
    'Mantén 30 segundos respirando, sin rebotes, y cambia de lado.',
  ],
  errores: [
    'Tirar fuerte de la cabeza con la mano (debe ser un estiramiento suave).',
    'Subir el hombro del lado que se estira: hay que mantenerlo deprimido.',
    'Rotar o forzar la columna cervical buscando "más estiramiento".',
  ],
  variantes: [
    'S1-2: solo trapecio superior 2x20s.',
    'S3-4: trapecio + elevador 2x30s.',
    'S5-6: + ligera presión de la mano.',
    'S7+: + respiración prolongada 40s en cada posición.',
  ],
  notas_columna: 'El trapecio superior y el elevador de la escápula se sobreactivan para sostener la cabeza adelantada y los hombros encogidos del trabajo sentado; esa tensión crónica comprime el segmento cervical alto y mantiene el patrón postural que predispone a la hernia. Liberar estos músculos complementa el fortalecimiento de los flexores y extensores profundos: relajar lo sobreactivo y reforzar lo débil es la fórmula para reequilibrar el cuello. Hacerlo al final de la rutina cervical o en pausas del trabajo de pantalla.'
};

EX_DB['iso-cervical-banda'] = {
  nombre: 'Isométrico cervical con banda elástica',
  categoria: 'Cuello / cervical',
  color: '#1B8A9C',
  descripcion: 'Progresión del isométrico auto-resistido usando una banda elástica como resistencia graduable y constante. Permite cargar la estabilidad anti-movimiento del cuello de forma medible una vez dominado el trabajo con la propia mano.',
  posicion: 'De pie o sentado con la cabeza neutra y doble mentón. La banda se ancla a la altura de la cabeza (o se pasa por la frente/nuca con un agarre cómodo), generando una tracción que el cuello debe resistir sin moverse.',
  pasos: [
    'Coloca la banda de modo que tire de la cabeza en una dirección (frontal, posterior o lateral).',
    'Resiste la tracción manteniendo la cabeza perfectamente inmóvil en neutro con el doble mentón.',
    'Aguanta 10 segundos respirando, sin dejar que la banda te lleve al rango final.',
    'Cambia el anclaje para trabajar cada dirección por separado.',
  ],
  errores: [
    'Permitir que la banda mueva la cabeza hacia el end-range (debe ser isométrico, sin movimiento).',
    'Usar una banda demasiado fuerte que rompa el neutro.',
    'Aguantar la respiración o apretar la mandíbula.',
  ],
  variantes: [
    'S1-2: no introducir — consolidar antes el auto-resistido.',
    'S3-4: banda ligera frontal y posterior 3x8s.',
    'S5-6: banda ligera en las 4 direcciones 3x10s.',
    'S7+: banda media en las 4 direcciones 3x10s.',
  ],
  notas_columna: 'Es la versión cargada del trabajo isométrico anti-movimiento, equivalente a pasar del Pallof con banda ligera a banda fuerte en el core. La banda da una resistencia constante y medible que permite progresar de forma objetiva la estabilidad cervical, manteniendo la regla de oro: el cuello trabaja en neutro y nunca se deja arrastrar al rango final bajo carga. Introducir solo cuando el isométrico con la propia mano sea sólido y sin síntomas. Parar ante cualquier mareo, hormigueo en los brazos o dolor irradiado.'
};

// ═══════════════════════════════════════════════════════════════════
// ─── FICHAS DE MOVILIDAD TORACICA Y CADERA (descarga del cuello) ───
// El dolor cervical suele venir de una columna toracica rigida: si la
// espalda media no extiende ni rota bien, el cuello compensa. Estos
// ejercicios devuelven movilidad dorsal y de cadera para que el cuello
// trabaje menos. Complementan la rutina del grupo NECK.
// ═══════════════════════════════════════════════════════════════════

EX_DB['apertura-toracica-disco'] = {
  nombre: 'Apertura torácica con disco (thoracic plate opener)',
  categoria: 'Movilidad torácica',
  color: '#1A6E8A',
  descripcion: 'Apertura del pecho y extensión de la columna torácica media usando el peso de un disco como ayuda. La carga ligera por encima de la cabeza, combinada con el apoyo en el foam roller, lleva los hombros a flexión y el tórax a extensión, justo lo contrario de la postura encorvada de pantalla.',
  posicion: 'De rodillas frente a un foam roller colocado en horizontal. Disco (o mancuerna/mochila con peso en casa) sujeto con ambas manos. Glúteos bajando hacia los talones.',
  pasos: [
    'Apoya los codos/antebrazos sobre el foam roller con el disco sujeto entre las manos.',
    'Baja los glúteos hacia los talones mientras llevas los brazos por encima de la cabeza.',
    'Deja que el pecho "caiga" entre los brazos: el movimiento abre el tórax y extiende la zona dorsal.',
    'La extensión ocurre en la columna TORÁCICA, no en la lumbar (no arquees la zona baja para bajar más).',
    'Sostén la posición de apertura unos segundos y vuelve con control.',
  ],
  errores: [
    'Arquear la zona lumbar para ganar rango — el objetivo es la columna torácica.',
    'Encoger los hombros hacia las orejas en lugar de dejar caer el pecho.',
    'Usar demasiado peso: es movilidad, no fuerza; el disco solo guía la apertura.',
  ],
  variantes: [
    'S1-2: sin peso, brazos sobre el rodillo, rango corto.',
    'S3-4: disco ligero 2-5 kg + pausa 2 seg.',
    'S5-6: disco 5-10 kg, apertura completa.',
    'S7+: tumbado en banco con los omóplatos en el borde, disco con brazos extendidos dejando caer el peso por gravedad (arco torácico).',
    'Casa: foam roller o borde del sofá + mancuerna/mochila con peso.',
  ],
  notas_columna: 'La extensión torácica es la movilidad que más se pierde con el trabajo sentado y la que más necesita el cuello: cuando la espalda media no extiende, las cervicales bajas (C5-C6/C6-C7) compensan hiperextendiéndose, que es el mecanismo que predispone a la hernia cervical. Recuperar la extensión dorsal descarga directamente ese trabajo del cuello. Importante para L4-S1: la extensión debe ocurrir en el tórax y nunca en la lumbar — el foam roller y el cue de glúteos a talones ayudan a aislar el segmento correcto. Complementa la rutina cervical del grupo NECK.'
};

EX_DB['side-bend-pica'] = {
  nombre: 'Inclinación lateral con pica (side bend)',
  categoria: 'Movilidad torácica',
  color: '#1A6E8A',
  descripcion: 'Inclinación lateral del tronco con los brazos extendidos por encima de la cabeza para estirar los músculos intercostales, el dorsal ancho y los oblicuos. Libera la tensión que se acumula en los costados del torso al mantener la misma postura durante horas.',
  posicion: 'De rodillas sobre un banco (o de pie). Pica/palo sujeto con ambas manos por encima de la cabeza, brazos estirados. Espalda recta, pelvis estable.',
  pasos: [
    'Lleva la pica por encima de la cabeza con los brazos estirados y el tronco erguido.',
    'Inclina el tronco lateralmente hacia un lado de forma controlada, manteniendo la espalda recta.',
    'No rotes ni te vayas hacia delante: el movimiento es puramente lateral.',
    'Siente el estiramiento en el costado opuesto (costillas, dorsal, oblicuo).',
    'Vuelve al centro con control y cambia de lado.',
  ],
  errores: [
    'Llevar la inclinación a la zona lumbar en vez de a las costillas/tórax.',
    'Rotar el tronco o proyectar la cadera hacia un lado.',
    'Curvar la espalda hacia delante perdiendo la verticalidad.',
  ],
  variantes: [
    'S1-2: sin pica, manos en la cabeza, rango corto.',
    'S3-4: pica overhead, rango medio + pausa 2 seg.',
    'S5-6: pica, rango completo con control excéntrico.',
    'S7+: de pie con una barra ligera sobre los hombros (más estabilidad central).',
    'Casa: palo de escoba en lugar de pica.',
  ],
  notas_columna: 'La movilidad lateral del tórax y la elasticidad del dorsal ancho influyen directamente en el cuello: el dorsal conecta el brazo con la columna y, si está acortado, tira de los hombros hacia dentro y favorece la cabeza adelantada. Liberar los costados e intercostales mejora también la mecánica respiratoria y la posición de las costillas. Clave de seguridad para L4-S1: la inclinación es torácica/costal — mantener la lumbar neutra y no cargar el lateral en flexión lumbar, especialmente en la variante con barra.'
};

EX_DB['ext-toracica-banco-pica'] = {
  nombre: 'Extensión torácica en banco con pica (overhead)',
  categoria: 'Movilidad torácica',
  color: '#1A6E8A',
  descripcion: 'Estiramiento clásico de extensión torácica con apoyo de los codos en un banco y los brazos por encima de la cabeza. Combate la postura encorvada y de hombros caídos, abriendo el tórax y estirando los dorsales. Versión overhead de la movilidad torácica en banco.',
  posicion: 'De rodillas frente a un banco (en casa: silla, cama o sofá firme). Codos apoyados en el banco, pica sujeta con las manos por encima de la cabeza. Cadera sobre las rodillas.',
  pasos: [
    'Apoya los codos en el banco con la pica sujeta por encima de la cabeza.',
    'Mantén la cadera sobre las rodillas (no la lleves hacia atrás).',
    'Deja caer el pecho hacia el suelo entre los brazos, sintiendo cómo se extiende la columna torácica y se estiran los dorsales.',
    'No arquees la zona lumbar para bajar más: el rango lo da el tórax.',
    'Respira largo, exhalando en el punto de máxima apertura.',
  ],
  errores: [
    'Arquear la lumbar para ganar profundidad (debe extenderse el tórax, no la zona baja).',
    'Llevar la cadera hacia los talones, lo que reduce la extensión torácica.',
    'Tensar el cuello empujando la barbilla hacia delante: la cabeza acompaña a la columna.',
  ],
  variantes: [
    'S1-2: codos en banco, caída mínima.',
    'S3-4: con pica, pausa 3 seg en el fondo.',
    'S5-6: sin pica, solo codos, dejando caer cabeza y pecho más profundo.',
    'S7+: profundidad máxima + respiraciones largas exhalando en el fondo.',
    'Casa: usar una silla, la cama o un sofá firme en lugar del banco.',
  ],
  notas_columna: 'Es uno de los estiramientos más eficaces para revertir la postura cifótica (hombros caídos, espalda alta redondeada) que obliga al cuello a hiperextenderse para mantener la mirada al frente — el patrón que sobrecarga C5-C6/C6-C7. Complementa la extensión torácica en cuádrupeda y sobre fitball del mismo bloque, añadiendo el componente de estiramiento del dorsal por la posición overhead. Regla para L4-S1: el rango debe salir del tórax; mantener la lumbar neutra y no compensar arqueando la zona baja.'
};

EX_DB['pancake-straddle'] = {
  nombre: 'Pancake (estiramiento en straddle)',
  categoria: 'Movilidad cadera',
  color: '#7A3DAA',
  descripcion: 'Estiramiento en posición de piernas muy abiertas (straddle) inclinando el torso hacia delante con la espalda recta. Abre las caderas y estira la cadena posterior (aductores e isquiotibiales). La rigidez de cadera suele compensarse con mala postura en la columna lumbar y cervical.',
  posicion: 'Sentado en el suelo con las piernas muy abiertas en forma de "V". Banda elástica anclada al frente (en casa: a un mueble bajo o al pie de la cama; en gym: polea ligera) para ayudar a mantener la espalda erguida.',
  pasos: [
    'Siéntate en straddle con las piernas extendidas y las puntas de los pies hacia el techo.',
    'Sujeta la banda anclada al frente para ayudarte a mantener la espalda recta.',
    'Inclina el torso hacia delante desde la CADERA (báscula pélvica anterior), no redondeando la lumbar.',
    'Tira suavemente con la banda para profundizar manteniendo la columna larga.',
    'Mantén respirando, sin rebotes, y sal con control.',
  ],
  errores: [
    'Redondear la espalda baja para "llegar" más adelante — la inclinación es desde la cadera.',
    'Forzar la apertura hasta el dolor en la cara interna del muslo.',
    'Bloquear la respiración.',
  ],
  variantes: [
    'S1-2: V estrecha, manos en el suelo, espalda erguida sin inclinar.',
    'S3-4: banda ligera, inclinación suave desde la cadera.',
    'S5-6: V amplia, banda media, pecho hacia el suelo manteniendo la espalda recta.',
    'S7+: polea/cable con carga ligera para tracción constante (flexibilidad activa).',
    'F3: pancake completo, pecho al suelo.',
  ],
  notas_columna: 'La movilidad de cadera es la base de la que depende toda la postura: cuando las caderas y la cadena posterior están rígidas, la pelvis no bascula bien y la columna compensa, tanto en la zona lumbar (donde está tu extrusión L4-S1) como, en cadena ascendente, en la cervical. Hacer el pancake con la espalda recta es esencial — la banda o polea sirve precisamente para inclinarte desde la cadera sin redondear la lumbar, lo que protege L4-S1 mientras ganas flexibilidad. Una cadera móvil reduce la compensación postural que tensa el cuello.'
};

// ═══════════════════════════════════════════════════════════════════
// ─── GIFS DEMOSTRATIVOS (ExerciseDB · oss.exercisedb.dev) ──────────
// Mapea claves de EX_DB al id de su GIF demostrativa. Las GIFs están
// DESCARGADAS en local (carpeta exgif/<id>.gif) — la app NO llama a
// ninguna API en tiempo de ejecución, así que funciona offline y sin
// depender del rate-limit del servicio.
//
// Solo se mapean ejercicios con un equivalente FIEL en el catálogo libre
// (verificado uno a uno por nombre, 2026-06-18). Los de rehab/movilidad
// puros (pelvic clock, neural flossing, Viparita, cat-cow, clamshell,
// bird-dog, hip-thrust real, bulgarian, etc.) se dejan SIN gif a propósito:
// el catálogo gratuito no los tiene o mostraría un ejercicio distinto.
//
// La GIF es SIEMPRE una demostración genérica — las indicaciones clínicas
// de la ficha (lumbar neutra, parar si irradiación S1) mandan sobre ella.
// Para añadir/cambiar una: descargar exgif/<id>.gif y poner aquí el id.
// ═══════════════════════════════════════════════════════════════════
const EX_GIF = {
  'hiperext':                   'zhMwOwE',  // hyperextension
  'rdl-mancuernas':             'rR0LJzx',  // dumbbell romanian deadlift
  'dead-bug':                   'iny3m5y',  // dead bug
  'good-morning':               'XlZ4lAC',  // barbell good morning
  'glute-bridge':               'u0cNiij',  // low glute bridge on floor
  'glute-bridge-fr':            'u0cNiij',  // low glute bridge on floor
  'single-leg-bridge':          'rmEukuS',  // single leg bridge
  'long-lunge':                 'RRWFUcw',  // dumbbell lunge
  'split-squat-banco':          '9E25EOx',  // split squats
  'estocada-lateral-kb':        'py1HSzx',  // barbell lateral lunge
  'rear-delt-fly':              'EAs3xL9',  // dumbbell reverse fly
  'hanging-ball-raise':         'I3tsCnC',  // hanging leg raise
  'plank-anterior':             'VBAWRPG',  // weighted front plank
  'plank-fr':                   'VBAWRPG',  // weighted front plank
  'movilidad-abductores-suelo': '2Dk4xQV',  // rocking frog stretch
  'ext-toracica-fitball':       'o1HGDSq',  // exercise ball back extension
  'squat-unilateral-fr':        'C31LMnP',  // one leg squat
  'pigeon-pose':                'QY39eBr',  // seated piriformis stretch (figura-4)
  // ── ejercicios de gimnasio (2026-06-18) ──
  'jalon-ancho':                'LEprlgG',  // cable lat pulldown
  'jalon-amplio':               'LEprlgG',  // cable lat pulldown
  'jalon-neutro':               'rkg41Fb',  // parallel/neutral grip lat pulldown
  'remo-maquina':               '7I6LNUG',  // lever seated row
  'prensa':                     '10Z2DXU',  // sled 45° leg press
  'curl-barra':                 '6TG6x2w',  // ez barbell curl
  'curl-martillo':              '2NpxjC1',  // dumbbell hammer curl
  'triceps-polea':              '3ZflifB',  // cable pushdown
  'press-smith':                '5v7KYld',  // smith incline bench press
  'press-hombro-maq':           '67n3r98',  // lever shoulder press
  'abduccion-maq':              'CHpahtl',  // lever seated hip abduction
  'aperturas-cable':            '0CXGHya',  // cable cross-over
  'hack-squat':                 'Qa55kX1',  // sled hack squat
  'goblet-squat':               'ZA8b5hc',  // kettlebell goblet squat
  'step-up':                    'aXtJhlg',  // dumbbell step-up
  'pull-over':                  '9XjtHvS',  // dumbbell pullover
  'pajaros':                    'EAs3xL9',  // dumbbell reverse fly (rear delt)
  'rdl-barra':                  'wQ2c4XD',  // barbell romanian deadlift
  'leg-extension':              'my33uHU',  // lever leg extension
  'leg-curl':                   '17lJ1kr',  // lever lying leg curl
  'elevaciones-lat':            'DsgkuIt',  // dumbbell lateral raise
  'press-smith-plano':          'trqKQv2',  // smith bench press (plano)
  'remo-mancuerna':             'BJ0Hz5L',  // dumbbell bent over row
  'fondos-triceps':             '7aVz15j',  // triceps dips floor
  'crunches-fitball':           'Gn5FwYT',  // stability ball crunch
  'l-sit':                      'UpWmA5E',  // l-sit on floor
};

// ─── DIAGRAMAS ESQUEMÁTICOS (SVG propios, en eximg/<id>.svg) ───────
// Para ejercicios de rehab/movilidad sin equivalente fiel en ExerciseDB.
// Son diagramas propios (sin copyright), dibujados a propósito para el
// plan, con el cue de lumbar neutra. Se muestran solo si la ficha NO
// tiene GIF en EX_GIF. Valor = nombre del archivo en eximg/ (sin .svg).
const EX_IMG = {
  'viparita': 'viparita',  // piernas en la pared (Viparita Karani)
  // ── cuello / cervical (2026-06-25) ──
  'chin-tuck':         'chin-tuck',          // flexion craneocervical supino
  'chin-tuck-pared':   'chin-tuck',          // reutiliza el diagrama de chin tuck
  'head-lift':         'head-lift',          // elevacion de cabeza con doble menton
  'iso-cervical':      'iso-cervical',       // isometrico auto-resistido
  'iso-cervical-banda':'iso-cervical',       // reutiliza el diagrama de isometrico
  'neck-cars':         'neck-cars',          // movilidad cervical controlada
  'prone-neck-ext':    'prone-neck-ext',     // extension cervical prona
  'upper-trap-stretch':'upper-trap-stretch', // estiramiento trapecio superior
  // ── movilidad toracica y cadera, descarga cervical (2026-06-25) ──
  'apertura-toracica-disco':'apertura-toracica-disco', // thoracic plate opener
  'side-bend-pica':         'side-bend-pica',          // inclinacion lateral
  'ext-toracica-banco-pica':'ext-toracica-banco-pica', // extension toracica overhead
  'pancake-straddle':       'pancake-straddle',        // pancake / straddle
};

// ─── ENLACES A YOUTUBE (demostración real, en el minuto exacto) ────
// Mapea wid -> { id: id del vídeo de YouTube, autor: canal, t: segundo
// opcional de inicio }. La app abre el vídeo en una pestaña nueva. Si el
// vídeo es de un solo ejercicio, no hace falta `t` (abre al principio);
// `t` solo se usa cuando un vídeo cubre varios ejercicios.
// IMPORTANTE: los ids son REALES y verificados (oembed). No inventar ids.
// El vídeo es una demostración externa GENÉRICA: la ficha (lumbar neutra,
// parar si irradiación S1) manda sobre lo que se vea en el vídeo.
const EX_YT = {
  'hip-cars':                 { id:'hRMrq6G81p8', autor:'Cleveland Clinic' },        // Hip CARs
  'cossack-shifts':           { id:'tpczTeSkHz0', autor:'FitnessFAQs' },             // Cossack / zancada lateral
  '90-90':                    { id:'VYvMMw8z3rE', autor:'Jack Hanrahan Fitness' },   // 90/90 hip stretch
  'neck-cars':                { id:'BsZmSx34hvQ', autor:'Precision Movement' },       // Neck CARs
  'ext-toracica-cuadrupedia': { id:'AzCghjjWt5k', autor:'Vive Health' },             // Rotación torácica en cuadrupedia
  'cat-cow':                  { id:'dRXO0agekxA', autor:'Momenta Chiropractic' },     // Cat-cow torácico
};

// ═══════════════════════════════════════════════════════════════════
// ─── BACKUP DE DATOS — exportado de rehab_bor_v9 (2026-05-11) ─────
// Mergeado con historial anterior. Fuente autoritativa: JSON export.
// app.js lo aplica al inicializar solo si no existen datos locales.
// ═══════════════════════════════════════════════════════════════════

const BACKUP_WEIGHTS = {
  // ── Cadena posterior / Lunes ──────────────────────────────────
  "rdl-mancuernas":   { w65: 7.5,   history: { 4: "green" }, lastLog: "S4: Avanzado (13/4/2026)" },
  "curl-barra":       { w65: 7.5 },
  "curl-martillo":    { w65: 8 },                                       // JSON: 8 (más reciente que backup anterior 7.5)

  // ── Tiro vertical + Hip / Martes ─────────────────────────────
  "jalon-ancho":      { w65: 18,    history: { 4: "amber" }, lastLog: "S4: Mantenido (15/4/2026)" },  // JSON: 18
  "jalon-neutro":     { w65: 18 },
  "pull-over":        { w65: 16,    history: { 4: "green" }, lastLog: "S4: Avanzado (15/4/2026)" },   // JSON: 16
  "triceps-polea":    { w65: 10 },

  // ── Pecho + Tiro horizontal / Jueves ─────────────────────────
  "press-smith":      { w65: 12.5 },
  "press-smith-plano":{ w65: 10 },                                      // sin entrada en JSON → valor inicial
  "aperturas-cable":  { w65: 36 },
  "pec-deck":         { w65: 20 },                                      // sin entrada en JSON → valor inicial
  "face-pull":        { w65: 12.5,  history: { 3: "amber" }, lastLog: "S3: Mantenido (10/4/2026)" },  // JSON: 12.5
  "remo-maquina":     { w65: 40 },
  "remo-mancuerna":   { w65: 14 },                                      // nuevo en JSON v9

  // ── Squat + Hombro / Viernes ──────────────────────────────────
  "prensa":           { w65: 16,    history: { 3: "green" }, lastLog: "S3: Avanzado (10/4/2026)" },   // JSON: 16
  "goblet-squat":     { w65: 10 },                                      // JSON: "goblet" → mapeado a goblet-squat
  "hack-squat":       { w65: 16 },
  "press-hombro-maq": { w65: 0 },                                       // sin datos
  "elevaciones-lat":  { w65: 7.5,   history: { 3: "amber" }, lastLog: "S3: Mantenido (10/4/2026)" },
  "pajaros":          { w65: 0 },                                       // sin datos
  "abduccion-maq":    { w65: 0 },                                       // sin datos
};

// ─── VARIANTES POR ETAPA ──────────────────────────────────────────
// Semana de referencia del JSON: S8 (2026-05-11)
const BACKUP_VSTAGES = {
  // ── Semana 4 (histórico) ──────────────────────────────────────
  "Couch stretch":                               { 4: "S5-6" },
  "Good morning con banda elastica":             { 4: "S5-6" },
  "Elephant walk estatico":                      { 4: "S3-4" },
  "RDL con mancuernas":                          { 4: "S3-4" },
  "RDL unilateral en banco — mancuerna":         { 4: "S3-4" },
  "Bird dog con pausa":                          { 4: "S3-4" },
  "Dead bug con extension completa":             { 4: "S5-6" },
  "Bloque 1 — Espalda tecnica (16 min ~40%)":    { 4: "S3-4" },
  "Bloque 2 — Crol variado (16 min ~40%)":       { 4: "S3-4" },
  "Bloque 3 — Braza con pull buoy (8 min ~20%)": { 4: "S3-4" },
  "Jalon al pecho agarre ancho":                 { 4: "S3-4" },
  "Pull-over en polea alta":                     { 4: "S5-6" },
  "Fondos de triceps en banco":                  { 4: "S7+" },
  "Extension de triceps en polea alta":          { 4: "S5-6" },

  // ── Semana 7 (nuevo en JSON v9) ───────────────────────────────
  "Face pull en polea":                          { 7: "S1-2" },
  "Press plano en Smith":                        { 7: "S1-2" },
};

// ─── SEMANA DE REFERENCIA DEL EXPORT ─────────────────────────────
// Usar para restaurar WEEK_NUM si localStorage está vacío
const BACKUP_WEEK = 8;
