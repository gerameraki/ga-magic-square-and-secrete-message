// --- 1. TIPOS E INTERFACES BASE ---

export type Chromosome = number[];

export interface GAConfig {
    populationSize: number;
    mutationRate: number;
    n: number; // Dimensión de la matriz (ej. 3 para 3x3, 4 para 4x4)
    elitismCount?: number; // Cuántos de los mejores pasan directo a la sig. generación
}

export interface Individual {
    chromosome: Chromosome;
    cost: number; // En este caso, buscamos minimizar el costo hasta llegar a 0
}

// --- 2. CÁLCULO DEL OBJETIVO ---

export const calculateMagicNumber = (n: number): number => {
    return (Math.pow(n, 3) + n) / 2;
};

// --- 3. INICIALIZACIÓN ---

const shuffleArray = (array: number[]): number[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const initializePopulation = (config: GAConfig): Individual[] => {
    const { populationSize, n } = config;
    const totalGenes = Math.pow(n, 2);
    const population: Individual[] = [];

    const baseSequence = Array.from({ length: totalGenes }, (_, i) => i + 1);

    for (let i = 0; i < populationSize; i++) {
        population.push({
            chromosome: shuffleArray(baseSequence),
            cost: Infinity, // Se calculará en la evaluación
        });
    }

    return population;
};

// --- 4. FUNCIÓN DE COSTO (FITNESS) ---

/**
 * Calcula qué tan lejos está un cromosoma de ser un cuadro mágico perfecto.
 * Suma la diferencia absoluta de cada fila, columna y diagonal respecto al número mágico.
 */
export const calculateCost = (chromosome: Chromosome, n: number, magicTarget: number): number => {
    let totalCost = 0;

    // Evaluar Filas y Columnas
    for (let i = 0; i < n; i++) {
        let rowSum = 0;
        let colSum = 0;
        for (let j = 0; j < n; j++) {
            rowSum += chromosome[i * n + j]; // Índice para fila
            colSum += chromosome[j * n + i]; // Índice para columna
        }
        totalCost += Math.abs(magicTarget - rowSum);
        totalCost += Math.abs(magicTarget - colSum);
    }

    // Evaluar Diagonales
    let diag1Sum = 0;
    let diag2Sum = 0;
    for (let i = 0; i < n; i++) {
        diag1Sum += chromosome[i * n + i]; // Diagonal principal (\)
        diag2Sum += chromosome[i * n + (n - 1 - i)]; // Diagonal secundaria (/)
    }
    totalCost += Math.abs(magicTarget - diag1Sum);
    totalCost += Math.abs(magicTarget - diag2Sum);

    return totalCost;
};

export const evaluatePopulation = (population: Individual[], config: GAConfig, target: number): Individual[] => {
    return population
        .map(ind => ({
            ...ind,
            cost: calculateCost(ind.chromosome, config.n, target)
        }))
        .sort((a, b) => a.cost - b.cost); // Ordenamos de menor (mejores) a mayor costo
};

// --- 5. SELECCIÓN, CRUCE Y MUTACIÓN ---

/**
 * Selección por Torneo: Escoge aleatoriamente 'k' individuos y retorna el mejor.
 */
const tournamentSelection = (population: Individual[], k: number = 3): Individual => {
    let best: Individual | null = null;
    for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * population.length);
        const contestant = population[randomIndex];
        if (!best || contestant.cost < best.cost) {
            best = contestant;
        }
    }
    return best!;
};

/**
 * Cruce de Orden (Order Crossover - OX1).
 * Esencial para genotipos basados en permutaciones.
 */
const orderCrossover = (parent1: Chromosome, parent2: Chromosome): Chromosome => {
    const length = parent1.length;
    const start = Math.floor(Math.random() * length);
    const end = start + Math.floor(Math.random() * (length - start));

    const child: Chromosome = new Array(length).fill(-1);

    // 1. Copiar el segmento del primer padre
    for (let i = start; i < end; i++) {
        child[i] = parent1[i];
    }

    // 2. Llenar los espacios vacíos con los genes del segundo padre (preservando su orden)
    let currentIndex = 0;
    for (let i = 0; i < length; i++) {
        if (child[i] === -1) {
            while (child.includes(parent2[currentIndex])) {
                currentIndex++;
            }
            child[i] = parent2[currentIndex];
        }
    }

    return child;
};

/**
 * Mutación por Intercambio (Swap Mutation).
 * Intercambia dos posiciones aleatorias del cuadro.
 */
const mutate = (chromosome: Chromosome, mutationRate: number): Chromosome => {
    const mutated = [...chromosome];
    for (let i = 0; i < mutated.length; i++) {
        if (Math.random() < mutationRate) {
            const j = Math.floor(Math.random() * mutated.length);
            // Swap simple
            [mutated[i], mutated[j]] = [mutated[j], mutated[i]];
        }
    }
    return mutated;
};

// --- 6. CICLO EVOLUTIVO ---

/**
 * Genera la siguiente generación a partir de la actual.
 */
export const evolve = (population: Individual[], config: GAConfig): Individual[] => {
    const { populationSize, mutationRate, elitismCount = 1 } = config;
    const newPopulation: Individual[] = [];

    // Elitismo: Pasar a los mejores directamente a la siguiente generación
    for (let i = 0; i < elitismCount; i++) {
        newPopulation.push(population[i]);
    }

    // Llenar el resto de la población con cruce y mutación
    while (newPopulation.length < populationSize) {
        const parent1 = tournamentSelection(population);
        const parent2 = tournamentSelection(population);

        let childChromosome = orderCrossover(parent1.chromosome, parent2.chromosome);
        childChromosome = mutate(childChromosome, mutationRate);

        newPopulation.push({ chromosome: childChromosome, cost: Infinity });
    }

    return newPopulation;
};