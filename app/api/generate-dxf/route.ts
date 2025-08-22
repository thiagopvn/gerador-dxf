import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { DXFGenerationRequest } from '@/lib/types';

interface FontMapping {
  modelId: string;
  yearStart: number;
  yearEnd: number;
  fontFamily: string;
  fontSize: number;
  spacing: number;
  fontFileName?: string;
  modelName?: string;
  settings?: {
    fontSize?: number;
    letterSpacing?: number;
  };
}

interface PathCommand {
  type: string;
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
}

interface Glyph {
  getPath: (x: number, y: number, size: number) => { commands: PathCommand[] };
  advanceWidth?: number;
}

interface FirebaseError {
  code: string;
  message: string;
}

interface DXFWriter {
  addPolyline: (points: [number, number][]) => void;
  toDxfString: () => string;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticação e Autorização
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authorization.split('Bearer ')[1];
    
    try {
      await adminAuth.verifyIdToken(token);
    } catch (authError: unknown) {
      if ((authError as FirebaseError).code === 'auth/id-token-expired') {
        return NextResponse.json({ error: 'Authentication token expired' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    // 2. Extração de Dados
    const body: DXFGenerationRequest = await request.json();
    const { modelId, year, chassisNumber, engineNumber } = body;
    
    if (!modelId || !year || !chassisNumber || !engineNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3. Busca do Mapeamento de Fonte no Firestore
    const fontMappingsSnapshot = await adminDb
      .collection('fontMappings')
      .where('modelId', '==', modelId)
      .where('yearStart', '<=', year)
      .where('yearEnd', '>=', year)
      .limit(1)
      .get();

    let fontMapping: FontMapping | null = null;
    if (!fontMappingsSnapshot.empty) {
      fontMapping = fontMappingsSnapshot.docs[0].data() as FontMapping;
    }

    // 4. Tentar carregar e usar fontes vetorizadas (dentro do try-catch)
    let dxfContent: string;
    
    try {
      // Importações dinâmicas para evitar problemas no build
      const DxfWriter = (await import('dxf-writer')).default;
      const opentype = await import('opentype.js');
      const path = await import('path');
      const fs = await import('fs');
      
      if (fontMapping && fontMapping.fontFileName) {
        // Leitura de arquivo APENAS dentro da função handler
        const fontPath = path.join(process.cwd(), 'public/fonts', fontMapping.fontFileName);
        
        if (fs.existsSync(fontPath)) {
          const fontBuffer = fs.readFileSync(fontPath);
          const font = opentype.parse(fontBuffer.buffer);
          
          // Geração do DXF vetorizado
          const dxf = new DxfWriter();
          
          // Configurações de fonte
          const fontSize = fontMapping.settings?.fontSize || 12;
          const letterSpacing = fontMapping.settings?.letterSpacing || 1.2;
          
          // Adicionar textos vetorizados
          const addVectorizedText = (text: string, x: number, y: number, size: number) => {
            const glyphs = font.stringToGlyphs(text);
            let currentX = x;
            
            glyphs.forEach((glyph: Glyph) => {
              const path = glyph.getPath(currentX, y, size);
              const commands = path.commands;
              
              let points: [number, number][] = [];
              commands.forEach((cmd: PathCommand) => {
                if (cmd.type === 'M' || cmd.type === 'L') {
                  points.push([cmd.x || 0, cmd.y || 0]);
                } else if (cmd.type === 'Q') {
                  // Aproximar curva quadrática com linhas
                  for (let t = 0; t <= 1; t += 0.1) {
                    const x = (1 - t) * (1 - t) * (points[points.length - 1]?.[0] || cmd.x || 0) +
                              2 * (1 - t) * t * (cmd.x1 || 0) +
                              t * t * (cmd.x || 0);
                    const y = (1 - t) * (1 - t) * (points[points.length - 1]?.[1] || cmd.y || 0) +
                              2 * (1 - t) * t * (cmd.y1 || 0) +
                              t * t * (cmd.y || 0);
                    points.push([x, y]);
                  }
                } else if (cmd.type === 'Z' && points.length > 1) {
                  (dxf as unknown as DXFWriter).addPolyline(points);
                  points = [];
                }
              });
              
              if (points.length > 1) {
                (dxf as unknown as DXFWriter).addPolyline(points);
              }
              
              currentX += (glyph.advanceWidth || 500) * size / 1000 * letterSpacing;
            });
          };
          
          // Adicionar textos ao DXF
          addVectorizedText(`CHASSI: ${chassisNumber}`, 10, 20, fontSize);
          addVectorizedText(`MOTOR: ${engineNumber}`, 10, 10, fontSize);
          addVectorizedText(`Modelo: ${fontMapping.modelName || modelId} (${year})`, 10, 0, fontSize * 0.8);
          addVectorizedText(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 10, -10, fontSize * 0.6);
          
          dxfContent = dxf.toDxfString();
        } else {
          throw new Error('Font file not found');
        }
      } else {
        throw new Error('No font mapping found');
      }
    } catch (dxfError) {
      // Fallback: DXF simples sem vetorização
      console.log('Falling back to simple DXF generation:', dxfError);
      
      dxfContent = `0
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
0
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
20.0
30
0.0
40
5.0
1
CHASSI: ${chassisNumber}
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
10.0
30
0.0
40
5.0
1
MOTOR: ${engineNumber}
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
0.0
30
0.0
40
3.0
1
Modelo: ${modelId} (${year})
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
-10.0
30
0.0
40
3.0
1
Gerado em: ${new Date().toLocaleString('pt-BR')}
0
ENDSEC
0
EOF
`;
    }

    // 5. Resposta
    return new NextResponse(dxfContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/dxf',
        'Content-Disposition': `attachment; filename="chassi_${chassisNumber}.dxf"`,
      },
    });

  } catch (error: unknown) {
    console.error('Error generating DXF:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}