/*
 * Malla Curricular - Ingeniería en Computación TEC
 * 
 * ACTUALIZACIÓN: Datos movidos a JSON (28 de julio 2025)
 * 
 * Los datos de carreras ahora se cargan desde archivos JSON:
 * - src/data/careers/index.json - Lista de carreras disponibles
 * - src/data/careers/computing-engineering-tec.json - Datos de Ingeniería en Computación
 * 
 * Esto permite:
 * - Fácil edición sin tocar código TypeScript
 * - Separación clara entre datos y lógica
 * - Futuras integraciones con APIs
 * - Mejor mantenimiento
 */

export type SubjectStatus = 'pending' | 'in-progress' | 'completed';

// Datos del servidor - información estática de la carrera
export interface SubjectInfo {
  code: string;
  name: string;
  credits: number;
  prerequisites?: string[];
  corequisites?: string[];
}

export interface Block {
  id: number;
  name: string;
  subjects: SubjectInfo[];
  totalCredits: number;
}

export interface Career {
  id: string;
  name: string;
  university: string;
  blocks: Block[];
}

// Datos del usuario - información personal guardada en localStorage
export interface UserSubjectData {
  code: string;
  status: SubjectStatus;
  grade?: number;
  enrollmentDate?: string;
  completionDate?: string;
}

export interface UserProgress {
  careerId: string;
  subjects: UserSubjectData[];
  lastUpdated: string;
}

// Carga de datos desde archivos JSON
import careerIndexData from '@/data/careers/index.json';
import computingEngineeringData from '@/data/careers/computing-engineering-tec.json';

// Datos estáticos de la carrera - Ingeniería en Computación TEC
export const computingEngineeringCareer: Career = computingEngineeringData as Career;

// Lista de carreras disponibles (preparado para futuras expansiones)
export const availableCareers: Career[] = [
  computingEngineeringCareer,
  // Aquí se pueden agregar más carreras cargando otros archivos JSON
];

// Funciones helper para manejar datos de carreras
export const getTotalCredits = (career: Career): number => {
  return career.blocks.reduce((total, block) => total + block.totalCredits, 0);
};

export const getAllSubjects = (career: Career): SubjectInfo[] => {
  return career.blocks.flatMap(block => block.subjects);
};

export const getSubjectByCode = (career: Career, code: string): SubjectInfo | undefined => {
  return getAllSubjects(career).find(subject => subject.code === code);
};

// Funciones para manejar el progreso del usuario
export const getUserProgress = (careerId: string): UserProgress => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return {
      careerId,
      subjects: [],
      lastUpdated: new Date().toISOString(),
    };
  }
  
  const stored = localStorage.getItem(`userProgress_${careerId}`);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Retornar progreso vacío si no existe
  return {
    careerId,
    subjects: [],
    lastUpdated: new Date().toISOString(),
  };
};

export const saveUserProgress = (progress: UserProgress): void => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return;
  }
  
  progress.lastUpdated = new Date().toISOString();
  localStorage.setItem(`userProgress_${progress.careerId}`, JSON.stringify(progress));
};

export const updateSubjectStatus = (
  careerId: string, 
  subjectCode: string, 
  status: SubjectStatus, 
  grade?: number
): void => {
  const progress = getUserProgress(careerId);
  const existingIndex = progress.subjects.findIndex(s => s.code === subjectCode);
  
  const subjectData: UserSubjectData = {
    code: subjectCode,
    status,
    grade,
    enrollmentDate: status === 'in-progress' ? new Date().toISOString() : undefined,
    completionDate: status === 'completed' ? new Date().toISOString() : undefined,
  };
  
  if (existingIndex >= 0) {
    progress.subjects[existingIndex] = { ...progress.subjects[existingIndex], ...subjectData };
  } else {
    progress.subjects.push(subjectData);
  }
  
  saveUserProgress(progress);
};

export const getSubjectStatus = (careerId: string, subjectCode: string): SubjectStatus => {
  const progress = getUserProgress(careerId);
  const subjectData = progress.subjects.find(s => s.code === subjectCode);
  return subjectData?.status || 'pending';
};

export const getSubjectGrade = (careerId: string, subjectCode: string): number | undefined => {
  const progress = getUserProgress(careerId);
  const subjectData = progress.subjects.find(s => s.code === subjectCode);
  return subjectData?.grade;
};

export const getCompletedCredits = (career: Career, careerId: string): number => {
  const progress = getUserProgress(careerId);
  return career.blocks.reduce((total, block) => {
    return total + block.subjects
      .filter(subject => {
        const userData = progress.subjects.find(s => s.code === subject.code);
        return userData?.status === 'completed';
      })
      .reduce((sum, subject) => sum + subject.credits, 0);
  }, 0);
};

export const getSubjectsByStatus = (career: Career, careerId: string, status: SubjectStatus): SubjectInfo[] => {
  const progress = getUserProgress(careerId);
  return career.blocks.flatMap(block => 
    block.subjects.filter(subject => {
      const userData = progress.subjects.find(s => s.code === subject.code);
      return (userData?.status || 'pending') === status;
    })
  );
};

// Función para verificar si un curso puede ser tomado (prerequisitos cumplidos)
export const canTakeSubject = (career: Career, careerId: string, subjectCode: string): boolean => {
  const subject = getSubjectByCode(career, subjectCode);
  if (!subject) return false;
  
  // Verificar prerequisitos - deben estar completados
  if (subject.prerequisites) {
    const prerequisitesMet = subject.prerequisites.every(prereqCode => 
      getSubjectStatus(careerId, prereqCode) === 'completed'
    );
    if (!prerequisitesMet) return false;
  }
  
  // Verificar correquisitos - deben poder tomarse también
  if (subject.corequisites) {
    const corequisitesCanBeTaken = subject.corequisites.every(coreqCode => {
      const coreqSubject = getSubjectByCode(career, coreqCode);
      if (!coreqSubject) return false;
      
      // Un correquisito puede tomarse si:
      // 1. Ya está completado o en progreso, O
      // 2. Puede tomarse ahora (sus prerequisitos están completados)
      const coreqStatus = getSubjectStatus(careerId, coreqCode);
      if (coreqStatus === 'completed' || coreqStatus === 'in-progress') {
        return true;
      }
      
      // Verificar si el correquisito puede tomarse (sin verificar SUS correquisitos para evitar recursión infinita)
      if (coreqSubject.prerequisites) {
        return coreqSubject.prerequisites.every(prereqCode => 
          getSubjectStatus(careerId, prereqCode) === 'completed'
        );
      }
      
      return true; // Si no tiene prerequisitos, puede tomarse
    });
    
    if (!corequisitesCanBeTaken) return false;
  }
  
  return true;
};

// Función para obtener los correquisitos que deben llevarse con un curso
export const getSubjectCorequisites = (career: Career, subjectCode: string): SubjectInfo[] => {
  const subject = getSubjectByCode(career, subjectCode);
  if (!subject || !subject.corequisites) return [];
  
  return subject.corequisites
    .map(coreqCode => getSubjectByCode(career, coreqCode))
    .filter((coreq): coreq is SubjectInfo => coreq !== undefined);
};
