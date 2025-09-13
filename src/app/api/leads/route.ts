import Airtable from 'airtable';
import { NextResponse } from 'next/server';
import { Lead } from '@/components/LeadsTable';

export async function GET() {
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
    
    // Fetch records from Airtable
    const records = await base(tableName)
      .select({
        maxRecords: 100, // Adjust as needed
        view: 'Grid view', // You can specify a different view if needed
      })
      .all();

    console.log('Sample record fields:', records[0]?.fields);

    // Transform Airtable records to our Lead format
    const leads: Lead[] = records.map((record) => ({
      id: record.id,
      name: record.get('Name') as string || '',
      email: record.get('Email') as string || '',
      company: record.get('Company') as string || undefined,
      owner: record.get('Owner') as string || undefined,
      linkedin: record.get('LinkedIn') as string || undefined,
      status: (record.get('Status') as string || 'New') as Lead['status'],
      createdAt: record.get('Created') 
        ? new Date(record.get('Created') as string).toISOString()
        : new Date().toISOString(),
    }));

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads from Airtable:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch leads from Airtable',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
