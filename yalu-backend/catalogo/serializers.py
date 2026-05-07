from rest_framework import serializers
from .models import Categoria, Marca, Producto, ProductoVariante, ImagenProducto

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'descripcion', 'activo']

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nombre', 'activo']

class ImagenProductoSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ImagenProducto
        fields = ['id', 'imagen_url', 'orden', 'es_principal']
    
    def get_imagen_url(self, obj):
        request = self.context.get('request')
        if obj.imagen and request:
            return request.build_absolute_uri(obj.imagen.url)
        return None

class ProductoVarianteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoVariante
        fields = ['id', 'nombre_variante', 'precio', 'stock', 'sku', 'activo']

class ProductoListSerializer(serializers.ModelSerializer):
    categoria = serializers.CharField(source='categoria.nombre', read_only=True)
    categoria_id = serializers.IntegerField(source='categoria.id', read_only=True)
    marca = serializers.CharField(source='marca.nombre', read_only=True)
    marca_id = serializers.IntegerField(source='marca.id', read_only=True)
    imagen = serializers.SerializerMethodField()
    imagenes = ImagenProductoSerializer(many=True, read_only=True)
    stock = serializers.SerializerMethodField()
    
    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'tipo_publicacion',
            'precio', 'activo', 'permite_mayor', 'stock_minimo',
            'categoria', 'categoria_id', 'marca', 'marca_id',
            'imagen', 'imagenes', 'stock', 'creado_en'
        ]
    
    def get_imagen(self, obj):
        """Obtener URL de la imagen principal"""
        request = self.context.get('request')
        # Intentar obtener imagen principal
        img = obj.imagenes.filter(es_principal=True).first()
        if not img:
            # Si no hay principal, usar la primera
            img = obj.imagenes.first()
        
        if img and img.imagen and request:
            return request.build_absolute_uri(img.imagen.url)
        return None
    
    def get_stock(self, obj):
        """Obtener stock disponible - compatible con y sin variantes"""
        # Si tiene variantes, sumar el stock de variantes activas
        if obj.variantes.exists():
            return sum(v.stock for v in obj.variantes.filter(activo=True))
        # Si no tiene variantes, usar stock_minimo como indicador
        # (En este caso asumimos que stock_minimo > 0 significa que hay stock)
        return obj.stock_minimo if obj.stock_minimo > 0 else 100

class ProductoDetalleSerializer(serializers.ModelSerializer):
    categoria = CategoriaSerializer(read_only=True)
    marca = MarcaSerializer(read_only=True)
    variantes = ProductoVarianteSerializer(many=True, read_only=True)
    imagenes = ImagenProductoSerializer(many=True, read_only=True)
    stock = serializers.SerializerMethodField()
    
    class Meta:
        model = Producto
        fields = [
            'id', 'nombre', 'descripcion', 'tipo_publicacion',
            'precio', 'activo', 'permite_mayor', 'stock_minimo',
            'categoria', 'marca', 'variantes', 'imagenes',
            'stock', 'creado_en'
        ]
    
    def get_stock(self, obj):
        """Obtener stock disponible - compatible con y sin variantes"""
        if obj.variantes.exists():
            return sum(v.stock for v in obj.variantes.filter(activo=True))
        return obj.stock_minimo if obj.stock_minimo > 0 else 100