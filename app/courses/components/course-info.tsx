import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Course} from "@/lib/course/types";
import TitleText from "./title-text";

type CourseInfoItem = {
  label: string;
  value: string;
};

export default function CourseInfo({ course }: { course: Course }) {
  const courseInfoItems = (course: Course): CourseInfoItem[] => [
    { label: "Origin Language", value: course.origin },
    { label: "Target Language", value: course.target },
    { label: "Description", value: course.description || "" },
    { label: "Prompt", value: course.prompt || "" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <TitleText title="Course Information" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          {courseInfoItems(course).map((item, index) => (
            <div key={index}>
              <dt className="font-medium">{item.label}</dt>
              <dd className="text-[#71717A] font-normal">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
