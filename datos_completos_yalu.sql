-- ============================================
-- SCRIPT COMPLETO DE DATOS YALÚ
-- Ejecutar DESPUÉS de las migraciones de Django
-- ============================================

-- ============================================
-- 1. CATEGORÍAS (8 categorías)
-- ============================================
INSERT INTO catalogo_categoria (nombre, descripcion, activo) VALUES
('lapices', 'Lápices, bolígrafos, plumas y marcadores', true),
('cuadernos', 'Libros, cuadernos, blocks y agendas', true),
('arte', 'Materiales de arte, pintura y dibujo', true),
('geometria', 'Reglas, escuadras, compases y transportadores', true),
('manualidades', 'Materiales para manualidades y proyectos', true),
('mochilas', 'Mochilas, loncheras y estuches', true),
('calculadoras', 'Calculadoras científicas y básicas', true),
('papeleria', 'Papelería fina y artículos de oficina', true)
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- 2. MARCAS (8 marcas)
-- ============================================
INSERT INTO catalogo_marca (nombre, activo) VALUES
('Faber Castell', true),
('Stanford', true),
('Artesco', true),
('Pilot', true),
('Layconsa', true),
('Norma', true),
('Vinifan', true),
('Totto', true)
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- 3. PRODUCTOS (30 productos variados)
-- ============================================

-- LÁPICES Y PLUMAS (5 productos)
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, categoria_id, marca_id) VALUES
('Lapicero Pilot G-2 0.7mm', 'Lapicero gel retráctil punta 0.7mm, tinta suave', 'publico', 3.50, 50, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='lapices' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Pilot' LIMIT 1)),

('Set Plumones Faber 12 Colores', 'Plumones de colores punta fina, lavables', 'publico', 12.50, 30, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='lapices' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell' LIMIT 1)),

('Lápices de Grafito HB x12', 'Caja de 12 lápices hexagonales HB', 'publico', 8.00, 40, true, true,
    (SELECT id FROM catalogo_categoria WHERE nombre='lapices' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell' LIMIT 1)),

('Marcadores Permanentes x4', 'Set de 4 marcadores permanentes colores básicos', 'publico', 9.50, 25, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='lapices' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1)),

('Boligrafo Stanford Azul x10', 'Pack de 10 bolígrafos azul tinta aceite', 'publico', 5.00, 60, true, true,
    (SELECT id FROM catalogo_categoria WHERE nombre='lapices' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Stanford' LIMIT 1))
ON CONFLICT DO NOTHING;

-- CUADERNOS (5 productos)
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, categoria_id, marca_id) VALUES
('Cuaderno Espiral A4 100 Hojas', 'Cuaderno espiral cuadriculado tamaño A4', 'publico', 8.50, 50, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Stanford' LIMIT 1)),

('Cuaderno Anillado A5 80 Hojas', 'Cuaderno anillado rayado tamaño A5', 'publico', 6.00, 60, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Norma' LIMIT 1)),

('Block Carta 50 Hojas', 'Block de hojas bond tamaño carta', 'publico', 4.50, 80, true, true,
    (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Layconsa' LIMIT 1)),

('Agenda 2026 Tapa Dura', 'Agenda anual con calendario y notas', 'publico', 25.00, 20, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Norma' LIMIT 1)),

('Cuaderno Triple Raya 50 Hojas', 'Cuaderno triple raya para inicial', 'publico', 5.50, 70, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='cuadernos' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Stanford' LIMIT 1))
ON CONFLICT DO NOTHING;

-- ARTE Y PINTURA (5 productos)
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, categoria_id, marca_id) VALUES
('Colores Faber Castell x36', 'Caja de colores profesionales 36 unidades', 'publico', 32.90, 25, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='arte' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell' LIMIT 1)),

('Témperas x12 Colores', 'Set de témperas lavables 12 frascos', 'publico', 18.00, 30, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='arte' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1)),

('Acuarelas Faber x24', 'Set de acuarelas 24 colores con pincel', 'publico', 28.50, 20, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='arte' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell' LIMIT 1)),

('Pinceles para Arte x6', 'Set de 6 pinceles tamaños variados', 'publico', 15.50, 25, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='arte' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1)),

('Plastilina x12 Colores', 'Set de plastilina no tóxica 12 barritas', 'publico', 10.00, 40, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='arte' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1))
ON CONFLICT DO NOTHING;

-- GEOMETRÍA (3 productos)
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, categoria_id, marca_id) VALUES
('Juego Geométrico Completo', 'Regla 30cm, escuadras y transportador', 'publico', 7.50, 45, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='geometria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1)),

('Compás Metálico Profesional', 'Compás con mina y adaptador', 'publico', 12.00, 30, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='geometria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Faber Castell' LIMIT 1)),

('Regla 30cm Transparente', 'Regla flexible transparente con bordes biselados', 'publico', 3.50, 80, true, true,
    (SELECT id FROM catalogo_categoria WHERE nombre='geometria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1))
ON CONFLICT DO NOTHING;

-- MANUALIDADES (4 productos)
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, categoria_id, marca_id) VALUES
('Tijeras Escolares Punta Roma', 'Tijeras de seguridad 13cm', 'publico', 5.50, 50, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='manualidades' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1)),

('Goma en Barra 21g', 'Pegamento en barra no tóxico', 'publico', 3.00, 100, true, true,
    (SELECT id FROM catalogo_categoria WHERE nombre='manualidades' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Stanford' LIMIT 1)),

('Silicona Líquida 120ml', 'Pegamento líquido transparente', 'publico', 6.50, 60, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='manualidades' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1)),

('Cartulinas de Colores x10', 'Pack de 10 cartulinas A4 surtidas', 'publico', 8.00, 45, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='manualidades' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1))
ON CONFLICT DO NOTHING;

-- MOCHILAS Y ESTUCHES (4 productos)
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, categoria_id, marca_id) VALUES
('Mochila Escolar Totto', 'Mochila ergonómica con múltiples compartimentos', 'publico', 89.90, 15, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='mochilas' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Totto' LIMIT 1)),

('Mochila Básica Vinifan', 'Mochila 2 compartimentos ideal primaria', 'publico', 45.00, 25, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='mochilas' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Vinifan' LIMIT 1)),

('Estuche 3 Compartimentos', 'Estuche con cierre y separadores', 'publico', 12.50, 35, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='mochilas' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1)),

('Lonchera Térmica', 'Lonchera aislante con correa ajustable', 'publico', 28.00, 20, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='mochilas' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Vinifan' LIMIT 1))
ON CONFLICT DO NOTHING;

-- CALCULADORAS (2 productos)
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, categoria_id, marca_id) VALUES
('Calculadora Científica Casio', 'Calculadora científica 252 funciones', 'publico', 65.00, 15, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='calculadoras' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Pilot' LIMIT 1)),

('Calculadora Básica 12 Dígitos', 'Calculadora de escritorio solar', 'publico', 18.50, 30, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='calculadoras' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1))
ON CONFLICT DO NOTHING;

-- PAPELERÍA FINA (2 productos)
INSERT INTO catalogo_producto (nombre, descripcion, tipo_publicacion, precio, stock_minimo, activo, permite_mayor, categoria_id, marca_id) VALUES
('Archivador A4 Palanca', 'Archivador de palanca lomo ancho', 'publico', 8.50, 40, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='papeleria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1)),

('Perforador 2 Huecos', 'Perforador metálico capacidad 25 hojas', 'publico', 15.00, 25, true, false,
    (SELECT id FROM catalogo_categoria WHERE nombre='papeleria' LIMIT 1),
    (SELECT id FROM catalogo_marca WHERE nombre='Artesco' LIMIT 1))
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT '=== RESUMEN DE DATOS INSERTADOS ===' as info;
SELECT 'Categorías:', COUNT(*) FROM catalogo_categoria;
SELECT 'Marcas:', COUNT(*) FROM catalogo_marca;
SELECT 'Productos:', COUNT(*) FROM catalogo_producto;

SELECT '=== PRODUCTOS POR CATEGORÍA ===' as info;
SELECT 
    c.nombre as categoria,
    COUNT(p.id) as cantidad_productos
FROM catalogo_categoria c
LEFT JOIN catalogo_producto p ON p.categoria_id = c.id
GROUP BY c.nombre
ORDER BY c.nombre;
