// Test de validación para verificar el problema específico mencionado
// IC2001 no debería ser seleccionable si IC2101 no puede tomarse

import { readFileSync } from 'fs';

// Cargar datos desde JSON
const careerData = JSON.parse(readFileSync('./src/data/careers/computing-engineering-tec.json', 'utf8'));

// Recrear las funciones de validación
function canTakeSubject(subjectCode, completedSubjects, allSubjects) {
  const subject = allSubjects.find(s => s.code === subjectCode);
  if (!subject) return false;

  // Verificar prerrequisitos
  if (subject.prerequisites) {
    for (const prereq of subject.prerequisites) {
      if (!completedSubjects.includes(prereq)) {
        console.log(`❌ ${subjectCode}: Prerrequisito ${prereq} no completado`);
        return false;
      }
    }
  }

  // Verificar correquisitos
  if (subject.corequisites) {
    for (const coreq of subject.corequisites) {
      if (!completedSubjects.includes(coreq) && !canTakeSubject(coreq, completedSubjects, allSubjects)) {
        console.log(`❌ ${subjectCode}: Correquisito ${coreq} no puede tomarse`);
        return false;
      }
    }
  }

  return true;
}

// Obtener todas las materias
const allSubjects = careerData.blocks.flatMap(block => block.subjects);

// Simular usuario que solo ha completado materias del Bloque 1
const completedSubjects = ['CI1106', 'IC1400', 'IC1802', 'IC1803', 'MA1403'];

console.log('=== TEST DE VALIDACIÓN ===');
console.log('Materias completadas:', completedSubjects);
console.log();

// Probar el caso específico: IC2001
console.log('🔍 Probando IC2001 (Estructuras de Datos):');
const ic2001 = allSubjects.find(s => s.code === 'IC2001');
console.log('- Prerrequisitos:', ic2001.prerequisites || 'Ninguno');
console.log('- Correquisitos:', ic2001.corequisites || 'Ninguno');

const canTakeIC2001 = canTakeSubject('IC2001', completedSubjects, allSubjects);
console.log(`Resultado: ${canTakeIC2001 ? '✅ PUEDE tomar' : '❌ NO PUEDE tomar'} IC2001`);
console.log();

// Analizar por qué
console.log('📋 Análisis detallado:');
console.log('1. IC2001 tiene correquisito IC2101');
console.log('2. IC2101 requiere prerrequisitos IC1802, IC1803');
console.log('3. IC1802 ✅ completado');
console.log('4. IC1803 ✅ completado');
console.log('5. Por tanto, IC2101 SÍ puede tomarse');
console.log('6. Por tanto, IC2001 SÍ puede tomarse (con IC2101 como correquisito)');
console.log();

// Probar un caso donde NO debería poder tomar
console.log('🔍 Probando con materias incompletas:');
const incompleteSubjects = ['CI1106', 'IC1400']; // Sin IC1802, IC1803
const canTakeIC2001Incomplete = canTakeSubject('IC2001', incompleteSubjects, allSubjects);
console.log(`Con materias incompletas: ${canTakeIC2001Incomplete ? '✅ PUEDE tomar' : '❌ NO PUEDE tomar'} IC2001`);
