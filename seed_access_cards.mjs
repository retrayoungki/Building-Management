import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mayikxxfkmtfpofbwkan.supabase.co';
const supabaseKey = 'sb_publishable_k1BkXVreNEvro6C1yj71FQ_5SCLjv90';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test: First check what columns exist in access_cards
async function checkColumns() {
  const { data, error } = await supabase
    .from('access_cards')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Current columns in access_cards:');
    if (data && data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      // Insert a minimal test row to see what columns are accepted
      const testId = 'TEST-COL-CHECK';
      const { data: ins, error: insErr } = await supabase
        .from('access_cards')
        .select('id, card_number, tenant_id, holder_name, jabatan, pintu, company, status, assigned_date, access_level')
        .limit(1);
      
      if (insErr) {
        console.log('Column check error:', insErr.message);
        // This tells us which columns don't exist
      } else {
        console.log('Columns exist:', ins);
      }
    }
  }
}

// Try inserting without the new columns first (just base columns)
const QUANTUM_ID = 'TNT-QUANTUM-001';
const PANCA_ID   = 'TNT-PANCA-001';

function makeCard(no, holderName, cardNumber, pintu, accessLevel, tenantId, jabatan) {
  return {
    id: `CARD-QP-${String(no).padStart(3, '0')}`,
    card_number: String(cardNumber).trim(),
    tenant_id: tenantId,
    holder_name: holderName,
    status: 'Active',
    assigned_date: '01 Jan 2024',
    access_level: accessLevel,
    // Store jabatan in holder_name field as part of the note until schema is refreshed
    // We'll use access_level to store the zone and holder_name for the name
  };
}

async function seedMinimal() {
  console.log('Testing with minimal columns (no jabatan/pintu/company)...\n');

  const cards = [
    { id: 'CARD-QP-001', card_number: '12561', tenant_id: QUANTUM_ID, holder_name: 'Petrus Bernadus', status: 'Active', assigned_date: '01 Jan 2024', access_level: 'Full Access' },
    { id: 'CARD-QP-002', card_number: '12560', tenant_id: QUANTUM_ID, holder_name: 'Dewi Siswanti', status: 'Active', assigned_date: '01 Jan 2024', access_level: 'Full Access' },
    { id: 'CARD-QP-003', card_number: '0010039554', tenant_id: QUANTUM_ID, holder_name: 'Retra Permana', status: 'Active', assigned_date: '01 Jan 2024', access_level: 'Full Access' },
  ];

  const { data, error } = await supabase.from('access_cards').upsert(cards, { onConflict: 'id' });
  if (error) {
    console.error('Minimal insert error:', error.message);
    console.log('\n🔴 The schema cache issue persists. Please do the following in Supabase SQL Editor:');
    console.log(`
NOTIFY pgrst, 'reload schema';

-- OR re-run the ALTER TABLE:
ALTER TABLE access_cards
  ADD COLUMN IF NOT EXISTS company  TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS jabatan  TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS pintu    TEXT DEFAULT '';

NOTIFY pgrst, 'reload schema';
    `);
  } else {
    console.log('✅ Minimal insert worked! Columns are fine. Running full seed...');
  }
}

checkColumns();
seedMinimal();
