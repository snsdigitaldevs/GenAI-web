import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MagicWandIcon } from "@radix-ui/react-icons";

export default function LessonPage({ params }: { params: { lessonId: string } }) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Lesson 1</h1>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Script</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <p className="text-xl font-semibold">You have no Script yet</p>
          <p className="text-gray-600 text-center">
            You can start generate script based on your Vocabulary,<br />
            Structures and prompt
          </p>
          <Button variant="outline">
            <MagicWandIcon className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}