# Airtable Integration Setup

This CRM dashboard is now configured to pull lead data from your Airtable database.

## Environment Variables Setup

Create a `.env.local` file in the project root with the following variables:

```env
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
AIRTABLE_TABLE_NAME=Leads
AIRTABLE_POSTS_TABLE_NAME=Posts
AIRTABLE_MESSAGES_TABLE_NAME=Messages
```

### How to get your Airtable credentials:

1. **API Key**: 
   - Go to https://airtable.com/create/tokens
   - Create a new personal access token
   - Copy the token and use it as `AIRTABLE_API_KEY`

2. **Base ID**: 
   - Go to your Airtable base
   - Click "Help" in the top right
   - Click "API documentation"
   - Your Base ID will be shown in the URL (starts with `app...`)

3. **Table Names**: 
   - **Leads Table**: The name of your leads table in Airtable (defaults to "Leads" if not specified)
   - **Posts Table**: The name of your posts table in Airtable (defaults to "Posts" if not specified)
   - **Messages Table**: The name of your messages table in Airtable (defaults to "Messages" if not specified)

## Required Airtable Fields

### Leads Table
Your leads table should have the following fields (case-sensitive):

- **Name** (Single line text) - Lead's full name
- **Email** (Email) - Lead's email address  
- **Company** (Single line text) - Company name (optional)
- **Owner** (Single line text) - Assigned sales person (optional)
- **Status** (Single select) - Lead status with options:
  - New
  - Contacted
  - Qualified
  - Lost
  - Customer
- **Created** (Date) - When the lead was created (optional, will use Airtable's record creation time if not provided)

### Posts Table
Your posts table should have the following fields (case-sensitive):

- **Title** (Single line text) - Post title
- **Content** (Long text) - Post content/description
- **Author** (Single line text) - Author name
- **Published At** (Date) - When the post was published
- **LinkedIn URL** (URL) - Link to the LinkedIn post (optional)
- **Likes** (Number) - Number of likes (optional)
- **Comments** (Number) - Number of comments (optional)
- **Shares** (Number) - Number of shares (optional)
- **Tags** (Single line text) - Comma-separated tags (optional)
- **Lead ID** (Single line text) - Reference to the lead who posted this (optional)

### Messages Table
Your messages table should have the following fields (case-sensitive):

- **Content** (Long text) - The message content
- **Recipient** (Single line text) - The lead ID this message is sent to
- **Created** (Date) - When the message was created (optional, will use Airtable's record creation time if not provided)

## Example Airtable Setup

1. Create a new base called "CRM Dashboard"
2. Create three tables:
   - **"Leads"** - Add the leads fields listed above
   - **"Posts"** - Add the posts fields listed above
   - **"Messages"** - Add the messages fields listed above
3. Set up your Status field as a single select with the 5 options
4. Add some sample records to all tables to test

## Testing the Integration

1. Set up your `.env.local` file with the correct credentials
2. Restart your development server: `npm run dev`
3. Visit http://localhost:3000
4. Your leads from Airtable should now appear in the table

## Troubleshooting

- **Empty table**: Check that your field names match exactly (case-sensitive)
- **API errors**: Verify your API key and Base ID are correct
- **Status not showing**: Ensure your Status field is a single select with the exact values listed above
- **Date issues**: Make sure your Created field is a Date type, or leave it empty to use record creation time
