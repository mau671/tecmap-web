import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BookOpen, CheckCircle, Clock, Circle } from 'lucide-react';
import { 
  availableCareers,
  getCareerById,
  getAvailableCareers,
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
  const [currentCareerId, setCurrentCareerId] = useState<string>(selectedCareerId);
  const [currentCareer, setCurrentCareer] = useState<Career | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Update career when selectedCareerId changes or component mounts
  useEffect(() => {
    const career = getCareerById(currentCareerId) || availableCareers[0];
    setCurrentCareer(career);
    setIsClient(true);
  }, [currentCareerId]);

  // Handle career change
  const handleCareerChange = (careerId: string) => {
    setCurrentCareerId(careerId);
    setRefreshKey(prev => prev + 1);
  };

  // Force re-render when localStorage changes
  const forceRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!currentCareer) {
    return <LoadingSpinner />;
  }

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
    <div className="min-h-screen bg-background text-foreground p-4 transition-colors">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <BookOpen className="w-8 h-8" />
            Malla Curricular TEC
          </h1>
          
          {/* Career Selector */}
          <div className="mb-4 flex justify-center">
            <Select value={currentCareerId} onValueChange={handleCareerChange}>
              <SelectTrigger className="w-[350px]">
                <SelectValue placeholder="Selecciona una carrera" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableCareers().map((career) => (
                  <SelectItem key={career.id} value={career.id}>
                    {career.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <p className="text-lg text-muted-foreground mb-4">
            {currentCareer.university}
          </p>
          <div className="flex justify-center gap-4 text-sm mb-4">
            <Badge variant="secondary">Total: {getTotalCredits(currentCareer)} créditos</Badge>
            <Badge variant="completed">Completados: {isClient ? getCompletedCredits(currentCareer, currentCareer.id) : 0} créditos</Badge>
            <Badge variant="credits">Progreso: {isClient ? Math.round((getCompletedCredits(currentCareer, currentCareer.id) / getTotalCredits(currentCareer)) * 100) : 0}%</Badge>
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
            <Card key={block.id} className="overflow-hidden border border-border bg-card">
              <CardHeader className="bg-primary/5 border-b border-border">
                <CardTitle className="flex items-center justify-between text-card-foreground">
                  <span>{block.name}</span>
                  <Badge variant="credits" className="text-sm">
                    {block.totalCredits} créditos
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-card">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {block.subjects.map((subject) => {
                    const currentStatus = isClient ? getSubjectStatus(currentCareer.id, subject.code) : 'pending';
                    const currentGrade = isClient ? getSubjectGrade(currentCareer.id, subject.code) : undefined;
                    const isAvailable = isClient ? isSubjectAvailable(subject) : true;
                    
                    return (
                      <div
                        key={subject.code}
                        className={cn(
                          "p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md hover:scale-[1.02] bg-card text-card-foreground border-border",
                          !isAvailable && currentStatus === 'pending' && "opacity-60 cursor-not-allowed",
                          currentStatus === 'completed' && "border-[hsl(var(--course-completed-border))] bg-[hsl(var(--course-completed-bg))]",
                          currentStatus === 'in-progress' && "border-[hsl(var(--course-in-progress-border))] bg-[hsl(var(--course-in-progress-bg))]",
                          currentStatus === 'pending' && "hover:bg-accent/50"
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
                            <span className="font-mono text-xs text-muted-foreground">
                              {subject.code}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="credits" className="text-xs">
                              {subject.credits} créditos
                            </Badge>
                          </div>
                        </div>
                        <h4 className="font-medium text-sm leading-tight mb-2 text-card-foreground">
                          {subject.name}
                        </h4>
                        {currentGrade && (
                          <div className="text-xs text-muted-foreground">
                            Nota: {currentGrade}
                          </div>
                        )}
                        {subject.prerequisites && subject.prerequisites.length > 0 && (
                          <div className="text-xs text-muted-foreground mt-1">
                            <span className="font-medium">Req:</span> {subject.prerequisites.join(', ')}
                          </div>
                        )}
                        {subject.corequisites && subject.corequisites.length > 0 && (
                          <div className="text-xs text-primary mt-1">
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
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Haz clic en las materias para cambiar su estado: Pendiente → Cursando → Aprobada</p>
          <p>Las materias con requisitos aparecerán deshabilitadas hasta que completes los prerequisitos</p>
        </div>
      </div>
    </div>
  );
};

export default CurriculumMap;
