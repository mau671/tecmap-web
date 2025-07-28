import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, Clock, Circle } from 'lucide-react';
import { 
  computingEngineeringCareer, 
  availableCareers,
  type SubjectStatus, 
  type SubjectInfo,
  type Career,
  updateSubjectStatus,
  getSubjectStatus,
  getSubjectGrade,
  getTotalCredits,
  getCompletedCredits,
  canTakeSubject,
  getSubjectsByStatus,
  getSubjectCorequisites
} from '@/data/curriculum';
import { cn } from '@/lib/utils';

interface CurriculumMapProps {
  selectedCareerId?: string;
}

const CurriculumMap: React.FC<CurriculumMapProps> = ({ selectedCareerId = 'comp-eng-tec' }) => {
  const [currentCareer, setCurrentCareer] = useState<Career>(computingEngineeringCareer);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Update career when selectedCareerId changes
  useEffect(() => {
    const career = availableCareers.find(c => c.id === selectedCareerId);
    if (career) {
      setCurrentCareer(career);
    }
  }, [selectedCareerId]);

  // Set client flag when component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Force re-render when localStorage changes
  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleSubjectClick = (subjectCode: string) => {
    if (!isClient) return;
    
    const currentStatus = getSubjectStatus(currentCareer.id, subjectCode);
    let nextStatus: SubjectStatus;
    
    switch (currentStatus) {
      case 'pending':
        nextStatus = 'in-progress';
        break;
      case 'in-progress':
        nextStatus = 'completed';
        break;
      case 'completed':
        nextStatus = 'pending';
        break;
    }
    
    updateSubjectStatus(currentCareer.id, subjectCode, nextStatus);
    forceRefresh();
  };

  const getStatusIcon = (status: SubjectStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending':
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusVariant = (status: SubjectStatus) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'in-progress':
        return 'in-progress';
      case 'pending':
        return 'pending';
    }
  };

  const isSubjectAvailable = (subject: SubjectInfo): boolean => {
    return canTakeSubject(currentCareer, currentCareer.id, subject.code);
  };

  return (
    <div className="min-h-screen bg-white text-gray-950 p-4 dark:bg-gray-950 dark:text-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8" />
            Malla Curricular - {currentCareer.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {currentCareer.university}
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <span>Total: {getTotalCredits(currentCareer)} créditos</span>
            <span>Completados: {isClient ? getCompletedCredits(currentCareer, currentCareer.id) : 0} créditos</span>
            <span>Progreso: {isClient ? Math.round((getCompletedCredits(currentCareer, currentCareer.id) / getTotalCredits(currentCareer)) * 100) : 0}%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6 flex justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant="completed">Aprobada</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="in-progress">Cursando</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="pending">Pendiente</Badge>
          </div>
        </div>

        {/* Curriculum Blocks */}
        <div className="grid gap-6">
          {currentCareer.blocks.map((block) => (
            <Card key={block.id} className="overflow-hidden">
              <CardHeader className="bg-blue-50 dark:bg-blue-950">
                <CardTitle className="flex items-center justify-between">
                  <span>{block.name}</span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    {block.totalCredits} créditos
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {block.subjects.map((subject) => {
                    const currentStatus = isClient ? getSubjectStatus(currentCareer.id, subject.code) : 'pending';
                    const currentGrade = isClient ? getSubjectGrade(currentCareer.id, subject.code) : undefined;
                    const isAvailable = isClient ? isSubjectAvailable(subject) : true;
                    
                    return (
                      <div
                        key={subject.code}
                        className={cn(
                          "p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md",
                          !isAvailable && currentStatus === 'pending' && "opacity-60 cursor-not-allowed",
                          currentStatus === 'completed' && "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
                          currentStatus === 'in-progress' && "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
                          currentStatus === 'pending' && "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                        )}
                        onClick={() => {
                          if (isAvailable || currentStatus !== 'pending') {
                            handleSubjectClick(subject.code);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(currentStatus)}
                            <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                              {subject.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusVariant(currentStatus)} className="text-xs">
                              {subject.credits} créditos
                            </Badge>
                          </div>
                        </div>
                        <h4 className="font-medium text-sm leading-tight mb-2">
                          {subject.name}
                        </h4>
                        {currentGrade && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Nota: {currentGrade}
                          </div>
                        )}
                        {subject.prerequisites && subject.prerequisites.length > 0 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span className="font-medium">Req:</span> {subject.prerequisites.join(', ')}
                          </div>
                        )}
                        {subject.corequisites && subject.corequisites.length > 0 && (
                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            <span className="font-medium">Correq:</span> {subject.corequisites.join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Haz clic en las materias para cambiar su estado: Pendiente → Cursando → Aprobada</p>
          <p>Las materias con requisitos aparecerán deshabilitadas hasta que completes los prerequisitos</p>
        </div>
      </div>
    </div>
  );
};

export default CurriculumMap;
