# Algoritmos Genéticos: Cuadro Mágico y Decodificador de Mensajes

Este proyecto implementa y demuestra de forma práctica y visual el uso de **Algoritmos Genéticos (AG)** en TypeScript. A través de una interfaz interactiva de consola, se pueden ejecutar y comparar dos problemas de optimización heurística clásicos: la resolución de un **Cuadro Mágico** de dimensión $n \times n$ y la **Decodificación de un Mensaje Secreto**.

---

## 📋 Tabla de Contenidos
- [¿De qué trata el proyecto?](#-de-qué-trata-el-proyecto)
- [Funcionamiento de los Algoritmos](#-funcionamiento-de-los-algoritmos)
  - [1. Búsqueda de Cuadro Mágico](#1-búsqueda-de-cuadro-mágico)
  - [2. Decodificador de Mensaje Secreto](#2-decodificador-de-mensaje-secreto)
- [🚀 Aplicaciones en el Mundo Real](#-aplicaciones-en-el-mundo-real)
- [📈 Resultados de la Ejecución](#-resultados-de-la-ejecución)
- [💻 Instalación y Requisitos](#-instalación-y-requisitos)
- [🛠️ Modos de Ejecución](#-modos-de-ejecución)

---

## 🧬 ¿De qué trata el proyecto?

Los algoritmos genéticos son métodos adaptativos de búsqueda y optimización inspirados en los principios de la evolución biológica y la genética natural (selección, recombinación, mutación y supervivencia del más apto). 

Este proyecto modela de manera detallada dos tipos de representaciones cromosómicas:
1. **Representación basada en Permutaciones**: Usada en la resolución de cuadros mágicos donde todos los elementos de la matriz deben ser únicos y abarcar el rango $[1, n^2]$.
2. **Representación Lineal / Discreta**: Usada en la decodificación de mensajes de caracteres alfabéticos.

Además, cuenta con un **Menú Interactivo CLI** integrado que simplifica el arranque y visualización de ambos experimentos desde un único comando principal.

---

## ⚙️ Funcionamiento de los Algoritmos

### 1. Búsqueda de Cuadro Mágico (`src/ga.ts` & `src/index.ts`)
Un cuadro mágico es una distribución de números enteros del $1$ al $n^2$ en una cuadrícula cuadrada, tal que la suma de los números en cualquier fila, columna y diagonal principal da siempre una constante (Número Mágico).
* **Constante Mágica**: Calculada mediante la fórmula $M = \frac{n(n^2 + 1)}{2}$. Para un cuadro $4 \times 4$, el número mágico es **34**.
* **Estructura del Cromosoma**: Arreglo unidimensional de $n^2$ números enteros (ej. permutación de 1 a 16).
* **Función de Costo (Aptitud)**: Suma de la diferencia absoluta entre el número mágico (34) y el valor sumado de cada fila, columna y diagonal. Buscamos minimizar este valor a **0**.
* **Operadores Genéticos**:
  * **Selección**: Selección por Torneo (retorna al mejor individuo de un grupo de competidores elegidos al azar).
  * **Crossover de Orden (OX1)**: Cruce especializado para permutaciones que copia un segmento de un padre y llena los huecos con el orden del segundo padre sin duplicar números.
  * **Mutación**: Mutación por Intercambio (Swap Mutation) que altera el orden de dos celdas seleccionadas aleatoriamente.
  * **Elitismo**: Mantiene los mejores individuos idénticos en la siguiente generación para asegurar la persistencia de las mejores soluciones encontradas.

### 2. Decodificador de Mensaje Secreto (`src/message.ts`)
Intenta aproximar de manera heurística un mensaje compuesto por letras y espacios partiendo de caracteres totalmente aleatorios.
* **Cromosoma**: Una cadena de caracteres de la longitud del mensaje objetivo.
* **Función de Costo (Aptitud)**: Suma la diferencia absoluta (distancia de caracteres en valor ASCII) entre el carácter del cromosoma y el del mensaje objetivo.
* **Operadores Genéticos**:
  * **Selección**: Selección elitista de los individuos mejor ranqueados de la población.
  * **Crossover**: Cruce uniforme de caracteres posicionales (50% de probabilidad de heredar la letra del padre 1 o del padre 2).
  * **Mutación**: Cambia un carácter aleatorio del cromosoma por otra letra o espacio con base en una tasa de mutación configurada.

---

## 🚀 Aplicaciones en el Mundo Real

Aunque este repositorio sirve como demostración educativa interactiva, las técnicas y algoritmos genéticos implementados aquí se aplican en problemas sumamente complejos del ámbito profesional y de ingeniería:
* **Logística y Distribución**: El problema del agente viajero (TSP), optimización de rutas de entrega de mercancía y gestión de almacenes (flujos muy relacionados al cruce por orden OX1).
* **Planificación y Scheduling**: Asignación de horarios de vuelos, horarios de personal médico y asignación de tareas en procesadores en paralelo.
* **Ingeniería y Diseño Estructural**: Optimización de peso, resistencia y costos de estructuras físicas como puentes, alas de aviones o componentes electrónicos.
* **Redes y Telecomunicaciones**: Enrutamiento eficiente de paquetes de datos y distribución óptima de antenas o celdas de transmisión de señales.
* **Inteligencia Artificial**: Búsqueda del conjunto de hiperparámetros óptimos en redes neuronales complejas y entrenamiento de agentes de comportamiento reactivo en videojuegos.

---

## 📈 Resultados de la Ejecución

### Decodificador de Mensaje Secreto (`npm run message`)
Partiendo de caracteres aleatorios con costo alto, el algoritmo genético optimiza la cadena en pocas generaciones mediante cruzamiento:
```
=========================================
Decodificando Mensaje Secreto
Objetivo: "bonny and amy are our children"
=========================================

Gen 0	| Costo: 304	| Mensaje: hkmmepdda qir ujo dpg xcaulnwc
Gen 20	| Costo: 4	| Mensaje: bonmy amd aly are ous children
Gen 30	| Costo: 0	| Mensaje: bonny and amy are our children

¡Mensaje decodificado con éxito en la generación 31!
```

### Búsqueda de Cuadro Mágico (`npm run magic`)
Genera combinaciones para satisfacer simultáneamente las restricciones de filas, columnas y diagonales:
```
=========================================
Buscando Cuadro Mágico de 4x4
Suma objetivo (Número Mágico): 34
=========================================

Generación 0 | Mejor costo actual: 21
Generación 100 | Mejor costo actual: 8
...
Generación 4900 | Mejor costo actual: 3

¡Búsqueda finalizada en la generación 5000!
Mejor costo final: 3 

Matriz resultante:
4	9	7	14
15	10	3	6
11	13	8	2
5	1	16	12
```

---

## 💻 Instalación y Requisitos

Este proyecto requiere tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

1. Clona este repositorio o descárgalo en tu máquina local.
2. Abre una terminal dentro del directorio del proyecto y ejecuta el siguiente comando para instalar las dependencias de desarrollo (`typescript` y `tsx`):
   ```bash
   npm install
   ```

---

## 🛠️ Modos de Ejecución

El proyecto incluye múltiples scripts en `package.json` para facilitar la ejecución a través de npm:

### Menú Interactivo (Recomendado)
Para iniciar la interfaz interactiva con un banner en la consola y elegir qué algoritmo probar mediante opciones numéricas:
```bash
npm start
```

### Ejecución Directa de Cuadros Mágicos
Si deseas omitir el menú e iniciar directamente el solucionador del Cuadro Mágico $4 \times 4$:
```bash
npm run magic
```

### Ejecución Directa de Decodificación
Si deseas omitir el menú e iniciar directamente la búsqueda heurística del mensaje secreto:
```bash
npm run message
```
