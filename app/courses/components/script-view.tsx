"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Script } from "@/lib/course/types";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Loader2, Pencil, RefreshCw, ArrowLeft } from "lucide-react";
import { JSONContent } from "novel";
import TailwindAdvancedEditor from "@/components/editor/advanced-editor";

interface ScriptViewProps {
  script: Script;
  generateScript: () => Promise<void>;
  saveScriptContent: (content: string) => Promise<void>;
}

export default function ScriptView({ script, generateScript, saveScriptContent }: ScriptViewProps) {
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false);

  const generate = async () => {
    setLoading(true);
    await generateScript();
    setLoading(false);
  }

  const convertToEditorContent = (text: string): JSONContent => {
    const lines = text.split('\n');
  
    const content = lines
    .filter(line => line.trim() !== "")
    .map(line => ({
      type: "paragraph",
      content: [
        {
          type: "text",
          text: line.trim(),
        },
      ],
    }));
  
    return {
      type: "doc",
      content: content,
    } as JSONContent;
  }

  return (
    script.text ? (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Script</CardTitle>
          <div className="space-x-2">
            {!isEditing && (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {isEditing && (
              <Button size="sm" onClick={() => setIsEditing(false)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <Button size="sm" onClick={() => generate()} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Regenerate
            </Button>
          </div>
        </CardHeader>
        <CardContent className="max-h-[800px] overflow-y-auto">
          {isEditing ? (
            <TailwindAdvancedEditor defaultEditorContent={convertToEditorContent(script.text)} onSave={saveScriptContent} />
          ) : (
            <div className="whitespace-pre-wrap">{script.text}</div>
          )}
        </CardContent>
      </Card>
    ) : (
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
          <Button variant="outline" onClick={() => generate()} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MagicWandIcon className="mr-2 h-4 w-4" />}
            Generate
          </Button>
        </CardContent>
      </Card>
    )
  )
}