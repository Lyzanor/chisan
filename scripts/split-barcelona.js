// Ray-casting algorithm for Point in Polygon
function insidePolygon(point, vs) {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];

        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

// Handles MultiPolygon and Polygon GeoJSON geometries
function isPointInGeometry(point, geometry) {
    if (geometry.type === 'Polygon') {
        return insidePolygon(point, geometry.coordinates[0]); // outer ring
    } else if (geometry.type === 'MultiPolygon') {
        for (let poly of geometry.coordinates) {
            if (insidePolygon(point, poly[0])) return true;
        }
    }
    return false;
}

function toCsvCol(val) {
  if (val === null || val === undefined) return '';
  let s = String(val).replace(/\r/g, '').replace(/\n/g, ' ');
  if (s.includes(',') || s.includes('"')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

async function run() {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const { parse } = await import('csv-parse/sync');
    const csvPath = path.join(__dirname, '..', 'data/csv/catalunya/barcelona.csv');
    const othersCsvPath = path.join(__dirname, '..', 'data/csv/catalunya/otros.csv');
    const indicesPath = path.join(__dirname, '..', 'audit_indices.json');
    console.log('Fetching Spain Provinces GeoJSON...');
    const geoRes = await fetch('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/spain-provinces.geojson');
    const geoJson = await geoRes.json();
    
    const bcnFeature = geoJson.features.find(f => f.properties.name === 'Barcelona');
    if (!bcnFeature) throw new Error("Could not find Barcelona in GeoJSON");
    
    console.log('Loading CSV and audit files...');
    const csvData = fs.readFileSync(csvPath, 'utf-8');
    const lineEnding = csvData.includes('\r\n') ? '\r\n' : '\n';
    const records = parse(csvData, { skip_empty_lines: true, bom: false }); // preserve raw array formats and headers
    
    const headers = records[0];
    
    const auditData = fs.existsSync(indicesPath) ? JSON.parse(fs.readFileSync(indicesPath, 'utf8')) : { duplicates: [], nonProducers: [], addressIssues: [] };
    
    // We strictly delete duplicates and nonProducers. Address issues might just lack coordinates so we will skip deleting them unless they literally have no meaning
    const toDelete = new Set([...auditData.duplicates, ...auditData.nonProducers]);
    
    const bcnRecords = [headers];
    const otherRecords = [headers];
    
    let deletedCount = 0;
    
    // Process from 1 to skip headers
    for (let i = 1; i < records.length; i++) {
        const row = records[i];
        if (row.length < 16) continue; // skip broken trailing lines
        
        // Audit deletion (note indices in audit start from 0 payload, but records array is 0-indexed including headers. 
        // Audit script iterated records[i], where i=0 was headers?
        // Wait! In audit-csv.js I did `records = parse({columns: true})` which drops the header from the array.
        // So `i=0` in `audit-csv.js` corresponds to the first data row (line 2 of the CSV).
        // Therefore `i` in audit corresponds to `i+1` here in the raw array!
        // Wait, here in `split-barcelona.js` I am doing `records[i]` where `i=1` is the first data row.
        // So `row_index_in_audit = i - 1`. Let's check `toDelete.has(i - 1)`!
        
        if (toDelete.has(i - 1)) {
            deletedCount++;
            continue;
        }

        const lat = parseFloat(row[14]);
        const lon = parseFloat(row[15]);
        
        let isBcn = false;
        if (!isNaN(lat) && !isNaN(lon)) {
            // point is [longitude, latitude] in GeoJSON notation
            isBcn = isPointInGeometry([lon, lat], bcnFeature.geometry);
        } else {
            // For those lacking valid coordinates, try looking for 'Barcelona' in address/municipio as fallback
            const addr = ((row[2] || '') + ' ' + (row[5] || '')).toLowerCase();
            if (addr.includes('barcelona') || addr.includes('080') || addr.includes('bcn')) {
               isBcn = true;
            }
        }
        
        if (isBcn) {
            bcnRecords.push(row);
        } else {
            otherRecords.push(row);
        }
    }
    
    console.log(`Deleted ${deletedCount} bad rows (Duplicates / Non-Producers).`);
    console.log(`Kept ${bcnRecords.length - 1} records IN Barcelona province.`);
    console.log(`Moved ${otherRecords.length - 1} records to OTHERS.`);
    
    const bcnCsvStr = bcnRecords.map(r => r.map(toCsvCol).join(',')).join(lineEnding) + lineEnding;
    const othCsvStr = otherRecords.map(r => r.map(toCsvCol).join(',')).join(lineEnding) + lineEnding;
    
    fs.writeFileSync(csvPath, bcnCsvStr, 'utf8');
    fs.writeFileSync(othersCsvPath, othCsvStr, 'utf8');
    
    console.log('Data splitting and purging completed.');
}

run().catch(console.error);
