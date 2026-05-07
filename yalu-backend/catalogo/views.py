from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as df_filters
from .models import Categoria, Marca, Producto
from .serializers import (
    CategoriaSerializer, MarcaSerializer,
    ProductoListSerializer, ProductoDetalleSerializer
)


class ProductoFilter(df_filters.FilterSet):
    """Filtro personalizado para productos"""
    categoria = df_filters.CharFilter(field_name='categoria__nombre', lookup_expr='iexact')
    marca = df_filters.CharFilter(field_name='marca__nombre', lookup_expr='iexact')
    
    class Meta:
        model = Producto
        fields = ['categoria', 'marca', 'tipo_publicacion', 'activo']


class CategoriaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.filter(activo=True)
    serializer_class = CategoriaSerializer
    permission_classes = [AllowAny]


class MarcaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Marca.objects.filter(activo=True)
    serializer_class = MarcaSerializer
    permission_classes = [AllowAny]


class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductoFilter
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['precio', 'creado_en', 'nombre']
    ordering = ['nombre']

    def get_queryset(self):
        return Producto.objects.filter(activo=True).select_related(
            'categoria', 'marca'
        ).prefetch_related('variantes', 'imagenes')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductoDetalleSerializer
        return ProductoListSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context