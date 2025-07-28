# TecMap - Malla Curricular Interactiva

Una aplicación web moderna para visualizar y gestionar el progreso académico de las carreras del Tecnológico de Costa Rica.

## 🚀 Tecnologías

- **Astro 4.13.0** - Framework principal con Astro Islands
- **React 19.1.1** - Componentes interactivos
- **Tailwind CSS 4.1.11** - Estilado moderno y responsivo
- **shadcn/ui** - Sistema de componentes UI
- **TypeScript** - Tipado estático
- **pnpm** - Gestión de dependencias

## 🏗️ Arquitectura

### Separación de Datos

La aplicación separa claramente dos tipos de datos:

#### **Datos del Servidor** (`src/data/curriculum.ts`)
- **Información estática de carreras**: Cursos, créditos, prerequisitos
- **Datos compartidos**: No contienen información personal
- **Fácil actualización**: Se pueden agregar nuevas carreras sin afectar datos de usuario

#### **Datos del Usuario** (localStorage)
- **Progreso personal**: Estados de cursos, notas, fechas
- **Almacenamiento local**: Cada usuario mantiene sus propios datos
- **Privacidad**: Información personal no se envía al servidor

### Estructura de Datos

```typescript
// Información estática de la carrera
interface Career {
  id: string;
  name: string;
  university: string;
  blocks: Block[];
}

// Progreso personal del usuario
interface UserProgress {
  careerId: string;
  subjects: UserSubjectData[];
  lastUpdated: string;
}
```

## � Características

### ✅ Implementadas
- Visualización completa de la malla curricular
- Estados interactivos: Pendiente → Cursando → Aprobada
- Persistencia en localStorage
- Verificación de prerequisitos
- Diseño responsivo
- Sistema de múltiples carreras (preparado)

### 🔄 Agregadas en esta versión
- **CS3401** ahora requiere **CS2101** como prerequisito
- Arquitectura genérica para múltiples carreras
- Separación de datos del servidor vs. usuario
- Funciones defensivas para SSR/hidratación
## 🛠️ Uso

### Comandos
```bash
pnpm dev      # Servidor de desarrollo
pnpm build    # Construcción para producción
pnpm preview  # Vista previa de la build
```

### Interacción
1. **Cambiar estado**: Clic en cualquier materia
2. **Prerequisitos**: Cursos bloqueados hasta completar requisitos
3. **Progreso**: Se guarda automáticamente en el navegador

## 📊 Datos de Usuario

### Almacenamiento
- **Ubicación**: `localStorage` del navegador
- **Clave**: `userProgress_{careerId}`
- **Formato**: JSON con estado, notas y fechas

### Estructura
```json
{
  "careerId": "comp-eng-tec",
  "subjects": [
    {
      "code": "IC1802",
      "status": "completed",
      "grade": 90,
      "completionDate": "2025-01-28T12:00:00.000Z"
    }
  ],
  "lastUpdated": "2025-01-28T12:00:00.000Z"
}
```

## 🔧 Extensibilidad

### Agregar Nueva Carrera
1. Crear estructura en `src/data/curriculum.ts`:
```typescript
export const newCareer: Career = {
  id: "nueva-carrera",
  name: "Nueva Carrera",
  university: "TEC",
  blocks: [...]
};
```

2. Agregar a la lista disponible:
```typescript
export const availableCareers: Career[] = [
  computingEngineeringCareer,
  newCareer,  // ← Nueva carrera
];
```

## 📁 Estructura del Proyecto

```
/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/
│   │   ├── ui/            # Componentes shadcn/ui
│   │   └── CurriculumMap.tsx  # Componente principal
│   ├── data/
│   │   └── curriculum.ts  # Datos de la malla curricular
│   ├── lib/
│   │   └── utils.ts       # Utilidades (función cn)
│   ├── pages/
│   │   └── index.astro    # Página principal
│   └── styles/
│       └── globals.css    # Estilos globales
├── astro.config.mjs       # Configuración de Astro
├── tsconfig.json          # Configuración de TypeScript
└── package.json
```

## 🔄 Futuras Mejoras

### Base de Datos
- Migrar de localStorage a API backend
- Sincronización entre dispositivos
- Backup automático

### Funcionalidades
- Selector de carreras en UI
- Estadísticas avanzadas
- Exportar progreso (PDF, Excel)
- Calendario académico integrado
- Recomendaciones de cursos

### UX/UI
- Modo oscuro automático
- Filtros y búsqueda
- Vista de timeline
- Notificaciones de progreso

## 📝 Notas Técnicas

### SSR Compatibility
- Funciones defensivas para `localStorage`
- Hidratación progresiva
- Fallbacks para datos no disponibles

### Performance
- Componentes optimizados con React 19
- Astro Islands para interactividad selectiva
- Build optimizado con Vite

### Mantenimiento
- TypeScript para prevenir errores
- Código modular y reutilizable
- Separación clara de responsabilidades

- Total de créditos del plan de estudios
- Créditos completados
- Porcentaje de progreso general

## 🔧 Personalización

### Agregar Nueva Carrera

1. Crear nuevo archivo en `src/data/` (ej: `industrial.ts`)
2. Definir la estructura usando las interfaces existentes
3. Importar en el componente principal

### Modificar Estilos

- Tailwind CSS 4 usando `@import "tailwindcss"`
- Variables CSS personalizadas en `src/styles/globals.css`
- Componentes UI siguiendo patrones de shadcn/ui

## 🌟 Próximas Características

- [ ] Soporte para múltiples carreras
- [ ] Exportar progreso a PDF
- [ ] Modo oscuro/claro
- [ ] Estadísticas avanzadas de progreso
- [ ] Integración con APIs del TEC
- [ ] Sistema de notificaciones
- [ ] Compartir progreso

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-carrera`)
3. Commit tus cambios (`git commit -m 'Agregar nueva carrera'`)
4. Push a la rama (`git push origin feature/nueva-carrera`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🎓 Para Estudiantes del TEC

Esta herramienta es desarrollada por y para estudiantes del TEC. Si encuentras algún error en la información de las materias o tienes sugerencias, no dudes en crear un issue o enviar un pull request.

### Carreras Disponibles

- ✅ Ingeniería en Computación
- 🔄 Más carreras próximamente...

---

**Desarrollado con ❤️ para la comunidad estudiantil del TEC Costa Rica**
