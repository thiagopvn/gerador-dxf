import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { DXFGenerationRequest } from '@/lib/types';
import { fontMappings } from '@/data/fontMappings';
import fs from 'fs';
import path from 'path';
import opentype from 'opentype.js';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    if (!decodedToken) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const body: DXFGenerationRequest = await request.json();
    const { modelId, year, chassisNumber, engineNumber } = body;

    if (!modelId || !year || !chassisNumber || !engineNumber) {
      return NextResponse.json({ error: 'Parâmetros obrigatórios: modelId, year, chassisNumber, engineNumber' }, { status: 400 });
    }

    const fontMapping = fontMappings.find(
      mapping => mapping.modelId === modelId && year >= mapping.yearStart && year <= mapping.yearEnd
    );

    if (!fontMapping) {
      return NextResponse.json({ error: 'Mapeamento de fonte não encontrado para este modelo e ano' }, { status: 404 });
    }

    const fontPath = path.join(process.cwd(), 'public', 'fonts', fontMapping.fontFileName);
    
    if (!fs.existsSync(fontPath)) {
      return NextResponse.json({ error: 'Arquivo de fonte não encontrado' }, { status: 404 });
    }

    const fontBuffer = fs.readFileSync(fontPath);
    const font = opentype.parse(fontBuffer.buffer);

    // Create a simple DXF content instead of using DxfWriter
    let dxfContent = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1015
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
5
2
100
AcDbSymbolTable
70
0
0
LAYER
5
10
100
AcDbSymbolTableRecord
100
AcDbLayerTableRecord
2
0
70
0
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
`;

    const chassisText = `CHASSI: ${chassisNumber}`;
    const engineText = `MOTOR: ${engineNumber}`;

    // Add simple text entities to DXF
    dxfContent += `0
TEXT
5
100
100
AcDbEntity
8
0
100
AcDbText
10
10.0
20
10.0
30
0.0
40
5.0
1
${chassisText}
0
TEXT
5
101
100
AcDbEntity
8
0
100
AcDbText
10
10.0
20
0.0
30
0.0
40
5.0
1
${engineText}
0
TEXT
5
102
100
AcDbEntity
8
0
100
AcDbText
10
10.0
20
-10.0
30
0.0
40
3.0
1
Gerado em: ${new Date().toLocaleString('pt-BR')}
0
TEXT
5
103
100
AcDbEntity
8
0
100
AcDbText
10
10.0
20
-15.0
30
0.0
40
3.0
1
Modelo: ${fontMapping.modelName} (${year})
0
ENDSEC
0
EOF
`;

    return new NextResponse(dxfContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/dxf',
        'Content-Disposition': 'attachment; filename="remarcacao-chassi.dxf"',
      },
    });

  } catch (error: any) {
    console.error('Error generating DXF:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}