docker exec -i yalu-db psql -U yalu_user -d yalu_db -c "
-- LIMPIAR TODO
TRUNCATE catalogo_producto CASCADE;
TRUNCATE catalogo_marca CASCADE;
TRUNCATE catalogo_categoria CASCADE;

-- CATEGORIAS
INSERT INTO catalogo_categoria (nombre, descripcion, activo) VALUES
('lapices',       'Lapices, boligrafos, plumas y marcadores',       true),
('cuadernos',     'Libros, cuadernos, blocks y agendas',            true),
('arte',          'Materiales de arte, pintura y dibujo',           true),
('geometria',     'Reglas, escuadras, compases y transportadores',  true),
('manualidades',  'Materiales para manualidades y proyectos',       true),
('mochilas',      'Mochilas, loncheras y estuches',                 true),
('calculadoras',  'Calculadoras cientificas y basicas',             true),
('papeleria',     'Papeleria fina y articulos de oficina',          true);

-- MARCAS
INSERT INTO catalogo_marca (nombre, activo) VALUES
('Faber Castell', true),
('Stanford',      true),
('Artesco',       true),
('Pilot',         true),
('Layconsa',      true),
('Norma',         true),
('Vinifan',       true),
('Totto',         true),
('Stabilo',       true),
('Staedtler',     true),
('Maped',         true),
('Pelikan',       true),
('Crayola',       true),
('Pentel',        true),
('Bic',           true),
('Casio',         true),
('M&G',           true),
('Deli',          true),
('Faster',        true),
('Dong-A',        true);

-- PRODUCTOS - LAPICES Y PLUMAS
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, creado_en, categoria_id, marca_id) VALUES
('Lapicero Pilot G-2 0.7mm',     'Lapicero gel retractil punta 0.7mm, tinta suave',         'publico',  3.50,  50, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='lapices'), (SELECT id FROM catalogo_marca WHERE nombre='Pilot')),
('Set Plumones Faber 12 Colores', 'Plumones de colores punta fina, lavables',                'publico', 12.50,  30, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='lapices'), (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell')),
('Lapices de Grafito HB x12',    'Caja de 12 lapices hexagonales HB',                       'publico',  8.00,  40, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='lapices'), (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell')),
('Marcadores Permanentes x4',    'Set de 4 marcadores permanentes colores basicos',          'publico',  9.50,  25, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='lapices'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Boligrafo Stanford Azul x10',  'Pack de 10 boligrafos azul tinta aceite',                 'publico',  5.00,  60, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='lapices'), (SELECT id FROM catalogo_marca WHERE nombre='Stanford')),
('Lapicero Bic Cristal Azul',    'Lapicero clasico punta 1.0mm tinta azul',                 'publico',  1.00, 100, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='lapices'), (SELECT id FROM catalogo_marca WHERE nombre='Bic')),
('Lapicero Pentel EnerGel',      'Lapicero gel punta 0.5mm tinta negra',                    'publico',  4.50,  40, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='lapices'), (SELECT id FROM catalogo_marca WHERE nombre='Pentel')),
('Resaltadores Stabilo x4',      'Set de 4 resaltadores fluorescentes colores surtidos',    'publico',  8.50,  35, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='lapices'), (SELECT id FROM catalogo_marca WHERE nombre='Stabilo')),
('Lapiz Staedtler 2B',           'Lapiz profesional 2B para dibujo y bocetos',              'publico',  2.00,  80, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='lapices'), (SELECT id FROM catalogo_marca WHERE nombre='Staedtler')),
('Marcador Pizarra Pilot x4',    'Set 4 marcadores para pizarra acrilica borrable',         'publico', 11.00,  30, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='lapices'), (SELECT id FROM catalogo_marca WHERE nombre='Pilot'));

-- PRODUCTOS - CUADERNOS
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, creado_en, categoria_id, marca_id) VALUES
('Cuaderno Espiral A4 100 Hojas',  'Cuaderno espiral cuadriculado tamano A4',          'publico',  8.50, 50, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos'), (SELECT id FROM catalogo_marca WHERE nombre='Stanford')),
('Cuaderno Anillado A5 80 Hojas',  'Cuaderno anillado rayado tamano A5',               'publico',  6.00, 60, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos'), (SELECT id FROM catalogo_marca WHERE nombre='Norma')),
('Block Carta 50 Hojas',           'Block de hojas bond tamano carta',                 'publico',  4.50, 80, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos'), (SELECT id FROM catalogo_marca WHERE nombre='Layconsa')),
('Agenda 2026 Tapa Dura',          'Agenda anual con calendario y notas',              'publico', 25.00, 20, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos'), (SELECT id FROM catalogo_marca WHERE nombre='Norma')),
('Cuaderno Triple Raya 50 Hojas',  'Cuaderno triple raya para inicial',                'publico',  5.50, 70, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos'), (SELECT id FROM catalogo_marca WHERE nombre='Stanford')),
('Cuaderno Tapa Dura A4 200 Hojas','Cuaderno tapa dura 200 hojas cuadriculado',       'publico', 15.00, 30, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos'), (SELECT id FROM catalogo_marca WHERE nombre='Norma')),
('Block Boceto A4 50 Hojas',       'Block para bocetos y dibujo artistico',            'publico',  9.00, 25, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos'), (SELECT id FROM catalogo_marca WHERE nombre='Layconsa'));

-- PRODUCTOS - ARTE Y PINTURA
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, creado_en, categoria_id, marca_id) VALUES
('Colores Faber Castell x36',  'Caja de colores profesionales 36 unidades',      'publico', 32.90, 25, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='arte'), (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell')),
('Temperas x12 Colores',       'Set de temperas lavables 12 frascos',            'publico', 18.00, 30, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='arte'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Acuarelas Faber x24',        'Set de acuarelas 24 colores con pincel',         'publico', 28.50, 20, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='arte'), (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell')),
('Pinceles para Arte x6',      'Set de 6 pinceles tamanos variados',             'publico', 15.50, 25, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='arte'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Plastilina x12 Colores',     'Set de plastilina no toxica 12 barritas',        'publico', 10.00, 40, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='arte'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Colores Crayola x24',        'Crayones de cera 24 colores lavables',           'publico', 14.00, 35, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='arte'), (SELECT id FROM catalogo_marca WHERE nombre='Crayola')),
('Oleo Pelikan x12',           'Set de oleos artisticos 12 colores 12ml',        'publico', 35.00, 15, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='arte'), (SELECT id FROM catalogo_marca WHERE nombre='Pelikan'));

-- PRODUCTOS - GEOMETRIA
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, creado_en, categoria_id, marca_id) VALUES
('Juego Geometrico Completo',    'Regla 30cm, escuadras y transportador',              'publico',  7.50, 45, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='geometria'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Compas Metalico Profesional',  'Compas con mina y adaptador para lapiz',             'publico', 12.00, 30, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='geometria'), (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell')),
('Regla 30cm Transparente',      'Regla flexible transparente bordes biselados',       'publico',  3.50, 80, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='geometria'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Escuadra 45 Maped',            'Escuadra 45 grados transparente 25cm',               'publico',  4.00, 60, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='geometria'), (SELECT id FROM catalogo_marca WHERE nombre='Maped')),
('Transportador 180 Grados',     'Transportador semicircular transparente',             'publico',  2.50, 70, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='geometria'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco'));

-- PRODUCTOS - MANUALIDADES
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, creado_en, categoria_id, marca_id) VALUES
('Tijeras Escolares Punta Roma', 'Tijeras de seguridad 13cm para ninos',          'publico',  5.50, 50, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='manualidades'), (SELECT id FROM catalogo_marca WHERE nombre='Maped')),
('Goma en Barra 21g',            'Pegamento en barra no toxico',                  'publico',  3.00,100, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='manualidades'), (SELECT id FROM catalogo_marca WHERE nombre='Stanford')),
('Silicona Liquida 120ml',       'Pegamento liquido transparente multiusos',      'publico',  6.50, 60, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='manualidades'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Cartulinas de Colores x10',    'Pack de 10 cartulinas A4 surtidas',             'publico',  8.00, 45, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='manualidades'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Foamy Colores x10',            'Pack de 10 laminas foamy surtidas A4',          'publico',  9.50, 40, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='manualidades'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Cinta Masking Tape x3',        'Pack 3 cintas masking tape 18mm x 25m',         'publico',  7.00, 50, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='manualidades'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco'));

-- PRODUCTOS - MOCHILAS Y ESTUCHES
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, creado_en, categoria_id, marca_id) VALUES
('Mochila Escolar Totto',        'Mochila ergonomica con multiples compartimentos',  'publico', 89.90, 15, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='mochilas'), (SELECT id FROM catalogo_marca WHERE nombre='Totto')),
('Mochila Basica Vinifan',       'Mochila 2 compartimentos ideal primaria',          'publico', 45.00, 25, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='mochilas'), (SELECT id FROM catalogo_marca WHERE nombre='Vinifan')),
('Estuche 3 Compartimentos',     'Estuche con cierre y separadores',                'publico', 12.50, 35, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='mochilas'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Lonchera Termica',             'Lonchera aislante con correa ajustable',           'publico', 28.00, 20, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='mochilas'), (SELECT id FROM catalogo_marca WHERE nombre='Vinifan')),
('Mochila Totto Grande 30L',     'Mochila grande 30 litros viaje y colegio',         'publico',119.90, 10, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='mochilas'), (SELECT id FROM catalogo_marca WHERE nombre='Totto'));

-- PRODUCTOS - CALCULADORAS
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, creado_en, categoria_id, marca_id) VALUES
('Calculadora Cientifica Casio fx-82',  'Calculadora cientifica 252 funciones',         'publico', 65.00, 15, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='calculadoras'), (SELECT id FROM catalogo_marca WHERE nombre='Casio')),
('Calculadora Basica 12 Digitos',       'Calculadora de escritorio solar y bateria',    'publico', 18.50, 30, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='calculadoras'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Calculadora Casio fx-350',            'Calculadora cientifica 252 funciones avanzada','publico', 85.00, 10, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='calculadoras'), (SELECT id FROM catalogo_marca WHERE nombre='Casio'));

-- PRODUCTOS - PAPELERIA
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, creado_en, categoria_id, marca_id) VALUES
('Archivador A4 Palanca',        'Archivador de palanca lomo ancho',               'publico',  8.50, 40, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='papeleria'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Perforador 2 Huecos',          'Perforador metalico capacidad 25 hojas',         'publico', 15.00, 25, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='papeleria'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Grapadora Metalica',           'Grapadora de escritorio capacidad 20 hojas',     'publico', 18.00, 20, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='papeleria'), (SELECT id FROM catalogo_marca WHERE nombre='Maped')),
('Post-it 3x3 Colores x4',       'Pack 4 blocks notas adhesivas surtidas',         'publico', 12.00, 35, true, false, NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='papeleria'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco')),
('Clips Metalicos x100',         'Caja 100 clips metalicos N.1',                   'publico',  3.50,100, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='papeleria'), (SELECT id FROM catalogo_marca WHERE nombre='Faster')),
('Ligas Elasticas x100',         'Bolsa 100 ligas elasticas tamanos variados',      'publico',  4.00, 80, true, true,  NOW(), (SELECT id FROM catalogo_categoria WHERE nombre='papeleria'), (SELECT id FROM catalogo_marca WHERE nombre='Artesco'));

-- VERIFICACION FINAL
SELECT 'Categorias:', COUNT(*) FROM catalogo_categoria;
SELECT 'Marcas:', COUNT(*) FROM catalogo_marca;
SELECT 'Productos:', COUNT(*) FROM catalogo_producto;
"
