import Airtable from 'airtable';
import { NextResponse } from 'next/server';
import { Message } from '@/types/Message';

export async function GET(request: Request) {
  console.log('=== DEBUG: /api/messages GET request received ===');
  
  try {
    // Check if environment variables are set
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      console.error('❌ Missing Airtable environment variables');
      return NextResponse.json(
        { error: 'Airtable configuration missing. Please set AIRTABLE_API_KEY and AIRTABLE_BASE_ID environment variables.' },
        { status: 500 }
      );
    }

    // Extract just the base ID (remove table and view IDs if present)
    const fullBaseId = process.env.AIRTABLE_BASE_ID;
    const baseId = fullBaseId.split('/')[0];
    console.log('Full Base ID:', fullBaseId);
    console.log('Extracted Base ID:', baseId);

    // Initialize Airtable with environment variables
    console.log('Initializing Airtable connection...');
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY,
    }).base(baseId);

    const tableName = process.env.AIRTABLE_MESSAGES_TABLE_NAME || 'Messages';
    console.log('Messages table name:', tableName);
    
    // Get recipient from query parameters
    const { searchParams } = new URL(request.url);
    const recipient = searchParams.get('recipient');
    
    if (!recipient) {
      console.log('❌ No recipient specified');
      return NextResponse.json(
        { error: 'Recipient parameter is required' },
        { status: 400 }
      );
    }
    
    console.log('Looking for messages with recipient:', recipient);
    
    // Fetch messages filtered by recipient
    console.log('Fetching messages from Airtable...');
    const records = await base(tableName)
      .select({
        filterByFormula: `{Recipient} = "${recipient}"`,
        sort: [{ field: 'Created', direction: 'desc' }], // Sort by creation date, newest first
      })
      .all();

    console.log(`Found ${records.length} messages for recipient: ${recipient}`);
    
    // Transform Airtable records to our Message format
    console.log('Transforming records to Message format...');
    const messages: Message[] = records.map(record => ({
      id: record.id,
      content: record.get('Content') as string || '',
      recipient: record.get('Recipient') as string || '',
      createdAt: record.get('Created') 
        ? new Date(record.get('Created') as string).toISOString()
        : new Date().toISOString(),
    }));

    console.log('✅ Successfully transformed messages:', messages);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages from Airtable:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch messages from Airtable',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
