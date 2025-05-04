
import React from 'react';
import { PartnershipCalculation } from '@/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface PartnershipCompatibilityProps {
  calculation: (PartnershipCalculation & { id: string; createdAt: string });
}

export const PartnershipCompatibility: React.FC<PartnershipCompatibilityProps> = ({ calculation }) => {
  const { compatibility } = calculation.results;
  
  const radarData = {
    labels: ['Общая', 'Эмоциональная', 'Интеллектуальная', 'Физическая'],
    datasets: [
      {
        label: 'Совместимость',
        data: [
          compatibility.overall,
          compatibility.emotional,
          compatibility.intellectual,
          compatibility.physical
        ],
        backgroundColor: 'rgba(101, 81, 255, 0.2)',
        borderColor: 'rgba(101, 81, 255, 1)',
        borderWidth: 1,
        pointBackgroundColor: 'rgba(101, 81, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(101, 81, 255, 1)',
      }
    ]
  };
  
  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">Совместимость</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Compatibility Stats */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Общая совместимость</span>
                <span className="font-semibold">{compatibility.overall}%</span>
              </div>
              <Progress value={compatibility.overall} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Эмоциональная совместимость</span>
                <span className="font-semibold">{compatibility.emotional}%</span>
              </div>
              <Progress value={compatibility.emotional} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Интеллектуальная совместимость</span>
                <span className="font-semibold">{compatibility.intellectual}%</span>
              </div>
              <Progress value={compatibility.intellectual} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Физическая совместимость</span>
                <span className="font-semibold">{compatibility.physical}%</span>
              </div>
              <Progress value={compatibility.physical} className="h-2" />
            </div>
          </div>
          
          {/* Radar Chart */}
          <div className="h-[300px]">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
        
        {/* Compatibility Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h4 className="font-medium mb-2">Сильные стороны отношений:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {calculation.results.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Вызовы в отношениях:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {calculation.results.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="mt-6">
          <h4 className="font-medium mb-2">Рекомендации:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {calculation.results.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
