"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Script } from "@/lib/course/types";
import LessonCardEditButton from "./lesson-card-edit-button";
import { Textarea } from "@/components/ui/textarea";
import { updateScriptPrompt } from "../actions";

export default function ScriptPromptEditor({ script }: { script: Script }) {
  const [editing, setEditing] = useState(false);
  const [prompt, setPrompt] = useState(script.prompt || "");
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleSummitItem = () => {
    setConfirmLoading(true);
    updateScriptPrompt(script.id, prompt).then(({ prompt }) => {
      setPrompt(prompt);
    }).finally(() => {
      setConfirmLoading(false);
      setEditing(false);
    });
  }

  const handleCancelItem = () => {
    setPrompt(script.prompt || "");
    setEditing(false);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between space-y-0">
        <CardTitle className="text-2xl font-bold">Prompt</CardTitle>
        <LessonCardEditButton 
          editing={editing} 
          confirmLoading={confirmLoading}
          setEditing={setEditing} 
          handleSummitItem={handleSummitItem} 
          handleCancelItem={handleCancelItem}
        />
      </CardHeader>
      <CardContent>
        {editing ? (
          <Textarea 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            disabled={confirmLoading}
          />
        ) : (
          <p className="text-gray-600">
            {prompt ? prompt : "There is no prompt for this script. If you want you can edit it."}
          </p>
        )}
      </CardContent>
    </Card>
  )
}