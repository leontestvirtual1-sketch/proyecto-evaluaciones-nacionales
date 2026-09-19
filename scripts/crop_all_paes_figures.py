import fitz
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = 'evaluaciones_fuente/paes/paes-oficial-matematica1-p2023.pdf'
doc = fitz.open(pdf_path)

os.makedirs('scratch/figure_crops', exist_ok=True)

# Definition of all figures to crop:
# (question_num, page_num_1_based, fitz.Rect(x0, y0, x1, y1), description)
figures_to_crop = [
    # Q03: Pyramid of boxes
    (3, 4, fitz.Rect(235, 125, 380, 210), 'figura_p03_piramide.png'),
    
    # Q10: 4 grids in options
    (10, 7, fitz.Rect(60, 200, 540, 700), 'figura_p10_cuadriculas_opciones.png'),
    
    # Q11: Table of drinks (optional, table already formatted as text/markdown or image)
    (11, 8, fitz.Rect(180, 120, 420, 240), 'figura_p11_tabla_bebidas.png'),
    
    # Q15: Table of storage units
    (15, 11, fitz.Rect(140, 110, 460, 310), 'figura_p15_tabla_almacenamiento.png'),
    
    # Q17: Sequence of congruent squares
    (17, 12, fitz.Rect(100, 105, 500, 225), 'figura_p17_cajas.png'),
    
    # Q18: Table of products
    (18, 13, fitz.Rect(130, 110, 470, 230), 'figura_p18_tabla_productos.png'),
    
    # Q21: Direct proportionality graphs A, B, C, D
    (21, 14, fitz.Rect(70, 150, 530, 370), 'figura_p21_graficos_opciones.png'),
    
    # Q23: Parallelepiped box
    (23, 15, fitz.Rect(230, 100, 470, 240), 'figura_p23_recta.png'),
    
    # Q26: Spring with weights (Hooke)
    (26, 17, fitz.Rect(150, 120, 450, 310), 'figura_p26_resorte.png'),
    
    # Q27: Human body proportions canon
    (27, 18, fitz.Rect(170, 110, 430, 360), 'figura_p27_canon.png'),
    
    # Q28: Table of speed limits
    (28, 19, fitz.Rect(100, 110, 500, 230), 'figura_p28_tabla_velocidad.png'),
    
    # Q30: Cellphone charger graph
    (30, 21, fitz.Rect(160, 120, 440, 310), 'figura_p30_bateria.png'),
    
    # Q32: Cartesian planes A, B, C, D
    (32, 22, fitz.Rect(70, 150, 530, 370), 'figura_p32_planos_opciones.png'),
    
    # Q34: Square mirror with 4 triangles
    (34, 23, fitz.Rect(200, 120, 400, 320), 'figura_p34_tabla_func.png'),
    
    # Q35: Drone descent graph
    (35, 24, fitz.Rect(160, 120, 440, 310), 'figura_p35_geometria.png'),
    
    # Q38: 4 parabola graphs in options
    (38, 26, fitz.Rect(70, 130, 530, 390), 'figura_p38_parabolas_opciones.png'),
    
    # Q39: 4 figures in options (triangles)
    (39, 27, fitz.Rect(70, 110, 530, 430), 'figura_p39_triangulos_opciones.png'),
    
    # Q40: Shelf with triangular bracket
    (40, 28, fitz.Rect(160, 110, 440, 310), 'figura_p40_repisa.png'),
    
    # Q41: Antenna with cables
    (41, 29, fitz.Rect(150, 110, 450, 340), 'figura_p41_antena.png'),
    
    # Q42: Rectangle with border
    (42, 30, fitz.Rect(180, 110, 420, 260), 'figura_p42_rectangulo.png'),
    
    # Q45: Polygon figure for translations
    (45, 32, fitz.Rect(180, 110, 420, 270), 'figura_p45_figura.png'),
    
    # Q46: Cartesian grid with point
    (46, 33, fitz.Rect(170, 120, 430, 380), 'figura_p46_cuadricula.png'),
    
    # Q47: 4 images in options (ejes de simetría)
    (47, 34, fitz.Rect(70, 90, 530, 280), 'figura_p47_simetria.png'),
    
    # Q49: 4 quadrilaterals with dashed axes
    (49, 35, fitz.Rect(70, 100, 530, 390), 'figura_p49_cuadrilateros.png'),
    
    # Q50: House and tree shadows
    (50, 35, fitz.Rect(120, 470, 480, 640), 'figura_p50_casa_arbol.png'),
    
    # Q51: Human eye and retina diagram
    (51, 36, fitz.Rect(120, 140, 440, 290), 'figura_p51_ojo_retina.png'),
    
    # Q52: Ladder against fence and wall
    (52, 37, fitz.Rect(170, 130, 430, 350), 'figura_p52_escalera.png'),
    
    # Q53: Table and ruler
    (53, 38, fitz.Rect(120, 170, 460, 350), 'figura_p53_mesa.png'),
    
    # Q54: Bar chart (plantas)
    (54, 39, fitz.Rect(170, 120, 410, 350), 'figura_p54_plantas.png'),
    
    # Q55: Table of movies
    (55, 40, fitz.Rect(140, 110, 460, 250), 'figura_p55_histograma.png'),
    
    # Q56: Legumes consumption chart
    (56, 41, fitz.Rect(140, 140, 450, 300), 'figura_p56_legumbres.png'),
    
    # Q57: Goals chart (favor vs contra)
    (57, 42, fitz.Rect(140, 120, 480, 290), 'figura_p57_diagrama_caja.png'),
    
    # Q60: Box plot (diagrama de cajón)
    (60, 44, fitz.Rect(160, 140, 450, 240), 'figura_p60_grafico_barras.png'),
    
    # Q63: Table of ice cream flavors
    (63, 46, fitz.Rect(180, 120, 420, 240), 'figura_p63_grafico_circular.png')
]

mat = fitz.Matrix(2.5, 2.5) # Retina resolution

for q_num, page_num, rect, fname in figures_to_crop:
    page = doc[page_num - 1]
    pix = page.get_pixmap(matrix=mat, clip=rect)
    save_path = os.path.join('scratch/figure_crops', fname)
    pix.save(save_path)
    # Also save to public/preguntas/paes_mat1_2023_forma113
    pub_path = os.path.join('public/preguntas/paes_mat1_2023_forma113', fname)
    pix.save(pub_path)
    print(f"Cropped Q{q_num:02d} -> {fname} ({pix.width}x{pix.height})")

print(f"\nAll {len(figures_to_crop)} figures cropped successfully!")
