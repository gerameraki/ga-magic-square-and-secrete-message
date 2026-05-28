import {
    GAConfig,
    calculateMagicNumber,
    initializePopulation,
    evaluatePopulation,
    evolve
} from './ga';

export const runMagicSquare = () => {
    // 1. Configuración del Algoritmo
    const config: GAConfig = {
        populationSize: 500, // Una población más grande ayuda a encontrar la solución más rápido
        mutationRate: 0.1,   // 10% de probabilidad de mutación
        n: 4,                // Empecemos con un cuadro mágico de 4x4 para que resuelva rápido
        elitismCount: 5      // Pasamos a los 5 mejores directamente a la siguiente generación
    };

    const target = calculateMagicNumber(config.n);
    console.log(`=========================================`);
    console.log(`Buscando Cuadro Mágico de ${config.n}x${config.n}`);
    console.log(`Suma objetivo (Número Mágico): ${target}`);
    console.log(`=========================================\n`);

    // 2. Inicialización
    let population = initializePopulation(config);
    population = evaluatePopulation(population, config, target);

    let generation = 0;
    const maxGenerations = 5000;
    let bestIndividual = population[0];

    // 3. Ciclo Evolutivo
    // Continuamos hasta que el costo sea 0 (cuadro perfecto) o alcancemos el límite de generaciones
    while (bestIndividual.cost > 0 && generation < maxGenerations) {
        population = evolve(population, config);
        population = evaluatePopulation(population, config, target);
        bestIndividual = population[0];

        // Imprimir el progreso cada 100 generaciones
        if (generation % 100 === 0) {
            console.log(`Generación ${generation} | Mejor costo actual: ${bestIndividual.cost}`);
        }

        generation++;
    }

    // 4. Resultados
    console.log(`\n¡Búsqueda finalizada en la generación ${generation}!`);
    console.log(`Mejor costo final: ${bestIndividual.cost} ${bestIndividual.cost === 0 ? '(¡ÉXITO!)' : ''}`);

    // Imprimir el cromosoma como una matriz para que sea fácil de leer
    console.log('\nMatriz resultante:');
    for (let i = 0; i < config.n; i++) {
        const row = bestIndividual.chromosome.slice(i * config.n, (i + 1) * config.n);
        console.log(row.join('\t'));
    }
};

if (require.main === module) {
    runMagicSquare();
}