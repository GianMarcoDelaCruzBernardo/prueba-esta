-- Script de inicialización de base de datos Yalú
-- Ejecutar después de las migraciones de Django

-- Primero ejecuta las migraciones de Django antes de este script

-- ============================================
-- CATEGORÍAS (según frontend ProductosPublico.jsx)
-- ============================================
INSERT INTO catalogo_categoria (nombre, descripcion, activo, fecha_creacion, fecha_actualizacion) VALUES
('lapices', 'Lapices, bolígrafos, plumas y marcadores', true, NOW(), NOW()),
('cuadernos', 'Libros, cuadernos, blocks y agendas', true, NOW(), NOW()),
('arte', 'Materiales de arte, pintura y dibujo', true, NOW(), NOW()),
('geometria', 'Reglas, escuadras, compases y transportadores', true, NOW(), NOW()),
('manualidades', 'Materiales para manualidades y proyectos', true, NOW(), NOW()),
('mochilas', 'Mochilas, loncheras y estuches', true, NOW(), NOW()),
('calculadoras', 'Calculadoras científicas y básicas', true, NOW(), NOW()),
('papeleria', 'Papelería fina y artículos de oficina', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- MARCAS
-- ============================================
INSERT INTO catalogo_marca (nombre, descripcion, activo, fecha_creacion, fecha_actualizacion) VALUES
('Faber Castell', 'Marca alemana de materiales de escritura', true, NOW(), NOW()),
('Stanford', 'Marca peruana de útiles escolares', true, NOW(), NOW()),
('Artesco', 'Productos de oficina y escolares', true, NOW(), NOW()),
('Pilot', 'Marca japonesa de bolígrafos', true, NOW(), NOW()),
('Layconsa', 'Marca peruana de cuadernos', true, NOW(), NOW()),
('Norma', 'Cuadernos y blocks', true, NOW(), NOW()),
('Vinifan', 'Mochilas y loncheras', true, NOW(), NOW()),
('Totto', 'Mochilas colombianas de alta calidad', true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- PRODUCTOS (acorde a categorías del frontend)
-- ============================================
INSERT INTO catalogo_producto (nombre, descripcion, precio, precio_base, stock, categoria_id, marca_id, imagen_url, activo, fecha_creacion, fecha_actualizacion) VALUES
-- LAPICES Y PLUMAS
('Lapicero Pilot G-2', 'Lapicero gel retráctil punta 0.7mm', 3.50, 4.50, 200, 
    (SELECT id FROM catalogo_categoria WHERE nombre='lapices' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Pilot' LIMIT 1),
    null, true, NOW(), NOW()),

('Set Plumones Faber 12 Colores', 'Plumones de colores punta fina', 12.50, 15.00, 80,
    (SELECT id FROM catalogo_categoria WHERE nombre='lapices' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell' LIMIT 1),
    null, true, NOW(), NOW()),

('Lapices de Grafito HB x12', 'Caja de 12 lápices hexagonales', 8.00, null, 120,
    (SELECT id FROM catalogo_categoria WHERE nombre='lapices' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell' LIMIT 1),
    null, true, NOW(), NOW()),

('Marcadores Permanentes x4', 'Set de 4 marcadores permanentes colores básicos', 9.50, 12.00, 65,
    (SELECT id FROM catalogo_categoria WHERE nombre='lapices' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

-- LIBROS Y CUADERNOS
('Cuaderno Espiral A4 100 Hojas', 'Cuaderno espiral cuadriculado tamaño A4', 8.50, 12.00, 100,
    (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Stanford' LIMIT 1),
    null, true, NOW(), NOW()),

('Cuaderno Anillado A5 80 Hojas', 'Cuaderno anillado rayado tamaño A5', 6.00, 8.50, 150,
    (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Norma' LIMIT 1),
    null, true, NOW(), NOW()),

('Block Carta 50 Hojas', 'Block de hojas bond tamaño carta', 4.50, null, 200,
    (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Layconsa' LIMIT 1),
    null, true, NOW(), NOW()),

('Agenda 2026 Tapa Dura', 'Agenda anual con calendario y notas', 25.00, 35.00, 40,
    (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Norma' LIMIT 1),
    null, true, NOW(), NOW()),

-- ARTE Y PINTURA
('Colores Faber Castell x36', 'Caja de colores profesionales 36 unidades', 32.90, 40.00, 50,
    (SELECT id FROM catalogo_categoria WHERE nombre='arte' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell' LIMIT 1),
    null, true, NOW(), NOW()),

('Témperas x12 Colores', 'Set de témperas lavables 12 frascos', 18.00, 22.00, 60,
    (SELECT id FROM catalogo_categoria WHERE nombre='arte' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

('Acuarelas Faber x24', 'Set de acuarelas 24 colores con pincel', 28.50, 35.00, 35,
    (SELECT id FROM catalogo_categoria WHERE nombre='arte' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell' LIMIT 1),
    null, true, NOW(), NOW()),

('Pinceles para Arte x6', 'Set de 6 pinceles tamaños variados', 15.50, null, 45,
    (SELECT id FROM catalogo_categoria WHERE nombre='arte' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

-- GEOMETRÍA
('Juego Geométrico Completo', 'Regla 30cm, escuadras y transportador', 7.50, 10.00, 90,
    (SELECT id FROM catalogo_categoria WHERE nombre='geometria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

('Compás Metálico Profesional', 'Compás con mina y adaptador', 12.00, 16.00, 55,
    (SELECT id FROM catalogo_categoria WHERE nombre='geometria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell' LIMIT 1),
    null, true, NOW(), NOW()),

('Regla 30cm Transparente', 'Regla flexible transparente con bordes biselados', 3.50, null, 180,
    (SELECT id FROM catalogo_categoria WHERE nombre='geometria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

-- MANUALIDADES
('Tijeras Escolares Punta Roma', 'Tijeras de seguridad 13cm', 5.50, null, 110,
    (SELECT id FROM catalogo_categoria WHERE nombre='manualidades' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

('Goma en Barra 21g', 'Pegamento en barra no tóxico', 3.00, null, 200,
    (SELECT id FROM catalogo_categoria WHERE nombre='manualidades' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Stanford' LIMIT 1),
    null, true, NOW(), NOW()),

('Silicona Líquida 120ml', 'Pegamento líquido transparente', 6.50, null, 130,
    (SELECT id FROM catalogo_categoria WHERE nombre='manualidades' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

('Cartulinas de Colores x10', 'Pack de 10 cartulinas A4 surtidas', 8.00, null, 95,
    (SELECT id FROM catalogo_categoria WHERE nombre='manualidades' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

-- MOCHILAS Y ESTUCHES
('Mochila Escolar Totto', 'Mochila ergonómica con múltiples compartimentos', 89.90, 120.00, 25,
    (SELECT id FROM catalogo_categoria WHERE nombre='mochilas' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Totto' LIMIT 1),
    null, true, NOW(), NOW()),

('Mochila Básica Vinifan', 'Mochila 2 compartimentos ideal primaria', 45.00, 65.00, 50,
    (SELECT id FROM catalogo_categoria WHERE nombre='mochilas' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Vinifan' LIMIT 1),
    null, true, NOW(), NOW()),

('Estuche 3 Compartimentos', 'Estuche con cierre y separadores', 12.50, 16.00, 70,
    (SELECT id FROM catalogo_categoria WHERE nombre='mochilas' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

('Lonchera Térmica', 'Lonchera aislante con correa ajustable', 28.00, 35.00, 40,
    (SELECT id FROM catalogo_categoria WHERE nombre='mochilas' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Vinifan' LIMIT 1),
    null, true, NOW(), NOW()),

-- CALCULADORAS
('Calculadora Científica Casio', 'Calculadora científica 252 funciones', 65.00, 85.00, 30,
    (SELECT id FROM catalogo_categoria WHERE nombre='calculadoras' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Pilot' LIMIT 1),
    null, true, NOW(), NOW()),

('Calculadora Básica 12 Dígitos', 'Calculadora de escritorio solar', 18.50, 25.00, 60,
    (SELECT id FROM catalogo_categoria WHERE nombre='calculadoras' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

-- PAPELERÍA FINA
('Archivador A4 Palanca', 'Archivador de palanca lomo ancho', 8.50, null, 85,
    (SELECT id FROM catalogo_categoria WHERE nombre='papeleria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

('Folders Manila A4 x25', 'Pack de 25 folders tamaño A4', 12.00, 15.00, 75,
    (SELECT id FROM catalogo_categoria WHERE nombre='papeleria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Stanford' LIMIT 1),
    null, true, NOW(), NOW()),

('Clips Mariposa x50', 'Caja de 50 clips metálicos 32mm', 4.50, null, 150,
    (SELECT id FROM catalogo_categoria WHERE nombre='papeleria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW()),

('Perforador 2 Huecos', 'Perforador metálico capacidad 25 hojas', 15.00, 20.00, 50,
    (SELECT id FROM catalogo_categoria WHERE nombre='papeleria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1),
    null, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT 'Categorías creadas:', COUNT(*) FROM catalogo_categoria;
SELECT 'Marcas creadas:', COUNT(*) FROM catalogo_marca;
SELECT 'Productos creados:', COUNT(*) FROM catalogo_producto;
