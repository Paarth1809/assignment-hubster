
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getClassroomPerformanceAnalytics, getClassroomGrades } from '@/services/GradeService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  TooltipProps
} from 'recharts';

interface ClassroomPerformanceChartProps {
  classroomId: string;
}

export default function ClassroomPerformanceChart({ classroomId }: ClassroomPerformanceChartProps) {
  const [studentAverages, setStudentAverages] = useState<any[]>([]);
  const [assignmentData, setAssignmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get average grade per student
        const studentData = await getClassroomPerformanceAnalytics(classroomId);
        setStudentAverages(studentData);
        
        // Get all grades to analyze by assignment
        const allGrades = await getClassroomGrades(classroomId);
        
        // Transform data for assignment analysis
        const assignmentMap: Record<string, { name: string, average: number, totalStudents: number }> = {};
        
        allGrades.forEach(grade => {
          const assignmentName = grade.assignment_name;
          if (!assignmentMap[assignmentName]) {
            assignmentMap[assignmentName] = {
              name: assignmentName,
              average: 0,
              totalStudents: 0
            };
          }
          
          assignmentMap[assignmentName].average += (grade.grade / grade.max_grade) * 100;
          assignmentMap[assignmentName].totalStudents += 1;
        });
        
        // Calculate final averages
        const assignmentAnalytics = Object.values(assignmentMap).map(item => ({
          name: item.name,
          average: item.totalStudents > 0 ? item.average / item.totalStudents : 0
        }));
        
        setAssignmentData(assignmentAnalytics);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching classroom analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [classroomId]);
  
  // Calculate class average
  const classAverage = studentAverages.length > 0 
    ? studentAverages.reduce((sum, student) => sum + student.averageGrade, 0) / studentAverages.length 
    : 0;
  
  // Prepare data for the radar chart
  const radarData = assignmentData.map(item => ({
    subject: item.name,
    A: item.average,
    fullMark: 100
  }));
  
  // Prepare data for the scatter plot
  const scatterData = studentAverages.map((student, index) => ({
    x: index + 1,
    y: student.averageGrade,
    z: 10,
    name: student.studentName
  }));
  
  // Format value for tooltip to safely handle different types
  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return `${value.toFixed(2)}%`;
    }
    return `${value}`;
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Classroom Analytics...</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  if (studentAverages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Analytics Available</CardTitle>
          <CardDescription>No grade data is available for this classroom.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classroom Performance Analytics</CardTitle>
        <CardDescription>
          Class average: {classAverage.toFixed(2)}% | Students: {studentAverages.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="students">Student Comparison</TabsTrigger>
            <TabsTrigger value="assignments">Assignment Analysis</TabsTrigger>
            <TabsTrigger value="distribution">Grade Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={studentAverages}
                margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="studentName" angle={-45} textAnchor="end" height={70} />
                <YAxis domain={[0, 100]} label={{ value: 'Average Grade (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [formatValue(value), 'Average Grade']} />
                <Bar dataKey="averageGrade" fill="#82ca9d" name="Average Grade (%)" />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="assignments" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} width={730} height={250} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Class Average" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Tooltip formatter={(value) => [formatValue(value), 'Average Score']} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="distribution" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="x" name="Student" />
                <YAxis type="number" dataKey="y" name="Grade" domain={[0, 100]} />
                <ZAxis type="number" dataKey="z" range={[60, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name, props) => {
                  if (name === 'y') return [formatValue(value), 'Grade'];
                  if (name === 'x') return [props.payload.name, 'Student'];
                  return [value, name];
                }} />
                <Legend />
                <Scatter name="Students" data={scatterData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
