import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import { runMagicSquare } from './index';
import { runMessageDecoder } from './message';

const showBanner = () => {
    console.clear();
    console.log("\x1b[36m%s\x1b[0m", "=================================================");
    console.log("\x1b[35m%s\x1b[0m", "      BIENVENIDO A ALGORITMOS GENÉTICOS CLI      ");
    console.log("\x1b[36m%s\x1b[0m", "=================================================");
    console.log("Selecciona una opción para ejecutar:");
    console.log(" \x1b[33m1.\x1b[0m Buscar Cuadro Mágico (4x4)");
    console.log(" \x1b[33m2.\x1b[0m Decodificar Mensaje Secreto");
    console.log(" \x1b[33m3.\x1b[0m Salir");
    console.log("\x1b[36m%s\x1b[0m", "-------------------------------------------------");
};

export const startMenu = async () => {
    const rl = readline.createInterface({ input, output });
    
    let active = true;
    while (active) {
        showBanner();
        const answer = await rl.question("\x1b[32mElije una opción (1-3): \x1b[0m");
        
        switch (answer.trim()) {
            case '1':
                console.clear();
                console.log("\x1b[34mIniciando: Búsqueda de Cuadro Mágico...\x1b[0m\n");
                runMagicSquare();
                active = false; // Finalizamos el menú tras la ejecución
                break;
            case '2':
                console.clear();
                console.log("\x1b[34mIniciando: Decodificación de Mensaje Secreto...\x1b[0m\n");
                runMessageDecoder();
                active = false;
                break;
            case '3':
                console.log("\n\x1b[35m¡Gracias por usar Algoritmos Genéticos CLI! ¡Hasta luego!\x1b[0m\n");
                active = false;
                break;
            default:
                console.log("\n\x1b[31mOpción no válida. Presiona Enter para intentar de nuevo...\x1b[0m");
                await rl.question("");
                break;
        }
    }
    
    rl.close();
};

if (require.main === module) {
    startMenu();
}
