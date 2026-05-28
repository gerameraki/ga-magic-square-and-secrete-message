// --- CONFIGURACIÓN BASE ---
const TARGET_MESSAGE = "bonny and amy are our children";
const ALPHABET = "abcdefghijklmnopqrstuvwxyz "; // 26 letras + 1 espacio

interface GAConfig {
    populationSize: number;
    mutationRate: number;
}

interface Individual {
    chromosome: string;
    cost: number;
}

// --- FUNCIÓN DE COSTO (FITNESS) ---
/**
 * Calcula el costo evaluando la diferencia absoluta entre el código ASCII 
 * del carácter esperado y el carácter adivinado, tal como indica la fórmula.
 */
const calculateCost = (guess: string, target: string): number => {
    let cost = 0;
    for (let i = 0; i < target.length; i++) {
        const targetCode = target.charCodeAt(i);
        const guessCode = guess.charCodeAt(i);
        cost += Math.abs(targetCode - guessCode);
    }
    return cost;
};

// --- OPERADORES GENÉTICOS ---

const getRandomChar = (): string => {
    const randomIndex = Math.floor(Math.random() * ALPHABET.length);
    return ALPHABET[randomIndex];
};

const generateRandomChromosome = (length: number): string => {
    let chromosome = "";
    for (let i = 0; i < length; i++) {
        chromosome += getRandomChar();
    }
    return chromosome;
};

const mutate = (chromosome: string, mutationRate: number): string => {
    let mutated = "";
    for (let i = 0; i < chromosome.length; i++) {
        if (Math.random() < mutationRate) {
            mutated += getRandomChar();
        } else {
            mutated += chromosome[i];
        }
    }
    return mutated;
};

const crossover = (parent1: string, parent2: string): string => {
    let child = "";
    for (let i = 0; i < parent1.length; i++) {
        // 50% de probabilidad de heredar el gen de cada padre
        child += Math.random() < 0.5 ? parent1[i] : parent2[i];
    }
    return child;
};

// --- CICLO PRINCIPAL ---

export const runMessageDecoder = () => {
    const config: GAConfig = {
        populationSize: 800,
        mutationRate: 0.05, // Mutación baja para no perder los caracteres correctos encontrados
    };

    const targetLength = TARGET_MESSAGE.length;
    let population: Individual[] = Array.from({ length: config.populationSize }, () => {
        const chromosome = generateRandomChromosome(targetLength);
        return { chromosome, cost: calculateCost(chromosome, TARGET_MESSAGE) };
    });

    // Ordenar la población inicial
    population.sort((a, b) => a.cost - b.cost);

    let generation = 0;
    let bestIndividual = population[0];

    console.log(`=========================================`);
    console.log(`Decodificando Mensaje Secreto`);
    console.log(`Objetivo: "${TARGET_MESSAGE}"`);
    console.log(`=========================================\n`);

    // Evolucionar hasta encontrar el costo 0 (coincidencia perfecta)
    while (bestIndividual.cost > 0) {
        const newPopulation: Individual[] = [];

        // Elitismo: Conservamos a los 2 mejores de la generación anterior
        newPopulation.push(population[0]);
        newPopulation.push(population[1]);

        // Llenar el resto de la población
        while (newPopulation.length < config.populationSize) {
            // Selección simple de los mejores rankeados
            const parent1 = population[Math.floor(Math.random() * 50)].chromosome;
            const parent2 = population[Math.floor(Math.random() * 50)].chromosome;

            let child = crossover(parent1, parent2);
            child = mutate(child, config.mutationRate);

            newPopulation.push({
                chromosome: child,
                cost: calculateCost(child, TARGET_MESSAGE),
            });
        }

        population = newPopulation.sort((a, b) => a.cost - b.cost);
        bestIndividual = population[0];

        // Imprimir progreso para visualizar el acercamiento, similar a la tabla del PDF
        if (generation % 20 === 0 || bestIndividual.cost === 0) {
            console.log(`Gen ${generation}\t| Costo: ${bestIndividual.cost}\t| Mensaje: ${bestIndividual.chromosome}`);
        }

        generation++;
    }

    console.log(`\n¡Mensaje decodificado con éxito en la generación ${generation}!`);
};

if (require.main === module) {
    runMessageDecoder();
}