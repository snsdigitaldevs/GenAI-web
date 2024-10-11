import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScriptPromptEditor() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Here is the prompt here is the prompt here is the prompt
        </p>
      </CardContent>
    </Card>
  )
}