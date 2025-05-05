import React from 'react';
import { ArchetypeDescription, NumerologyCodeType } from '@/types/numerology';

interface ArchetypeDetailsProps {
  archetype: ArchetypeDescription | undefined;
}

export const ArchetypeDetails: React.FC<ArchetypeDetailsProps> = ({ archetype }) => {
  if (!archetype) {
    return <div className="text-muted-foreground">Информация отсутствует.</div>;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{archetype.title}</h3>
      
      {archetype.description && (
        <div className="prose prose-slate max-w-none text-sm">
          <p>{archetype.description}</p>
        </div>
      )}
      
      {/* Personality specific fields */}
      {archetype.code === 'personality' && (
        <>
          {archetype.resourceManifestation && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Ресурсное проявление:</h4>
              <p className="text-sm bg-green-50 p-3 rounded-md border border-green-200">{archetype.resourceManifestation}</p>
            </div>
          )}
          
          {archetype.distortedManifestation && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Искаженное проявление:</h4>
              <p className="text-sm bg-red-50 p-3 rounded-md border border-red-200">{archetype.distortedManifestation}</p>
            </div>
          )}
          
          {archetype.developmentTask && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Задача развития:</h4>
              <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.developmentTask}</p>
            </div>
          )}
        </>
      )}
      
      {/* Connector specific fields */}
      {archetype.code === 'connector' && (
        <>
          {archetype.keyTask && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Ключевая задача:</h4>
              <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.keyTask}</p>
            </div>
          )}
          
          {archetype.worldContactBasis && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Контакт с миром должен строиться на:</h4>
              <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.worldContactBasis}</p>
            </div>
          )}
        </>
      )}
      
      {/* Realization specific fields */}
      {archetype.code === 'realization' && (
        <>
          {archetype.formula && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Формула:</h4>
              <p className="text-sm bg-purple-50 p-3 rounded-md border border-purple-200">{archetype.formula}</p>
            </div>
          )}
          
          {archetype.realizationType && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Тип реализации:</h4>
              <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.realizationType}</p>
            </div>
          )}
        </>
      )}
      
      {/* Generator specific fields */}
      {archetype.code === 'generator' && (
        <>
          {archetype.generatorFormula && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Формула:</h4>
              <p className="text-sm bg-purple-50 p-3 rounded-md border border-purple-200">{archetype.generatorFormula}</p>
            </div>
          )}
          
          {archetype.generatorRecommendation && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Рекомендация:</h4>
              <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.generatorRecommendation}</p>
            </div>
          )}
        </>
      )}
      
      {/* Mission specific fields */}
      {archetype.code === 'mission' && (
        <>
          {archetype.missionEssence && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Суть миссии:</h4>
              <p className="text-sm bg-purple-50 p-3 rounded-md border border-purple-200">{archetype.missionEssence}</p>
            </div>
          )}
          
          {archetype.mainTransformation && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Главная трансформация:</h4>
              <p className="text-sm bg-blue-50 p-3 rounded-md border border-blue-200">{archetype.mainTransformation}</p>
            </div>
          )}
          
          {archetype.missionChallenges && (
            <div className="space-y-1">
              <h4 className="text-md font-semibold">Испытания миссии:</h4>
              <p className="text-sm bg-yellow-50 p-3 rounded-md border border-yellow-200">{archetype.missionChallenges}</p>
            </div>
          )}
        </>
      )}
      
      {/* Common fields - split into columns for better layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Left column - positive aspects */}
        <div className="space-y-4">
          {archetype.resourceQualities && archetype.resourceQualities.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Ресурсные качества:</h4>
              <ul className="space-y-2">
                {archetype.resourceQualities.map((quality, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                    <span>{quality}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Other positive aspects - similarly structured */}
          {archetype.workingAspects && archetype.workingAspects.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Что работает (в ресурсе):</h4>
              <ul className="space-y-2">
                {archetype.workingAspects.map((aspect, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                    <span>{aspect}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {archetype.potentialRealizationWays && archetype.potentialRealizationWays.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Как реализуется потенциал:</h4>
              <ul className="space-y-2">
                {archetype.potentialRealizationWays.map((way, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                    <span>{way}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {archetype.successSources && archetype.successSources.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Источники успеха:</h4>
              <ul className="space-y-2">
                {archetype.successSources.map((source, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {archetype.energySources && archetype.energySources.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Что дает энергию:</h4>
              <ul className="space-y-2">
                {archetype.energySources.map((source, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {archetype.flowSigns && archetype.flowSigns.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Признаки, что человек в потоке:</h4>
              <ul className="space-y-2">
                {archetype.flowSigns.map((sign, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {archetype.missionRealizationFactors && archetype.missionRealizationFactors.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Что реализует миссию:</h4>
              <ul className="space-y-2">
                {archetype.missionRealizationFactors.map((factor, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Right column - challenges and issues */}
        <div className="space-y-4">
          {archetype.keyDistortions && archetype.keyDistortions.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Ключевые искажения:</h4>
              <ul className="space-y-2">
                {archetype.keyDistortions.map((distortion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                    <span>{distortion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Other negative aspects - similarly structured */}
          {archetype.nonWorkingAspects && archetype.nonWorkingAspects.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Что не работает (искажения):</h4>
              <ul className="space-y-2">
                {archetype.nonWorkingAspects.map((aspect, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                    <span>{aspect}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {archetype.realizationObstacles && archetype.realizationObstacles.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Искажения (что мешает реализовываться):</h4>
              <ul className="space-y-2">
                {archetype.realizationObstacles.map((obstacle, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                    <span>{obstacle}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {archetype.energyDrains && archetype.energyDrains.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Что забирает энергию:</h4>
              <ul className="space-y-2">
                {archetype.energyDrains.map((drain, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                    <span>{drain}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {archetype.burnoutSigns && archetype.burnoutSigns.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Признаки, что человек выгорел:</h4>
              <ul className="space-y-2">
                {archetype.burnoutSigns.map((sign, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {archetype.missionObstacles && archetype.missionObstacles.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2">Что мешает реализовываться:</h4>
              <ul className="space-y-2">
                {archetype.missionObstacles.map((obstacle, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 mt-1.5 mr-2"></span>
                    <span>{obstacle}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Recommendations at the bottom */}
      {archetype.recommendations && archetype.recommendations.length > 0 && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-md font-semibold mb-2">Рекомендации:</h4>
          <ul className="space-y-2">
            {archetype.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block h-5 w-5 text-blue-600 mr-2">✓</span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
