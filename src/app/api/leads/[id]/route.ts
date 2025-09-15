import Airtable from 'airtable';
import { NextResponse } from 'next/server';
import { Lead } from '@/components/LeadsTable';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('=== DEBUG: /api/leads/[id] GET request received ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VERCEL_URL:', process.env.VERCEL_URL);
  console.log('VERCEL_REGION:', process.env.VERCEL_REGION);
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
  console.log('AIRTABLE_API_KEY exists:', !!process.env.AIRTABLE_API_KEY);
  console.log('AIRTABLE_BASE_ID exists:', !!process.env.AIRTABLE_BASE_ID);
  
  try {
    // Check if environment variables are set
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      console.error('❌ Missing Airtable environment variables');
      console.error('AIRTABLE_API_KEY:', process.env.AIRTABLE_API_KEY ? 'SET' : 'NOT SET');
      console.error('AIRTABLE_BASE_ID:', process.env.AIRTABLE_BASE_ID ? 'SET' : 'NOT SET');
      return NextResponse.json(
        { error: 'Airtable configuration missing. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.' },
        { status: 500 }
      );
    }

    // Extract just the base ID (remove table and view IDs if present)
    const fullBaseId = process.env.AIRTABLE_BASE_ID;
    const baseId = fullBaseId.split('/')[0]; // Take only the first part before the first slash
    console.log('Full Base ID:', fullBaseId);
    console.log('Extracted Base ID:', baseId);

    // Initialize Airtable with environment variables
    console.log('Initializing Airtable connection...');
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(baseId);

    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Leads';
    console.log('Table name:', tableName);
    
    // Await params to get the id
    const { id } = await params;
    console.log('Looking for lead with ID:', id);
    
    // First, find the record by custom ID field
    console.log('Searching for lead in Airtable...');
    const records = await base(tableName)
      .select({
        filterByFormula: `{ID} = "${id}"`,
        maxRecords: 1,
      })
      .all();

    console.log(`Found ${records.length} records for ID: ${id}`);
    
    if (records.length === 0) {
      console.log('❌ No lead found with ID:', id);
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const record = records[0];
    console.log('✅ Found lead record:', record.fields);

    // Transform Airtable record to our Lead format
    console.log('Transforming record to Lead format...');
    const lead: Lead = {
      id: record.id,
      customId: record.get('ID') as string || record.id, // Use custom ID or fallback to record ID
      name: record.get('Name') as string || '',
      email: record.get('Email') as string || '',
      company: record.get('Company') as string || undefined,
      owner: record.get('Owner') as string || undefined,
      linkedin: record.get('LinkedIn') as string || undefined,
      status: (record.get('Status') as string || 'New') as Lead['status'],
      createdAt: record.get('Created') 
        ? new Date(record.get('Created') as string).toISOString()
        : new Date().toISOString(),
    };

    console.log('✅ Successfully transformed lead:', lead);
    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error fetching lead from Airtable:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch lead from Airtable',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
