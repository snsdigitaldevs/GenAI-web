import { Course, LanguageUnit, Script } from "@/lib/course/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import random from "lodash/random";
import upperFirst from "lodash/upperFirst";

interface VocabularyRecallFrequencyProps {  
  script: Script;
  course: Course;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function countTargetOccurrences(text: string, target: string): number {
  const regex = new RegExp(target, 'gi');
  const matches = text?.match(regex);
  return matches ? matches.length : 0;
}

export default function VocabularyRecallFrequency({ script, course }: VocabularyRecallFrequencyProps) {
  const historyLanguageUnits: LanguageUnit[] = JSON.parse(course.structure_vocabulary || "")
    .sort((a: LanguageUnit, b: LanguageUnit) => a.unit - b.unit)
    .filter(({ unit }: LanguageUnit) => unit <= script.lessonId);
  
  const historyUnitVocabularyRecallFrequencyList = historyLanguageUnits.map((historyLanguageUnit) => ({
    lesson: "Lesson " + historyLanguageUnit.unit,
    vocabularyRecallFrequency: historyLanguageUnit.vocabulary.map((vocabularyPair) => ({
      unit: historyLanguageUnit.unit,
      origin: vocabularyPair.origin,
      target: vocabularyPair.target,
      recallFrequency: countTargetOccurrences(script.text, escapeRegExp(vocabularyPair.target))
    }))
  }));
  
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between space-y-0">
        <CardTitle className="text-2xl font-bold">Vocabulary Recall Frequency</CardTitle>
      </CardHeader>
      <CardContent>
        {script.text ? (
          <Tabs 
            defaultValue={historyUnitVocabularyRecallFrequencyList[historyUnitVocabularyRecallFrequencyList.length - 1].lesson} 
            className="w-full"
          >
            {historyUnitVocabularyRecallFrequencyList.length > 1 && (
              <TabsList>
                {historyUnitVocabularyRecallFrequencyList.map((historyUnitVocabularyRecallFrequency) => (
                  <TabsTrigger 
                    value={historyUnitVocabularyRecallFrequency.lesson} 
                    key={`tab-${historyUnitVocabularyRecallFrequency.lesson}`}
                  >
                    {historyUnitVocabularyRecallFrequency.lesson}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
            {historyUnitVocabularyRecallFrequencyList.map((historyUnitVocabularyRecallFrequency) => (
              <TabsContent 
                value={historyUnitVocabularyRecallFrequency.lesson} 
                key={`tab-content-${historyUnitVocabularyRecallFrequency.lesson}`}
                className="max-h-[600px] overflow-y-auto"
              >
                <Table>
                  <TableHeader className="bg-[#F8FAFC] h-14">
                    <TableRow>
                      <TableHead className="w-[50px]">Lesson</TableHead>
                      <TableHead className="w-[180px]">{upperFirst(course.origin)}</TableHead>
                      <TableHead className="w-[180px]">{upperFirst(course.target)}</TableHead>
                      <TableHead className="w-[50px]">Recall frequency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="border-b-[1px] border-[#E2E8F0]">
                    {historyUnitVocabularyRecallFrequency.vocabularyRecallFrequency.map(
                      ({ unit, origin, target, recallFrequency }) => (
                      <TableRow key={`${unit}-${origin}-${target}-${random(0, 1000000)}`}>
                        <TableCell className="w-[50px]">{unit}</TableCell>
                        <TableCell className="w-[180px]">{origin}</TableCell>
                        <TableCell className="w-[180px]">{target}</TableCell>
                        <TableCell className="w-[50px]">{recallFrequency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
            <p className="text-xl font-semibold">You have no Script yet</p>
            <p className="text-gray-600 text-center">
              Please generate script first
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}