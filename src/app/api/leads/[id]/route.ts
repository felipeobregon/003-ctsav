import Airtable from 'airtable';
import { NextResponse } from 'next/server';
import { Lead } from '@/components/LeadsTable';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if environment variables are set
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { error: 'Airtable configuration missing. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.' },
        { status: 500 }
      );
    }

    // Extract just the base ID (remove table and view IDs if present)
    const fullBaseId = process.env.AIRTABLE_BASE_ID;
    const baseId = fullBaseId.split('/')[0]; // Take only the first part before the first slash

    // Initialize Airtable with environment variables
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(baseId);

    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Leads';
    
    // Await params to get the id
    const { id } = await params;
    
    // First, find the record by custom ID field
    const records = await base(tableName)
      .select({
        filterByFormula: `{ID} = "${id}"`,
        maxRecords: 1,
      })
      .all();

    if (records.length === 0) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const record = records[0];

    // Transform Airtable record to our Lead format
    const lead: Lead = {
      id: record.id,
      customId: record.get('ID') as string || record.id, // Use custom ID or fallback to record ID
      name: record.get('Name') as string || '',
      email: record.get('Email') as string || '',
      company: record.get('Company') as string || undefined,
      owner: record.get('Owner') as string || undefined,
      status: (record.get('Status') as string || 'New') as Lead['status'],
      createdAt: record.get('Created') 
        ? new Date(record.get('Created') as string).toISOString()
        : new Date().toISOString(),
    };

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
