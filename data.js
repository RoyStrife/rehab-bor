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
    { n: 'Viparita Karani', d: '8 min', note: 'Dia neural · Version prolongada · Respiracion diafragmatica lenta · Gluteos separados de la pared', wid: 'viparita' },
    { n: 'Hip flexor stretch', d: '2x40 seg cada lado', note: 'Pasivo · Sin forzar · Gluteo trasero activo', wid: 'hip-flexor' },
    { n: 'Neural flossing nervio ciatico', d: '2x6 cada lado', note: 'Solo sin irradiacion activa · Deslizamiento puro · Muy suave', wid: 'neural-flossing', variant: 'S1-2: angulo 30-40° muy suave · S3-4: angulo 60° · S5-6: angulo 80° · S7+: angulo completo + dorsiflexion' },
    { n: 'Descompresion lateral (side-lying)', d: '2-3 min sobre lado no sintomatico', note: 'Dia neural — descarga pasiva prioritaria · Tumbado sobre el lado derecho (no sintomatico) · Toalla firmemente enrollada bajo la cintura · Dejar caer cadera y costillas abrazando la curva · Completamente pasivo · Abre el foramen L5-S1 izquierdo · Complementa Viparita Karani', wid: 'side-lying-decomp' },
  ]
};

// ─── B — CALENTAMIENTOS PRE-GYM (por día) ─────────────────────────

const MOB_BLOCK_B_LUN = {
  id: 'B', name: 'Calentamiento — Cadena posterior', dur: '15 min', color: '#1A6E3A',
  exs: [
    { n: 'Heel sit', d: '2x45 seg', note: 'Primero · Tronco erguido estricto · Sin retroversion lumbar · Cuadriceps activos frenando · Despues de al menos 30 min en bipedestacion', wid: 'heel-sit-ex' },
    { n: 'Couch stretch', d: '2x40 seg cada lado', note: 'Psoas pre-RDL · Rodilla trasera en suelo junto a pared', variant: 'S1-2: tronco erguido manos en rodilla delantera · S3-4: manos en cadera · S5-6: tronco ligeramente atras · S7+: pie en pared' },
    { n: 'Puente gluteo dinamico', d: '2x10 — 2 seg arriba', note: 'Activacion gluteo pre-hiperextension', wid: 'glute-bridge' },
    { n: 'Deadbug activacion — un miembro', d: '2x6 cada lado', note: 'Core pre-cadena posterior · Lumbar pegada al suelo', wid: 'dead-bug' },
    { n: 'Cat-cow toracico', d: '2x8 lentos', note: 'Solo movimiento toracico · Lumbar estable', wid: 'cat-cow' },
    { n: 'Rotacion toracica en suelo', d: '2x6 cada lado', note: 'Hombros en suelo · Amplitud sin dolor', wid: 'rotacion-toracica' },
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
  id: 'B', name: 'Calentamiento — Empuje/Tiro + Manguito', dur: '18 min', color: '#1A6E3A',
  exs: [
    { n: 'Heel sit', d: '2x45 seg', note: 'Primero · Tronco erguido estricto · Sin retroversion lumbar · Cuadriceps activos frenando', wid: 'heel-sit-ex' },
    { n: 'Cat-cow toracico', d: '2x8 lentos', note: 'Solo movimiento toracico · Lumbar estable', wid: 'cat-cow' },
    { n: 'Rotacion toracica en suelo', d: '2x6 cada lado', note: 'Hombros en suelo · Amplitud sin dolor', wid: 'rotacion-toracica' },
    { n: 'Extension toracica en foam roller', d: '2 min T4-T10', wid: 'ext-toracica-foam', note: 'Solo toracico — nunca lumbar · Prepara el arco de press' },
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
  id: 'G', name: 'Piscina — Largos adaptables + descompresion', dur: '35-40 min', color: '#185FA5',
  exs: [
    { n: 'Traccion lumbar en barra', d: '3x30 seg', note: 'Descompresion inicial · Rodillas recogidas · Dejar que el agua tire · Hombros relajados', wid: 'traccion-barra-agua' },
    { n: 'Marcha / aquajogging suave', d: '8-10 min ritmo comodo', note: 'Cardio bajo impacto · Core activo · SIN sprints · Calentamiento del nado', wid: 'aqua-jogging', variant: 'S1-2: 6 min muy suave · S3-4: 8 min suave · S5-6: 10 min ritmo comodo · S7+: 10 min con cambios de ritmo suaves' },
    { n: 'Bloque espalda — tecnica (lo mas descompresivo)', d: 'Ver variante · Estilo principal L5-S1', note: 'Posicion supina la mas descompresiva · Bilateral por defecto · Empezar siempre por espalda', variant: 'S1-2: 6x50m espalda basica descanso 30s · S3-4: 8x50m espalda descanso 20s · S5-6: 4x100m espalda · S7+: 3x150m espalda + 2x25m sprint · F3: 400m continuo + 4x25m sprint' },
    { n: 'Bloque crol con pull buoy', d: 'Ver variante · Ritmo comodo', note: 'Pull buoy para descargar piernas · Respiracion bilateral cada 3 brazadas', variant: 'S1-2: 4x50m pull buoy descanso 30s · S3-4: 6x50m pull buoy descanso 20s · S5-6: 4x100m alternando · S7+: 3x150m · F3: 400m continuo' },
    { n: 'Bloque braza con pull buoy (sin patada)', d: 'Ver variante · Pull buoy obligatorio', note: 'SOLO brazada · Pull buoy fija las piernas · Sin patada de braza — evita extension lumbar activa', variant: 'S1-2: 4x25m descanso 30s · S3-4: 6x25m descanso 20s · S5-6: 4x50m · S7+: 2x100m · F3: 200m continuo' },
    { n: 'Cierre — flotacion supina + respiracion', d: '3-5 min', note: 'Descompresion total · Columna sin carga · Respiracion diafragmatica lenta · Activacion parasimpatica', wid: 'flotacion-supino' },
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
    n:'Dead bug con extension completa', d:'3x10 cada lado', note:'Lumbar pegada al suelo siempre', wid:'dead-bug',
    variant:'S1-2: un miembro solo · S3-4: contralateral completo · S5-6: press palma rodilla · S7+: con peso en pie' },
  'B':  { grupo:'core', plano:'anti-rot', equipo:'bw',
    n:'Bird dog con pausa', d:'3x10 cada lado — pausa 3 seg', note:'Control pelvico', wid:'bird-dog',
    variant:'S1-2: brazo o pierna separado · S3-4: contralateral pausa 3s · S5-6: banda tobillo · S7+: superficie inestable' },
  'C':  { grupo:'core', plano:'anti-ext', equipo:'bw',
    n:'Plank anterior', d:'3x30-45 seg', note:'Empujar suelo con codos · Gluteo y core activos · Lumbar neutra', wid:'plank-anterior',
    variant:'S1-2: 20s rodillas · S3-4: 30s completo · S5-6: 45s · S7+: elevacion alterna de brazo/pierna' },
  'D':  { grupo:'core', plano:'anti-lat', equipo:'bw',
    n:'Plank lateral', d:'3x25-35 seg cada lado', note:'Cadera elevada · Cuerpo en linea · Anti-flexion lateral', wid:'plank-lateral',
    variant:'S1-2: rodillas 20s · S3-4: completo 25s · S5-6: 35s · S7+: abduccion de pierna superior' },
  'E':  { grupo:'core', plano:'anti-ext', equipo:'bw',
    n:'Hollow body hold', d:'3x20 seg', note:'Lumbar neutra obligatorio · Solo sin irradiacion', wid:'hollow-body',
    variant:'S1-2: rodillas 15s · S3-4: piernas 45° 20s · S5-6: piernas 30° 25s · S7+: piernas 15° 30s · F3: en barra 3x10-15s' },
  'F':  { grupo:'core', plano:'anti-ext+descomp', equipo:'barra',
    n:'Hollow body hang colgado en barra', d:'3x10-15 seg', note:'Colgado de la barra en hollow (lumbar neutra, pelvis en retroversion suave) · Core anti-extension + traccion descompresiva · Solo sin irradiacion · Soltar si falla agarre o irradiacion S1', wid:'hollow-body',
    variant:'S1-2: dead hang pasivo 3x20s — solo descompresion · S3-4: rodillas recogidas (tuck) 3x10s · S5-6: tuck + extension parcial 3x12s · S7+: hollow hang piernas extendidas 3x10-15s · F3: con elevacion de rodillas' },
  'G':  { grupo:'core', plano:'anti-rot', equipo:'polea',
    n:'Pallof press en polea', d:'3x10 diagonal cada lado', note:'Anti-rotacion · Resistir el giro sin generarlo — lo mas protector para la extrusion', wid:'pallof-press',
    variant:'S1-2: isometrico pecho · S3-4: press diagonal · S5-6: press + paso lateral · S7+: de rodillas en superficie inestable' },
  'G2': { grupo:'core', plano:'anti-rot', equipo:'banda',
    n:'Pallof press con banda', d:'3x10 cada lado', note:'Anti-rotacion version banda (apta para casa) · Banda anclada al costado a altura de pecho · Pelvis y tronco fijos', wid:'pallof-press',
    variant:'S1-2: banda ligera isometrico pecho · S3-4: banda media press diagonal · S5-6: banda fuerte · S7+: + paso lateral' },
  'H':  { grupo:'core', plano:'anti-lat', equipo:'bw/banco',
    n:'Copenhagen plank (plancha de aductores)', d:'3x15-25 seg cada lado', note:'Variada · Pie/rodilla superior en banco · Aductor + oblicuo + estabilizador de cadera · Pelvis nivelada', wid:'copenhagen-plank',
    variant:'S1-2: rodilla apoyada (palanca corta) 3x15s · S3-4: rodilla mas tiempo 3x20s · S5-6: pie en banco palanca larga 3x15s · S7+: pie en banco + elevacion de pierna libre' },
  'I':  { grupo:'core', plano:'transfer-agua', equipo:'piscina',
    n:'Streamline + plancha flotante con pull buoy', d:'4x15-20 m / 30 seg', note:'Lleva el brace de la plancha al agua · Pull buoy entre los muslos · Cuerpo rigido en hollow/streamline (lumbar neutra) · Deslizar manteniendo el mismo brace que en tierra · Sin arquear', wid:'hollow-body',
    variant:'S1-2: hold streamline estatico agarrado al borde 4x20s · S3-4: deslizamiento tras impulso 4x15m · S5-6: deslizamiento + patada suave manteniendo linea · S7+: deslizamiento largo + rotacion controlada' },
  'J':  { grupo:'core', plano:'anti-ext-inf', equipo:'polea',
    n:'Leg raise en polea baja', d:'3x10', note:'Decubito supino · Cable en tobillos · Lumbar pegada al suelo — PARAR si se despega', wid:'leg-raise-polea',
    variant:'S1-4: no introducir · S5-6: rodillas semiflexionadas peso minimo 3x8 · S7+: piernas mas extendidas 3x10 · F3: piernas rectas rango completo' },
  'K':  { grupo:'core', plano:'anti-lat', equipo:'mancuerna/banda',
    n:'Suitcase carry / hold', d:'3x30-40 seg o 3x20m por lado', note:'Peso en UNA mano (mancuerna, KB o banda) · Anti-flexion lateral · Tronco vertical sin inclinarse hacia el peso · Hombros y caderas nivelados', wid:'flexion-lateral-mancuerna',
    variant:'S1-2: hold ligero 30s · S3-4: hold medio 40s · S5-6: caminata (carry) 20m · S7+: carry pesado 20m + cambios de direccion' },
  'L':  { grupo:'core', plano:'compuesto', equipo:'bw',
    n:'L-sit progresion', d:'3x10-15 seg', note:'Flexores de cadera + core · Solo sin irradiacion', wid:'l-sit',
    variant:'S1-2: pies 5cm 8s · S3-4: tucked 10s · S5-6: tucked 15s · S7+: piernas extendidas' },
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
};

// Lookup combinado con IDs GLOBALES prefijados por grupo (CORE-A, HIP-B, ...)
// Futuros grupos se anaden a este array.
const CAT = {};
for (const [pfx, grp] of [['CORE', CORE], ['HIP', HIP]])
  for (const k in grp) CAT[pfx + '-' + k] = grp[k];

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

const WEEK = {

  // ─── 1 — LUNES: Cadena posterior + Core + Biceps ──────────────
  1: {
    name: 'Lunes', tag: 'Posterior + Core + Biceps', neural: false,
    dur: '130 min', loc: 'Gym', homeLoc: 'Casa',
    keyExs: 'Hiperext bilateral · Hiperext unilateral · RDL bilateral · RDL unilateral banco',
    cardio: 'Ergometro de remo — 2000m FC 110-125',
    blocks: [
      MOB_BLOCK_A1,
      MOB_BLOCK_B_LUN,
      {
        id: 'C', name: 'Cardio sala — Ergometro', dur: '15-20 min', color: '#185FA5',
        exs: [
          { n: 'Ergometro de remo', d: '2000m — FC 110-125', note: 'Drive con piernas primero · Espalda neutra · Damper 3-4 · Anotar parcial 500m y media de carrera', wid: 'ergometro', gym: true,
            homeAlt: { n: 'Caminata activa o marcha', d: '20-25 min — ritmo moderado', note: 'Alternativa cardio en casa · Paso largo · Tronco erguido · Sin impacto' } },
        ]
      },
      {
        id: 'D', name: 'Lumbar — Cadena posterior', dur: '45 min', color: '#3C3489',
        exs: [
          { n: 'Good morning con banda elastica', d: '3x12', note: 'Activacion bisagra · Calentamiento patron hinge antes de carga · Espalda neutra siempre', wid: 'good-morning',
            variant: 'S1-2: banda ligera 3x12 · S3-4: banda media 3x10 · S5-6: banda fuerte 3x10 · S7+: barra vacia 3x10 · F3: seated GM barra' },
          { n: 'Hiperextension banco 45 grados', d: '4x10', note: 'Motor principal bilateral — progresion por estadios · Variacion: unilateral (S5+, 3x8 c/lado)', wid: 'hiperext', gym: true,
            variant: 'S1-2: iso hold neutro 4x25s — rango parcial 4x20s · S3-4: rango completo sin peso exc 3s · S5-6: +20kg 4x8 exc 3s · S7+: +40kg 4x6-8 · F3: criterio 40kg 4x6 tecnica impecable',
            homeAlt: { n: 'Superman con cinta yoga', d: '4x12 — pausa 2 seg arriba', note: 'Cinta yoga bajo el abdomen como fulcro · Extension cadera pura · Cabeza neutra · Sin hiperlordosis', variant: 'S1-2: iso hold 4x20s sin elevacion de piernas · S3-4: extension completa sin peso exc 3s · S5-6: tobillera ligera 1kg · S7+: tobillera 2kg + pausa 3s' } },
          { n: 'RDL con mancuernas', d: '3x8 — espalda neutra REQUISITO', note: 'Columna neutra en todo el rango · Parar si irradiacion S1 · Variacion: RDL unilateral en banco (S3+, 3x8 c/lado exc 3s)', wid: 'rdl-mancuernas', gym: true,
            variant: 'S1-2: 8-10 kg — patron y activacion glutea · S3-4: 12-14 kg rango parcial hasta rodillas · S5-6: 16-18 kg rango completo · S7+: 20 kg+ tecnica impecable (criterio F3)',
            homeAlt: { n: 'RDL postural con banda yoga', d: '3x10 — foco en patron', note: 'Cinta yoga anclada bajo los pies · Resistencia posterior leve · Espalda neutra requisito absoluto', variant: 'S1-2: sin banda — patron puro bisagra · S3-4: banda yoga tension baja · S5-6: banda yoga tension media · S7+: banda yoga tension alta exc 3s' } },
          { n: 'Cable pancake en suelo', d: '3x40 seg', note: 'Cierre D · Elongacion cadena posterior completa · No forzar el rango', variant: 'S1-2: apertura minima 30-40° tronco erguido · S3-4: apertura 45° inclinacion suave · S5-6: apertura 60° mayor inclinacion · S7+: apertura maxima comoda + inclinacion lateral izq para L5-S1' },
        ]
      },
      {
        id: 'E', name: 'Core (anti-extension) + Biceps', dur: '35 min', color: '#993C1D',
        exIds: ['CORE-A','CORE-B','CORE-C','CORE-E'],
        exs: [
          { n: 'Curl de biceps en barra Z', d: '3x12', note: 'Codos fijos al torso', wid: 'curl-barra', gym: true,
            variant: 'S1-2: carga ligera rango completo · S3-4: carga media exc 3s · S5-6: carga alta pausa 1s arriba · S7+: carga alta exc 4s + pausa',
            homeAlt: { n: 'Curl de biceps con banda', d: '3x12 — codos fijos', note: 'Banda bajo los pies · Codos pegados al torso · Mismo patron que barra Z', variant: 'S1-2: banda ligera · S3-4: banda media exc 3s · S5-6: banda fuerte pausa 1s arriba · S7+: unilateral banda fuerte exc 4s' } },
          { n: 'Curl martillo con mancuernas', d: '3x12', note: 'Braquial + biceps', wid: 'curl-martillo', gym: true,
            variant: 'S1-2: carga ligera alternado · S3-4: carga media bilateral · S5-6: carga media exc 3s · S7+: carga alta unilateral con apoyo',
            homeAlt: { n: 'Curl martillo con banda (agarre neutro)', d: '3x12 — alternado', note: 'Banda bajo los pies · Agarre neutro (pulgares arriba) · Activa braquial y braquiorradial igual que mancuerna', variant: 'S1-2: banda ligera alternado · S3-4: banda media bilateral · S5-6: banda fuerte exc 3s · S7+: unilateral banda fuerte' } },
        ]
      },
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
      BLOCK_ESTAB_PIERNA,
      { id: 'E', name: 'Core — general 3 planos (pre-piscina)', dur: '15-20 min', color: '#993C1D', exIds: ['CORE-F','CORE-G2','CORE-D','CORE-I'] },
      POOL_UNIFICADA,
    ]
  },

  // ─── 4 — JUEVES: Pecho + Tiro horizontal + Core ────────────────
  4: {
    name: 'Jueves', tag: 'Empuje + Tiro', neural: false,
    dur: '110 min', loc: 'Gym', homeLoc: 'Casa',
    keyExs: 'Scapular pull (descompresion) · Jalon ancho · Remo maquina · Pec deck · Fondos asistidos',
    cardio: 'Bici estatica — 15-20 min FC 110-120',
    blocks: [
      MOB_BLOCK_A1,
      MOB_BLOCK_B_JUE,
      {
        id: 'C', name: 'Cardio sala — Bici estatica', dur: '15-20 min', color: '#185FA5',
        exs: [
          { n: 'Bici estatica (spinning)', d: '15-20 min — FC 110-120 — sin standing', note: 'Sin standing en F2 · Cadencia 70-85 rpm', wid: 'bici-estatica', gym: true,
            homeAlt: { n: 'Marcha activa o step en sitio', d: '20 min — ritmo moderado', note: 'Step elevando rodillas · O marcha exterior · Alternativa cardio en casa' } },
        ]
      },
      {
        id: 'D', name: 'Empuje + Tiro (sin carga axial)', dur: '50 min', color: '#3C3489',
        exs: [
          { n: 'Scapular pull en barra', d: '3x8-10', note: 'PRIMERO — descompresion + activacion · Colgado de la barra · Solo depresion y retraccion escapular · Sin flexion de codo · Traccion descompresiva L4-S1 (aprovecha el colgado para descomprimir) · PARAR si aparece irradiacion S1 al colgar', wid: 'scapular-pull', variant: 'S1-2: banda de suspension — pie en banda, carga parcial · S3-4: barra agarre ancho — ROM completo sin flexion codo · S5-6: pausa 2s en retraccion maxima · S7+: lastre ligero tobillera 1-2 kg' },
          { n: 'Jalon al pecho agarre ancho', d: '4x10 — excentrico 3 seg', note: 'Escapulas activas · Sin carga axial', wid: 'jalon-ancho', gym: true, variant: 'S1-2: 50% exc 4s · S3-4: 60% exc 3s · S5-6: 70% pausa abajo · S7+: dominada asistida',
            homeAlt: { n: 'Remo invertido en mesa (Australian row)', d: '4x10 — excentrico 3 seg', note: 'Tumbado bajo mesa · Agarre ancho · Escapulas activas · Sustituto directo del jalon en casa', variant: 'S1-2: rodillas muy flexionadas carga parcial · S3-4: rodillas a 90° exc 3s · S5-6: piernas extendidas · S7+: pies elevados en silla' } },
          { n: 'Remo en maquina sentado', d: '4x10 codos pegados', wid: 'remo-maquina', note: 'No flexionar columna al tirar · Respaldo de pecho si la maquina lo tiene', gym: true, variant: 'S1-2: carga ligera pausa 1s escapulas retraidas · S3-4: carga media pausa 1s · S5-6: carga alta exc 3s · S7+: carga alta pausa + exc 4s',
            homeAlt: { n: 'Remo con banda anclada (sentado en suelo)', d: '4x10 codos pegados', note: 'Banda anclada baja · Sentado en suelo · Tronco erguido · Sin carga axial', variant: 'S1-2: banda ligera pausa 1s · S3-4: banda media pausa 1s · S5-6: banda fuerte exc 3s · S7+: banda fuerte pausa + exc 4s' } },
          { n: 'Aperturas en maquina pec deck', d: '3x12', note: 'Empuje sin carga axial · Espalda fija en respaldo — sin separar de la maquina', wid: 'pec-deck', gym: true, variant: 'S1-2: carga ligera rango parcial · S3-4: carga media rango completo · S5-6: carga alta exc 3s · S7+: carga alta pausa 1s en contraccion',
            homeAlt: { n: 'Aperturas con banda cruzada', d: '3x12', note: 'Banda anclada a ambos lados altura de pecho · Aduccion horizontal controlada', variant: 'S1-2: banda ligera · S3-4: banda media · S5-6: banda fuerte exc 3s · S7+: banda fuerte pausa 1s' } },
          { n: 'Fondos en maquina asistida (chest dip)', d: '3x12', note: 'Empuje de pecho + triceps SIN carga axial · Maquina asistida (no colgarse del propio peso) · Codos a 90 max · Tronco ligeramente inclinado · Parar si molestia en hombro', wid: 'fondos-triceps', variant: 'S1-2: asistencia alta rango parcial · S3-4: asistencia media rango completo · S5-6: asistencia baja exc 3s · S7+: asistencia minima control · F3: lastre ligero' },
          { n: 'Elevaciones laterales con mancuernas', d: '3x15 peso ligero', note: 'Deltoides medio — sentado · Sin overhead (evita carga axial)', wid: 'elevaciones-lat', gym: true, variant: 'S1-2: sentado carga muy ligera · S3-4: sentado carga ligera exc 3s · S5-6: sentado carga media · S7+: de pie carga media + pausa 1s arriba',
            homeAlt: { n: 'Elevaciones laterales con banda', d: '3x15 — sentado', note: 'Banda bajo los pies · Agarre neutro · Deltoides medio', variant: 'S1-2: banda muy ligera · S3-4: banda ligera exc 3s · S5-6: banda media · S7+: banda media + pausa 1s' } },
          { n: 'Extension de triceps en polea alta', d: '4x15 codos fijos', note: 'Cuerda — separar al final', wid: 'triceps-polea', gym: true, variant: 'S1-2: carga minima codos bien fijados · S3-4: carga media + separacion al final · S5-6: carga alta exc 3s · S7+: unilateral alternando',
            homeAlt: { n: 'Extension de triceps con banda sobre cabeza', d: '4x15 codos fijos', note: 'Banda anclada alta o sostenida · Codos pegados', variant: 'S1-2: banda ligera · S3-4: banda media exc 3s · S5-6: banda fuerte + separacion · S7+: unilateral banda fuerte' } },
          { n: 'Curl de biceps en barra Z', d: '3x12', note: 'Codos fijos al torso', wid: 'curl-barra', gym: true, variant: 'S1-2: carga ligera rango completo · S3-4: carga media exc 3s · S5-6: carga alta pausa 1s arriba · S7+: carga alta exc 4s + pausa',
            homeAlt: { n: 'Curl de biceps con banda', d: '3x12 — codos fijos', note: 'Banda bajo los pies · Codos pegados al torso', variant: 'S1-2: banda ligera · S3-4: banda media exc 3s · S5-6: banda fuerte pausa 1s · S7+: unilateral banda fuerte exc 4s' } },
        ]
      },
      {
        id: 'E', name: 'Core (anti-rotacion + anti-lateral) + Neural', dur: '25 min', color: '#993C1D',
        exIds: ['CORE-G','CORE-D','CORE-J','CORE-E'],
        exs: [
          { n: 'Neural flossing nervio ciatico', d: '2x10 cada lado', note: 'Sin dolor · Deslizamiento puro', wid: 'neural-flossing', variant: 'S1-2: angulo 30-40° muy suave · S3-4: angulo 60° ritmo lento · S5-6: angulo 80° · S7+: angulo completo + dorsiflexion' },
        ]
      },
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
      BLOCK_ESTAB_PIERNA,
      { id: 'E', name: 'Core — general 3 planos (pre-piscina)', dur: '15-20 min', color: '#993C1D', exIds: ['CORE-F','CORE-G2','CORE-H','CORE-I'] },
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
          { n: 'Superman hold en suelo', d: '2x8 — pausa 2 seg', note: 'Erectores en elongacion · Version suave', wid: 'superman' },
          { n: 'Single leg reverse hyper', d: '3x12 cada lado', note: 'Tumbado boca abajo en banco · Extension cadera pura sin carga axial · Parar si irradiacion S1', wid: 'single-leg-hyper', variant: 'S1-2: sin peso — ROM parcial 3x8 · S3-4: sin peso ROM completo 3x10 · S5-6: tobillera ligera 1-2 kg 3x12 · S7+: tobillera 3-4 kg 3x12 exc 2s' },
          { n: 'Iso hold cinta yoga puerta', d: '3x20 seg', note: 'Cinta colgada del marco · Tension isometrica posterior · Sin carga axial', wid: 'iso-hold-cinta', variant: 'S1-2: tension minima 10 seg · S3-4: 15 seg moderado · S5-6: 20 seg · S7+: 25 seg una mano' },
          { n: 'Hamstring squeeze', d: '2x8 cada lado', note: 'Isometrico suave · Angulo bajo', wid: 'hamstring-squeeze' },
          { n: 'L-sit progresion', d: '3x series segun nivel', note: 'Sin carga axial · Core + flexores cadera', wid: 'l-sit', variant: 'S1-2: tucked L-sit en sillas 3x5 seg · S3-4: tucked L-sit 3x8 seg · S5-6: un pie extendido 3x8 seg · S7+: L-sit completo 3x10 seg · F3: L-sit en paralelas o anillas' },
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
      {
        id: 'C', name: 'Cardio sala — Eliptica', dur: '15-20 min', color: '#185FA5',
        exs: [
          { n: 'Eliptica', d: '15-20 min — FC 110-125 — resistencia 3-5', note: 'Sin impacto · Postura erguida', wid: 'eliptica', gym: true,
            homeAlt: { n: 'Marcha activa o step en sitio', d: '20 min — ritmo moderado', note: 'Step en sitio elevando rodillas · O marcha en exterior · Alternativa cardio en casa' } },
        ]
      },
      {
        id: 'D', name: 'Pierna — Squat + Bisagra', dur: '55 min', color: '#3C3489',
        exs: [
          { n: 'Leg Extension (extension de cuadriceps)', d: '3x12 — carga moderada', note: 'Bajo impacto lumbar · CIATICA: si sientes dolor no hagas dorsiflexion (dedos atras) — apunta los dedos hacia adelante · Si persiste: mueve el asiento atras y desplaza caderas hacia adelante para crear holgura en el nervio ciatico', wid: 'leg-extension', gym: true,
            variant: 'S1-2: carga muy ligera rango parcial — foco en no activar tension neural · S3-4: carga ligera rango completo dedos neutros · S5-6: carga media rango completo exc 2s · S7+: carga media-alta pausa 1s en extension maxima',
            homeAlt: { n: 'Wall sit isometrico', d: '3x30-45 seg', note: 'Espalda pegada a la pared · Rodillas a 90° · Sin carga axial · Activacion cuadriceps pura — sustituto directo de leg extension en casa', variant: 'S1-2: angulo 100-110° 20s · S3-4: 90° 30s · S5-6: 90° 45s · S7+: unilateral 20s' } },
          { n: 'Leg Curl (curl femoral)', d: '3x12 — carga moderada', note: 'No pone carga axial sobre la columna · Evitar redondear la espalda · CIATICA: si sientes tiron como banda elastica — apunta dedos hacia adelante e inclina el torso ligeramente atras mientras extiendes las piernas', wid: 'leg-curl', gym: true,
            variant: 'S1-2: carga muy ligera — foco en no redondear espalda · S3-4: carga ligera rango completo torso neutro · S5-6: carga media exc 3s · S7+: carga alta pausa 1s en flexion maxima',
            homeAlt: { n: 'Nordic curl excentric asistido', d: '3x6 — descenso controlado 4 seg', note: 'Pies sujetos bajo sofa o cama · Bajar lento · Volver con ayuda de manos · Cadena posterior sin carga axial', variant: 'S1-2: descenso solo hasta 45° · S3-4: descenso completo asistido · S5-6: descenso controlado + pausa · S7+: intento de subida sin asistencia' } },
          { n: 'Prensa inclinada 45 grados', d: '4x10 — descenso 3 seg', note: 'BUTTWINK: coloca ambas manos bajo la zona lumbar — si sientes que la espalda se redondea o el coxis se levanta has llegado a tu rango maximo · El coxis debe estar pegado al asiento en todo momento', wid: 'prensa', gym: true,
            variant: 'S1-2: carga ligera talones elevados — foco en coxis pegado al asiento · S3-4: carga media rango controlado sin buttwink · S5-6: rango completo carga alta exc 3s · S7+: variacion unilateral — un pie en plataforma bloquea mecanicamente la rotacion pelvica',
            homeAlt: { n: 'Sentadilla sumo con banda (motor)', d: '4x15 — pausa 2 seg abajo', note: 'Version principal en casa · Pies muy abiertos · Banda en muslos · Sin carga axial — sustituto directo de prensa', variant: 'S1-2: banda ligera ROM parcial · S3-4: banda media ROM completo · S5-6: banda fuerte pausa 2s · S7+: mancuerna goblet' } },
          { n: 'Sumo squat con peso (KB o mancuerna)', d: '3x10 — profundidad comoda', note: 'Sustituye a sentadilla con barra — evita carga sobre hombros · Sostener el peso entre las piernas (goblet) o apoyarlo en superficie elevada si es necesario · Pies anchos con dedos hacia afuera — esto fuerza la verticalidad del torso · Espalda neutra en todo el rango', wid: 'sumo-squat-kb', gym: true,
            variant: 'S1-2: peso corporal ROM parcial · S3-4: KB 8-12kg ROM completo · S5-6: KB 16-20kg profundidad maxima comoda · S7+: KB 24kg+ pausa 2s abajo',
            homeAlt: { n: 'Sentadilla sumo con banda', d: '3x15', note: 'Pies muy abiertos · Puntas hacia fuera 45° · Activa gluteo medio e interno · Sin carga axial con banda', variant: 'S1-2: banda ligera ROM parcial · S3-4: banda media ROM completo · S5-6: banda fuerte · S7+: mancuerna goblet' } },
          { n: 'Split squat — sentadilla a una pierna', d: '3x10 cada lado — muy lento', note: 'Trabajo unilateral bajo impacto lumbar · NIVEL AVANZADO (anti-rotacion): sostener el peso en un solo brazo opuesto a la pierna adelantada — obliga al cuadrado lumbar y estabilizadores de columna a contraerse · Lento = dificil · Pausas isometricas abajo aumentan la intensidad sin mas carga', wid: 'bulgara',
            variant: 'S1-2: peso corporal ROM parcial — ambos brazos a los lados · S3-4: peso corporal ROM completo pausa 2s abajo · S5-6: mancuerna ligera ambas manos — version simetrica · S7+: mancuerna un solo brazo (opuesto a pierna adelantada) — version anti-rotacion QL · F3: pie trasero elevado en banco (bulgara completa) con carga anti-rotacion' },
          { n: 'Step up al banco', d: '3x10 cada lado', wid: 'step-up', note: 'Banco a altura de rodilla · Subir con talon completo · Bajar controlado 3 seg · Sin impacto lumbar', variant: 'S1-2: escalon bajo 20cm · S3-4: banco 35-40cm · S5-6: banco + pausa arriba 2s · S7+: mancuernas ligeras' },
          { n: 'Hinge (bisagra de cadera) — rango parcial', d: '3x8 — rango comodo sin tiron', note: 'ADVERTENCIA CIATICA: es el movimiento donde mas se tensa el nervio ciatico · Si sientes tiron como una banda elastica a punto de romperse NO fuerces · No necesitas llegar al suelo — el rango parcial permite ganar fuerza · Para si aparece irradiacion S1', wid: 'rdl-mancuernas', gym: true,
            variant: 'S1-2: good morning con banda — solo activacion bisagra sin carga · S3-4: RDL mancuernas livianas hasta rodillas sin forzar · S5-6: RDL carga media rango comodo exc 3s · S7+: RDL rango completo si sin irradiacion · F3: progresar a RDL completo con tecnica impecable (criterio fase 3)',
            homeAlt: { n: 'Good morning con banda elastica', d: '3x12 — foco en patron', note: 'Banda anclada bajo los pies · Bisagra de cadera pura · Espalda neutra requisito absoluto · Parar si tirón ciatico', variant: 'S1-2: banda ligera rango parcial · S3-4: banda media bisagra completa · S5-6: banda fuerte exc 3s · S7+: carga progresiva' } },
        ]
      },
      {
        id: 'E', name: 'Hip, TFL y abductores', dur: '35 min', color: '#993C1D',
        exs: [
          { n: '90/90 stretch activo', d: '2x40 seg cada lado', note: 'Rotacion interna cadera', wid: '90-90', variant: 'S1-2: pasivo — solo mantener posicion con apoyo de manos · S3-4: activo — contraccion gluteo 5s en posicion de estiramiento · S5-6: activo con inclinacion de tronco hacia pierna delantera · S7+: ambas posiciones encadenadas + rotacion activa' },
          { n: 'Clamshell con banda elastica', d: '3x15 cada lado', note: 'Pelvis estable · Rotadores externos', wid: 'clamshell', variant: 'S1-2: sin banda · S3-4: banda ligera · S5-6: banda media · S7+: banda fuerte + pausa 2s arriba' },
          { n: 'Abduccion en maquina', d: '3x15', note: 'Gluteo medio — sentado', wid: 'abduccion-maq', gym: true, variant: 'S1-2: sin carga — solo ROM · S3-4: carga ligera · S5-6: carga media pausa 1s · S7+: carga alta exc 3s',
            homeAlt: { n: 'Side-lying abduccion con banda', d: '3x15 cada lado', note: 'Banda en tobillos · Tumbado de lado · Misma activacion que maquina', variant: 'S1-2: sin banda · S3-4: banda ligera · S5-6: banda media · S7+: banda fuerte pausa 1s arriba' } },
          { n: 'Monster walk lateral con banda', d: '3x15m', note: 'Gluteo medio · Cadera neutral', wid: 'monster-walk', variant: 'S1-2: banda en muslos ritmo lento · S3-4: banda en muslos 15m · S5-6: 15m + pausa isometrica cada 5 pasos · S7+: banda en tobillos si sin irradiacion' },
          { n: 'TFL stretch — piramidal en suelo', d: '2x40 seg cada lado', note: 'Estiramiento TFL + rotadores externos · L5-S1 izq primero', wid: 'tfl-stretch', variant: 'S1-2: figura 4 en suelo pasivo · S3-4: figura 4 activo con presion rodilla · S5-6: pigeon pose en suelo · S7+: pigeon pose con inclinacion tronco' },
          { n: 'Glute bridge unilateral', d: '3x12 cada lado — pausa 2 seg', note: 'Una pierna en el aire · Pelvis nivelada', wid: 'glute-bridge-uni', variant: 'S1-2: bilateral como base · S3-4: unilateral pierna libre flexionada · S5-6: unilateral pierna libre extendida · S7+: mancuerna en cadera de trabajo' },
        ]
      },
      { id: 'CR', name: 'Core — anti-rotacion + anti-extension (casa-posible)', dur: '15 min', color: '#993C1D', exIds: ['CORE-G2','CORE-C','CORE-A','CORE-K'] },
    ]
  },

};

// Genera SESSIONS (forma que consume la app) a partir del plan WEEK + catalogo
const SESSIONS = buildSessions(WEEK);

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
    'Exhala y extiende simultaneamente el brazo derecho (hacia atras) y la pierna izquierda (hacia adelante).',
    'La zona lumbar NO debe despegarse del suelo — si lo hace, el rango es excesivo.',
    'Vuelve lentamente a la posicion inicial.',
    'Repite con brazo izquierdo y pierna derecha.',
  ],
  errores: ['La zona lumbar se despega del suelo — DETENER EL MOVIMIENTO.', 'Contener la respiracion.', 'Velocidad excesiva — el beneficio es el control.', 'Extensiones asimetricas.'],
  variantes: ['S1-2: solo extension de un miembro a la vez. S3-4: extension contralateral completa. S5-6: anadir press de palma contra rodilla. S7+: dead bug con fitball.'],
  notas_columna: 'El dead bug activa los multifidos ipsilaterales al segmento afectado L5-S1 izq mediante el patron cruzado. La lumbar despegada convierte el ejercicio en extension lumbar bajo carga: contraproducente con extrusion bilateral activa.'
};

EX_DB['bird-dog'] = {
  nombre: 'Bird dog con pausa',
  categoria: 'Core F2',
  color: '#993C1D',
  descripcion: 'Ejercicio de estabilizacion cuadrupeda que entrena el control pelvico y la coordinacion de la cadena posterior. Activa los multifidos lumbares sin carga compresiva significativa.',
  posicion: 'A cuatro patas: rodillas bajo las caderas, manos bajo los hombros. Columna en posicion neutra.',
  pasos: [
    'Activa el core — columna neutra, pelvis sin inclinacion.',
    'Extiende el brazo derecho hacia adelante y la pierna izquierda hacia atras SIMULTANEAMENTE.',
    'La pelvis NO debe rotar ni inclinarse.',
    'Pausa 3 segundos en la posicion extendida.',
    'Vuelve lentamente sin dejar caer el brazo o la pierna.',
    'Repite con el lado contrario.',
  ],
  errores: ['Pelvis que rota al elevar la pierna.', 'Hiperextension lumbar al elevar la pierna.', 'Cabeza que cae o se eleva.', 'Velocidad excesiva — la pausa es parte del ejercicio.'],
  variantes: ['S1-2: brazo o pierna por separado. S3-4: contralateral con pausa 3s. S5-6: banda en el tobillo. S7+: sobre superficie inestable.'],
  notas_columna: 'El bird dog es el ejercicio de activacion de multifidos mas validado para dolor lumbar inespecifico y hernia discal en Fase 1 y 2. La co-contraccion de multifidos y transverso abdominal que produce es el mecanismo protector del segmento discal afectado.'
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
    'Mantén la posicion con respiracion controlada.',
    'La lumbar NO debe despegarse del suelo en ningun momento.',
  ],
  errores: ['Lumbar separada del suelo — DETENER y reducir el rango.', 'Contener la respiracion.', 'Cuello en tension.'],
  variantes: ['S1-2: rodillas flexionadas 15s. S3-4: piernas a 45° 20s. S5-6: piernas a 30° 25s. S7+: piernas a 15° 30s. F3: hollow body hang en barra.'],
  notas_columna: 'La posicion hollow activa el transverso abdominal, el recto anterior y los oblicuos en sinergia. Con extrusion bilateral L4-L5 y L5-S1, la lumbar pegada al suelo es el criterio absoluto — una lumbar despegada genera presion discal posterior.'
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
    'Aprieta los gluteos para estabilizar la pelvis.',
    'Respira con ritmo constante.',
  ],
  errores: ['Cadera que cae (lumbar hiperextendida) — el error mas comun.', 'Cadera demasiado elevada.', 'Codos muy adelantados respecto a los hombros.'],
  variantes: ['S1-2: 20s sobre rodillas. S3-4: 30s completo. S5-6: 45s. S7+: elevacion alterna de pie.'],
  notas_columna: 'La plancha anterior en codos es preferible a la plancha en manos en F2 porque el centro de gravedad mas bajo reduce la demanda lumbar. Con extrusion activa, la posicion prona puede generar molestia en algunos casos — evaluar individualmente.'
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
