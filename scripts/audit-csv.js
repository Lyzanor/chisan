function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; 
}

function normalize(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function getPlaceId(url) {
    if (!url) return null;
    const match = url.match(/query_place_id=([^&]+)/);
    return match ? match[1] : null;
}

const FORBIDDEN_WORDS = [
    'cooperativa',
    'sccl',
    's.c.c.l',
    'agrobotiga',
    'distribuidor',
    'supermercat',
    'multimarca'
];

async function run() {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { parse } = await import('csv-parse/sync');
    const csvPath = path.join(__dirname, '..', 'Km0-productores.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    const records = parse(csvData, { columns: true, skip_empty_lines: true });

    const duplicateGroups = [];
    const nonProducers = [];
    const addressIssues = [];

    const processedIndices = new Set();

    // 1. Pass: Identify obvious duplicates by Place ID and Location proximity
    for (let i = 0; i < records.length; i++) {
        if (processedIndices.has(i)) continue;
        
        const r1 = records[i];
        const group = [{ index: i, record: r1, reason: '' }];
        
        const pId1 = getPlaceId(r1['Google Maps']);
        const lat1 = parseFloat(r1.lat);
        const lon1 = parseFloat(r1.lon);
        const n1 = normalize(r1.nombre);

        for (let j = i + 1; j < records.length; j++) {
            if (processedIndices.has(j)) continue;
            const r2 = records[j];
            
            let isDuplicate = false;
            let reason = '';
            
            // Same Place ID means it's the exact same business on Google Maps
            const pId2 = getPlaceId(r2['Google Maps']);
            if (pId1 && pId1 === pId2) {
                isDuplicate = true;
                reason = 'Exact same query_place_id in Google Maps link';
            } 
            else if (!isNaN(lat1) && !isNaN(lon1)) {
                const lat2 = parseFloat(r2.lat);
                const lon2 = parseFloat(r2.lon);
                if (!isNaN(lat2) && !isNaN(lon2)) {
                    const dist = calcDistance(lat1, lon1, lat2, lon2);
                    const n2 = normalize(r2.nombre);
                    // Same physical spot AND similar name
                    if (dist < 30 && (n1.includes(n2) || n2.includes(n1) || (n1.length > 5 && n1 === n2))) {
                        isDuplicate = true;
                        reason = `Distance is ${Math.round(dist)}m and names match`;
                    }
                }
            }

            if (isDuplicate) {
                group.push({ index: j, record: r2, reason });
                processedIndices.add(j);
            }
        }

        if (group.length > 1) {
            duplicateGroups.push(group);
            processedIndices.add(i);
        }
    }

    // 2. Pass: Non-Producers and Addresses for remaining records
    for (let i = 0; i < records.length; i++) {
        const r = records[i];
        
        // Keywords Check
        const textToCheck = ((r.nombre || '') + ' ' + (r.descripcion || '')).toLowerCase();
        for (let word of FORBIDDEN_WORDS) {
            if (textToCheck.includes(word)) {
                // To avoid false positives like "No es cooperativa", though rare
                // We'll mark them
                nonProducers.push({ index: i, record: r, word });
                break; // Only list once per record
            }
        }

        // Addresses Check
        if (!r.direccion || r.direccion.trim().length === 0) {
            addressIssues.push({ index: i, record: r, issue: 'Empty Address' });
        } else if (!getPlaceId(r['Google Maps'])) {
            addressIssues.push({ index: i, record: r, issue: 'Missing query_place_id in Maps URL' });
        } else if (isNaN(parseFloat(r.lat)) || isNaN(parseFloat(r.lon))) {
            addressIssues.push({ index: i, record: r, issue: 'Missing/Invalid Coordinates' });
        }
    }

    // 3. Generate Markdown Report
    const MD_PATH = '/Users/lyzanor/.gemini/antigravity/brain/25d4b66a-db4b-4a89-b471-92a8a6f3f735/audit_report.md';
    let md = '# 🕵️‍♂️ Resumen de Auditoría del CSV (`Km0-productores.csv`)\n\n';
    md += `El archivo contiene un total de **${records.length}** registros.\n\n`;

    // Duplicates Section
    const allDupDuplicates = duplicateGroups.reduce((acc, g) => acc + (g.length - 1), 0);
    md += `## 1. Duplicados Claros (${allDupDuplicates} registros extra)\n`;
    if (duplicateGroups.length === 0) md += 'No se han detectado duplicados evidentes.\n';
    duplicateGroups.slice(0, 50).forEach((group, idx) => { // limit to 50 groups to not break markdown size
        md += `\n**Grupo ${idx + 1}:**\n`;
        group.forEach(g => {
            md += `- Fila [${g.index + 2}]: **${g.record.nombre}** (${g.record.municipio}) ${g.reason ? '- Motivo: ' + g.reason : '(Principal)'}\n`;
        });
    });
    if (duplicateGroups.length > 50) md += `\n... *(${duplicateGroups.length - 50} grupos más de duplicados ocultos por longitud)*\n`;

    // Cooperatives / Distributors Section
    md += `\n## 2. No-Productores / Cooperativas (${nonProducers.length} detectados)\n`;
    if (nonProducers.length === 0) md += 'No se han detectado infractores obvios.\n';
    nonProducers.slice(0, 100).forEach(n => {
        md += `- Fila [${n.index + 2}]: **${n.record.nombre}** — *Infractor de la palabra: \`${n.word}\`* \n`;
    });
    if (nonProducers.length > 100) md += `\n... *(${nonProducers.length - 100} más ocultos por longitud)*\n`;

    // Address Issues Section
    md += `\n## 3. Direcciones/Ubicaciones Rótas o Vacías (${addressIssues.length} detectados)\n`;
    if (addressIssues.length === 0) md += 'No se han detectado problemas de ubicación.\n';
    addressIssues.slice(0, 100).forEach(a => {
        md += `- Fila [${a.index + 2}]: **${a.record.nombre}** — *Problema:* ${a.issue}\n`;
    });
    if (addressIssues.length > 100) md += `\n... *(${addressIssues.length - 100} más ocultos por longitud)*\n`;

    md += `\n\n## 📝 Recomendación\n`;
    md += `Podemos eliminar de forma automática **${allDupDuplicates} duplicados** (manteniendo 1 por grupo), los **${nonProducers.length} cooperativas/multimarcas** y reparar/borrar los **${addressIssues.length} con problemas de ubicación**. ¿Quieres proceder con estas eliminaciones?`;

    fs.writeFileSync(MD_PATH, md, 'utf8');

    // Also write a JSON mapping of row indices to delete so the next script can just read it.
    fs.writeFileSync(path.join(__dirname, '..', 'audit_indices.json'), JSON.stringify({
       duplicates: duplicateGroups.map(g => g.slice(1).map(item => item.index)).flat(),
       nonProducers: nonProducers.map(n => n.index),
       addressIssues: addressIssues.map(a => a.index)
    }));

    console.log('Auditoría completada exitosamente.');
}

run().catch(console.error);
