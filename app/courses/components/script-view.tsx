import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Script } from "@/lib/course/types";
import { MagicWandIcon } from "@radix-ui/react-icons";

export default function ScriptView({ script }: { script: Script}) {
  return (
    script.text ? (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Script</CardTitle>
        </CardHeader>
        <CardContent>
          {script.text}
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
          <Button variant="outline">
            <MagicWandIcon className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </CardContent>
      </Card>
    )
  )
}