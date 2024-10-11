'use server'

import { Schema } from "@/amplify/data/resource";
import { cookieBasedClient as client } from "@/lib/server";

// const mockCourse = {
//   id: "1",
//   origin: "English",
//   target: "Chinese",
//   prompt: "mock prompt",
//   description: "mock description",
//   structure_vocabulary: JSON.stringify(
//     [
//       {
//         unit: 1,
//         vocabulary: [{ origin: "Hello", target: "你好" }],
//         structure: [{ origin: "Hello World", target: "你好世界" }]
//       },
//       {
//         unit: 2,
//         vocabulary: [{ origin: "Hello", target: "你好" }],
//         structure: [{ origin: "Hello World", target: "你好世界" }]
//       },
//       {
//         unit: 3,
//         vocabulary: [{ origin: "Hello", target: "你好" }],
//         structure: [{ origin: "Hello World", target: "你好世界" }]
//       },
//       {
//         unit: 4,
//         vocabulary: [{ origin: "Hello", target: "你好" }],
//         structure: [{ origin: "Hello World", target: "你好世界" }]
//       },
//       {
//         unit: 5,
//         vocabulary: [{ origin: "Hello", target: "你好" }],
//         structure: [{ origin: "Hello World", target: "你好世界" }]
//       },
//       {
//         unit: 6,
//         vocabulary: [{ origin: "Hello", target: "你好" }],
//         structure: [{ origin: "Hello World", target: "你好世界" }]
//       },
//       {
//         unit: 7,
//         vocabulary: [{ origin: "Hello", target: "你好" }],
//         structure: [{ origin: "Hello World", target: "你好世界" }]
//       },
//       {
//         unit: 8,
//         vocabulary: [{ origin: "Hello", target: "你好" }],
//         structure: [{ origin: "Hello World", target: "你好世界" }]
//       },
//       {
//         unit: 9,
//         vocabulary: [{ origin: "Hello", target: "你好" }],
//         structure: [{ origin: "Hello World", target: "你好世界" }]
//       },
//       {
//         unit: 10,
//         vocabulary: [{ origin: "Hello", target: "你好" }],
//         structure: [{ origin: "Hello World", target: "你好世界" }]
//       }
//     ]
//   )
// } as Schema["courses"]["type"];

export const getCourseById = async (id: string): Promise<Schema["courses"]["type"]> => {
  const course = await client.models.courses.get({ id });
  return course?.data!;
  // return Promise.resolve(mockCourse);
}

export const updateCourse = async (course: Schema["courses"]["type"]) => {
  const updatedCourse = await client.models.courses.update(course);
  return updatedCourse?.data!;
}