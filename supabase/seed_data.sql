-- ========================================
-- DATOS DE EJEMPLO - GRACE DIVINE MARKETPLACE
-- ========================================
-- Insertar productos de ejemplo para la tienda

INSERT INTO public.productos (codigo, nombre, precio, descripcion, stock) VALUES
-- Electrónica
('ELEC001', 'iPhone 15 Pro Max', 1199.99, 'El último iPhone con cámara profesional de 48MP y chip A17 Pro. Pantalla Super Retina XDR de 6.7 pulgadas.', 25),
('ELEC002', 'MacBook Air M2', 1299.99, 'Portátil ultraligero con chip M2 de Apple. 8GB RAM, 256GB SSD, pantalla Liquid Retina de 13.6 pulgadas.', 15),
('ELEC003', 'AirPods Pro 2', 249.99, 'Auriculares inalámbricos con cancelación activa de ruido y audio espacial personalizado.', 50),
('ELEC004', 'Samsung Galaxy S24 Ultra', 1399.99, 'Smartphone Android con pantalla Dynamic AMOLED 2X de 6.8 pulgadas y cámara de 200MP.', 20),
('ELEC005', 'iPad Air 5', 599.99, 'Tablet con chip M1, pantalla Liquid Retina de 10.9 pulgadas y soporte para Apple Pencil.', 30),

-- Ropa y Accesorios
('ROPA001', 'Camiseta Premium Algodón', 29.99, 'Camiseta de algodón orgánico 100% con diseño exclusivo. Disponible en varios colores.', 100),
('ROPA002', 'Jeans Slim Fit', 79.99, 'Jeans de mezcla de algodón con corte slim fit. Elásticos y cómodos para uso diario.', 75),
('ROPA003', 'Chaqueta Impermeable', 129.99, 'Chaqueta resistente al agua con capucha extraíble y forro térmico. Ideal para climas fríos.', 40),
('ROPA004', 'Zapatillas Deportivas', 89.99, 'Zapatillas running con tecnología de amortiguación y suela de goma antideslizante.', 60),
('ROPA005', 'Bolso de Cuero Genuino', 199.99, 'Bolso elegante de cuero genuino con múltiples compartimentos y cierre de seguridad.', 25),

-- Hogar y Jardín
('HOGAR001', 'Set de Sartenes Antiadherentes', 89.99, 'Juego de 3 sartenes con recubrimiento cerámico antiadherente. Aptas para inducción.', 35),
('HOGAR002', 'Cafetera Espresso', 299.99, 'Máquina de café espresso con molinillo incorporado y espumador de leche profesional.', 20),
('HOGAR003', 'Lámpara LED Inteligente', 49.99, 'Lámpara con control por app, 16 millones de colores y sincronización con música.', 80),
('HOGAR004', 'Set de Herramientas Básico', 159.99, 'Juego de 50 piezas con herramientas esenciales para reparaciones del hogar.', 25),
('HOGAR005', 'Planta Ornamental Monstera', 39.99, 'Planta tropical decorativa con maceta incluida. Fácil cuidado y purifica el aire.', 45),

-- Belleza y Cuidado Personal
('BELLEZA001', 'Set de Skincare Premium', 89.99, 'Kit completo con limpiador, tónico, sérum y humectante para todo tipo de piel.', 60),
('BELLEZA002', 'Secador de Pelo Profesional', 79.99, 'Secador iónico con 3 temperaturas y 2 velocidades. Tecnología anti-frizz.', 40),
('BELLEZA003', 'Perfume Importado 100ml', 149.99, 'Fragancia exclusiva con notas de vainilla, ámbar y madera de sándalo.', 30),
('BELLEZA004', 'Kit de Maquillaje Profesional', 129.99, 'Set completo con sombras, labiales, base y herramientas de aplicación.', 45),
('BELLEZA005', 'Crema Solar SPF 50+', 24.99, 'Protector solar de amplio espectro resistente al agua. 200ml.', 100),

-- Deportes y Fitness
('DEP001', 'Banda de Resistencia Premium', 19.99, 'Set de 5 bandas con diferentes niveles de resistencia. Ideal para entrenamiento en casa.', 200),
('DEP002', 'Yoga Mat Antideslizante', 34.99, 'Colchoneta de yoga de 6mm con textura antideslizante y correa de transporte.', 150),
('DEP003', 'Botella de Agua Inteligente', 39.99, 'Botella con recordatorio de hidratación y indicador de temperatura LED.', 120),
('DEP004', 'Reloj Smartwatch Fitness', 199.99, 'Reloj inteligente con monitor cardíaco, GPS y seguimiento de actividades.', 80),
('DEP005', 'Mancuernas Ajustables 20kg', 149.99, 'Set de mancuernas con peso ajustable de 2.5kg a 20kg por par.', 50),

-- Libros y Entretenimiento
('LIBRO001', 'Bestseller Ficción 2024', 24.99, 'Novela galardonada que explora temas de amor y pérdida en el mundo moderno.', 75),
('LIBRO002', 'Guía de Programación Web', 49.99, 'Libro completo sobre desarrollo web moderno con HTML5, CSS3 y JavaScript.', 60),
('LIBRO003', 'Set de Cuentos Infantiles', 34.99, 'Colección de 5 cuentos clásicos con ilustraciones a todo color.', 40),
('LIBRO004', 'Libro de Cocina Internacional', 39.99, 'Recetas de todo el mundo con fotografías paso a paso y consejos de chefs.', 55),
('LIBRO005', 'Biografía Inspiradora', 29.99, 'Historia de superación y éxito que motivará a alcanzar tus metas.', 90),

-- Juguetes y Juegos
('JUGUETE001', 'Lego Arquitectura', 79.99, 'Set de construcción de 1500 piezas para crear monumentos famosos.', 30),
('JUGUETE002', 'Juego de Mesa Familiar', 34.99, 'Juego de estrategia para 2-6 jugadores. Partidas de 30-45 minutos.', 45),
('JUGUETE003', 'Drone con Cámara 4K', 299.99, 'Drone cuadricóptero con cámara 4K y control remoto con pantalla.', 15),
('JUGUETE004', 'Set de Ciencia para Niños', 49.99, 'Kit de experimentos científicos seguro y educativo para niños de 8+ años.', 70),
('JUGUETE005', 'Consola Portátil Gaming', 199.99, 'Consola de videojuegos portátil con pantalla HD y 20 juegos preinstalados.', 25),

-- Oficina y Tecnología
('OFICINA001', 'Teclado Mecánico RGB', 89.99, 'Teclado gaming con switches mecánicos retroiluminados y teclas programables.', 65),
('OFICINA002', 'Monitor Curvo 27"', 349.99, 'Monitor LED curvo 144Hz, 1ms response time y resolución QHD.', 35),
('OFICINA003', 'Silla Ergonómica Executive', 399.99, 'Silla de oficina con soporte lumbar ajustable y reposabrazos 4D.', 20),
('OFICINA004', 'Webcam Full HD 1080p', 59.99, 'Webcam profesional con autofocus y micrófono integrado cancelador de ruido.', 90),
('OFICINA005', 'Disco Duro Externo 2TB', 89.99, 'Almacenamiento externo USB 3.0 con encriptación hardware y respaldo automático.', 55),

-- Salud y Bienestar
('SALUD001', 'Vitamina C Premium', 19.99, 'Suplemento de vitamina C de alta absorción con bioflavonoides. 120 tabletas.', 200),
('SALUD002', 'Aceite Esencial de Lavanda', 24.99, 'Aceite esencial puro 100% para aromaterapia y relajación. 15ml.', 150),
('SALUD003', 'Masajeador de Cuello', 69.99, 'Masajeador portátil con calor infrarrojo y 3 modos de intensidad.', 85),
('SALUD004', 'Balanza Digital Inteligente', 39.99, 'Balanza con análisis de composición corporal y sincronización con app móvil.', 110),
('SALUD005', 'Kit de Meditación', 49.99, 'Set con cojín de meditación, incienso y guía de mindfulness para principiantes.', 95),

-- Comida y Bebidas
('COMIDA001', 'Café Especial Gourmet', 24.99, 'Café de origen único tostado medio. 500g de granos premium.', 80),
('COMIDA002', 'Chocolates Belgas Premium', 34.99, 'Caja de 24 chocolates belgas rellenos con sabores variados.', 60),
('COMIDA003', 'Vino Tinto Reserva', 49.99, 'Vino tinto de cosecha especial con 12 meses de barrica. Botella 750ml.', 40),
('COMIDA004', 'Set de Tés Orgánicos', 29.99, 'Colección de 10 tés orgánicos diferentes en bolsas individuales.', 120),
('COMIDA005', 'Aceite de Oliva Extra Virgen', 19.99, 'Aceite de oliva prensado en frío. Botella de 500ml con certificación orgánica.', 90);
