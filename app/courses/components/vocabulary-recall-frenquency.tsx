import { Course, LanguageUnit, Script } from "@/lib/course/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VocabularyRecallFrequencyProps {  
  script: Script
  course: Course
}

function countTargetOccurrences(text: string, target: string): number {
  const regex = new RegExp(target, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

export default function VocabularyRecallFrequency({ script, course }: VocabularyRecallFrequencyProps) {
  const structureVocabulary: LanguageUnit[] = JSON.parse(course.structure_vocabulary || "");
  const vocabularyRecallFrequencies = structureVocabulary[0].vocabulary.map((vocabularyPair) => {
    return {
      unit: script.lessonId,
      origin: vocabularyPair.origin,
      target: vocabularyPair.target,
      recallFrequency: countTargetOccurrences(script.text, vocabularyPair.target)
    }
  });
  
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between space-y-0">
        <CardTitle className="text-2xl font-bold">Vocabulary Recall Frequency</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        <Table>
          <TableHeader className="bg-[#F8FAFC] h-14">
            <TableRow>
              <TableHead>Lesson</TableHead>
              <TableHead>{course.origin.toUpperCase()}</TableHead>
              <TableHead>{course.target.toUpperCase()}</TableHead>
              <TableHead>Recall frequency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="border-b-[1px] border-[#E2E8F0]">
            {vocabularyRecallFrequencies.map((vocabularyRecallFrequency) => (
              <TableRow key={vocabularyRecallFrequency.unit}>
                <TableCell>{vocabularyRecallFrequency.unit}</TableCell>
                <TableCell>{vocabularyRecallFrequency.origin}</TableCell>
                <TableCell>{vocabularyRecallFrequency.target}</TableCell>
                <TableCell>{vocabularyRecallFrequency.recallFrequency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}