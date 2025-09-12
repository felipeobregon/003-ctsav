# Airtable Integration Setup

This CRM dashboard is now configured to pull lead data from your Airtable database.

## Environment Variables Setup

Create a `.env.local` file in the project root with the following variables:

```env
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=your_airtable_base_id_here
AIRTABLE_TABLE_NAME=Leads
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

3. **Table Name**: 
   - The name of your table in Airtable (defaults to "Leads" if not specified)

## Required Airtable Fields

Your Airtable table should have the following fields (case-sensitive):

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

## Example Airtable Setup

1. Create a new base called "CRM Leads"
2. Create a table called "Leads" 
3. Add the fields listed above
4. Set up your Status field as a single select with the 5 options
5. Add some sample records to test

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
