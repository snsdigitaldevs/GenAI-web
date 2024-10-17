import { LanguageUnit } from '@/lib/course/types';
import { dataClient as client } from '@/lib/server';
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = params.courseId;
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }
    const { data, errors } = await client.models.courses.get({id: courseId});

    if (errors) {
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const structureAndVocabulary = JSON.parse(data?.structure_vocabulary as string) as LanguageUnit[];

    // Prepare the data for Excel
    const excelData: any[] = [];

    structureAndVocabulary.forEach((unit) => {
      let flashCardNumber = 1;
      unit.structure.forEach((item) => {
        excelData.push({
          'Lesson Number': unit.unit,
          'Flash Card Number': `FC${flashCardNumber}`,
          'Speaker': '',
          'Native Text': item.origin,
          'Translation': item.target,
          'Transliteration': '',
          'Audio File Name': ''
        });
        flashCardNumber++;
      });
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Flash Cards');

    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const headers = new Headers();
    headers.append('Content-Disposition', 'attachment; filename="flash_cards.xlsx"');
    headers.append('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: headers,
    });
  } catch (error) {
    console.error('Error generating Excel file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}