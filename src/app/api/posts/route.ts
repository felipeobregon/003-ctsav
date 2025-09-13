import Airtable from 'airtable';
import { NextResponse } from 'next/server';
import { Post } from '@/types/Post';

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

    const tableName = process.env.AIRTABLE_POSTS_TABLE_NAME || 'Posts';
    
    // Fetch records from Airtable
    const records = await base(tableName)
      .select({
        maxRecords: 100, // Adjust as needed
        view: 'Grid view', // You can specify a different view if needed
        sort: [{ field: 'Published At', direction: 'desc' }], // Sort by most recent first
      })
      .all();

    console.log(`Found ${records.length} posts from Airtable`);

    // Transform Airtable records to our Post format
    const posts: Post[] = records.map((record) => {
      // Handle engagement data
      let engagement;
      try {
        const likes = record.get('Likes') as number || 0;
        const comments = record.get('Comments') as number || 0;
        const shares = record.get('Shares') as number || 0;
        
        if (likes > 0 || comments > 0 || shares > 0) {
          engagement = { likes, comments, shares };
        }
      } catch (error) {
        console.warn('Error parsing engagement data for post', record.id, ':', error);
      }

      // Handle tags
      let tags;
      try {
        const tagsField = record.get('Tags');
        if (tagsField && typeof tagsField === 'string') {
          tags = tagsField.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
      } catch (error) {
        console.warn('Error parsing tags for post', record.id, ':', error);
      }

      return {
        id: record.id,
        title: record.get('Title') as string || '',
        content: record.get('Content') as string || '',
        author: record.get('Author') as string || '',
        publishedAt: record.get('Published At') 
          ? new Date(record.get('Published At') as string).toISOString()
          : new Date().toISOString(),
        linkedinUrl: record.get('LinkedIn URL') as string || undefined,
        engagement,
        tags,
        leadId: record.get('Lead ID') as string || undefined,
      };
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts from Airtable:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch posts from Airtable',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
