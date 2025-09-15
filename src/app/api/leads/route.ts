import Airtable from 'airtable';
import { NextResponse } from 'next/server';
import { Lead } from '@/components/LeadsTable';

export async function GET() {
  console.log('=== DEBUG: /api/leads GET request received ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VERCEL_URL:', process.env.VERCEL_URL);
  console.log('VERCEL_REGION:', process.env.VERCEL_REGION);
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
  console.log('AIRTABLE_API_KEY exists:', !!process.env.AIRTABLE_API_KEY);
  console.log('AIRTABLE_BASE_ID exists:', !!process.env.AIRTABLE_BASE_ID);
  console.log('AIRTABLE_TABLE_NAME:', process.env.AIRTABLE_TABLE_NAME);
  
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
    
    // Fetch records from Airtable
    console.log('Fetching records from Airtable...');
    const records = await base(tableName)
      .select({
        maxRecords: 100, // Adjust as needed
        view: 'Grid view', // You can specify a different view if needed
      })
      .all();

    console.log('✅ Successfully fetched', records.length, 'records from Airtable');
    console.log('Sample record fields:', records[0]?.fields);

    // Transform Airtable records to our Lead format
    console.log('Transforming records to Lead format...');
    const leads: Lead[] = records.map((record) => ({
      id: record.id,
      customId: record.get('ID') as string || record.id, // Use custom ID or fallback to record ID
      name: record.get('Name') as string || '',
      email: record.get('Email') as string || '',
      company: record.get('Company') as string || undefined,
      owner: record.get('Owner') as string || undefined,
      linkedin: record.get('LinkedIn') as string || undefined,
      profilePic: record.get('Profile Pic') as string || undefined,
      status: (record.get('Status') as string || 'New') as Lead['status'],
      createdAt: record.get('Created') 
        ? new Date(record.get('Created') as string).toISOString()
        : new Date().toISOString(),
    }));

    console.log('✅ Successfully transformed', leads.length, 'leads');
    console.log('Sample transformed lead:', leads[0]);
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
