
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStudentGrades } from '@/services/GradeService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface StudentGradesChartProps {
  studentId: string;
  classroomId: string;
}

export default function StudentGradesChart({ studentId, classroomId }: StudentGradesChartProps) {
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bar');
  const [error, setError] = useState<string | null>(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoading(true);
        const data = await getStudentGrades(studentId, classroomId);
        
        // Transform data for charts
        const formattedData = data.map(grade => ({
          name: grade.assignment_name,
          grade: grade.grade,
          maxGrade: grade.max_grade,
          percentage: (grade.grade / grade.max_grade) * 100,
          date: new Date(grade.submitted_at).toLocaleDateString()
        }));
        
        setGrades(formattedData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching grades:', err);
        setError('Failed to load grade data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGrades();
  }, [studentId, classroomId]);
  
  // Calculate average grade
  const averageGrade = grades.length > 0 
    ? grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length 
    : 0;
    
  // Prepare performance distribution data for pie chart
  const performanceDistribution = [
    { name: 'Excellent (90-100%)', value: 0 },
    { name: 'Good (80-89%)', value: 0 },
    { name: 'Average (70-79%)', value: 0 },
    { name: 'Fair (60-69%)', value: 0 },
    { name: 'Poor (Below 60%)', value: 0 }
  ];
  
  grades.forEach(grade => {
    if (grade.percentage >= 90) performanceDistribution[0].value++;
    else if (grade.percentage >= 80) performanceDistribution[1].value++;
    else if (grade.percentage >= 70) performanceDistribution[2].value++;
    else if (grade.percentage >= 60) performanceDistribution[3].value++;
    else performanceDistribution[4].value++;
  });
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Grades...</CardTitle>
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
  
  if (grades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Grades Available</CardTitle>
          <CardDescription>No grade data is available for this student in this class.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Analysis</CardTitle>
        <CardDescription>
          Average grade: {averageGrade.toFixed(2)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Progress</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={grades}
                margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis domain={[0, 100]} label={{ value: 'Grade (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Grade']} />
                <Bar dataKey="percentage" fill="#8884d8" name="Grade (%)" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="line" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[...grades].reverse()} // Reverse for chronological order
                margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Grade']} />
                <Legend />
                <Line type="monotone" dataKey="percentage" stroke="#8884d8" name="Grade (%)" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="distribution" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceDistribution.filter(item => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {performanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} assignments`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
