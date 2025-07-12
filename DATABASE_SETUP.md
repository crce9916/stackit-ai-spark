
# StackIt Database Setup Guide

This guide will help you set up the complete database schema for the StackIt Q&A platform.

## Prerequisites

1. **Supabase Project**: Make sure you have a Supabase project created
2. **Database Access**: You need access to your Supabase SQL Editor
3. **API Keys**: Have your Supabase URL and anon key ready

## Step 1: Update Supabase Configuration

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy your Project URL and anon public key
4. Replace the placeholder in `src/lib/supabase.ts` with your actual anon key

## Step 2: Run the Database Schema

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy the entire content from `supabase-setup.sql`
4. Paste it into the SQL Editor and run it

**Alternative Method using Node.js:**

1. Install Node.js dependencies:
```bash
npm install @supabase/supabase-js
```

2. Get your Service Role Key from Supabase Settings > API
3. Update `setup-database.js` with your service role key
4. Run the setup script:
```bash
node setup-database.js
```

## Step 3: Database Schema Overview

The schema includes the following tables:

### Core Tables:
- **profiles**: Extended user profiles with reputation, badges, etc.
- **questions**: All questions with metadata, tags, votes, etc.
- **answers**: All answers with voting and acceptance status
- **votes**: User votes on questions and answers
- **comments**: Comments on questions and answers
- **tags**: Available tags with usage statistics

### Feature Tables:
- **notifications**: Real-time notifications system
- **bookmarks**: User bookmarks for questions/answers
- **follows**: User following relationships
- **moderation_logs**: Content moderation history
- **ai_interactions**: AI assistant usage tracking

## Step 4: Enable Row Level Security (RLS)

The schema automatically enables RLS with these policies:

- **Public Read**: Questions, answers, profiles are publicly viewable
- **Authenticated Write**: Only logged-in users can create content
- **Owner Edit**: Users can only edit their own content
- **Private Data**: Notifications and bookmarks are user-specific

## Step 5: Create Test Data

After setting up the schema, you can create test users through:

1. **Supabase Auth**: Go to Authentication > Users and invite users
2. **Sign Up Flow**: Use the app's sign-up functionality
3. **Manual Creation**: Use the SQL Editor to insert test data

## Step 6: Storage Setup

The schema creates two storage buckets:

1. **avatars**: For user profile pictures
2. **question-images**: For images in questions/answers

Storage policies are automatically configured for public read access.

## Step 7: Verify Setup

Check that everything is working:

1. **Tables Created**: Verify all tables exist in the Database tab
2. **RLS Policies**: Check that policies are enabled in the Authentication tab
3. **Storage Buckets**: Confirm buckets exist in the Storage tab
4. **Functions**: Verify triggers and functions are created

## Step 8: Environment Configuration

Update your application with:

```typescript
// src/lib/supabase.ts
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

## Troubleshooting

### Common Issues:

1. **Permission Errors**: Make sure you're using the service role key for setup
2. **RLS Blocking**: Check that RLS policies allow the operations you need
3. **Function Errors**: Ensure all functions and triggers are created properly
4. **Storage Issues**: Verify bucket policies are set correctly

### Error Resolution:

- **Invalid API Key**: Check your Supabase keys are correct and not expired
- **Table Not Found**: Ensure the schema script ran completely
- **Permission Denied**: Verify RLS policies match your app's needs

## Advanced Features

### Real-time Subscriptions:
The database is configured for real-time updates on:
- New questions and answers
- Vote changes
- New notifications
- User status updates

### AI Integration:
The `ai_interactions` table tracks:
- Tag suggestions
- Question improvements
- Answer generations
- Content quality analysis

### Moderation System:
The `moderation_logs` table enables:
- Content flagging
- Automated moderation
- Audit trails
- Admin actions

## Database Maintenance

### Regular Tasks:
1. **Update Statistics**: Run `ANALYZE` on large tables monthly
2. **Clean Notifications**: Archive old notifications quarterly
3. **Backup Data**: Use Supabase's backup features
4. **Monitor Performance**: Check slow queries in the dashboard

### Scaling Considerations:
- **Indexing**: Additional indexes may be needed as data grows
- **Partitioning**: Consider partitioning for very large tables
- **Caching**: Implement Redis caching for frequently accessed data
- **CDN**: Use CDN for static assets and images

## Security Notes

- **API Keys**: Never expose service role keys in client-side code
- **RLS**: Always test RLS policies thoroughly
- **Validation**: Implement client and server-side validation
- **Rate Limiting**: Consider implementing rate limiting for API calls

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the console logs in your browser
3. Check the Supabase dashboard for errors
4. Verify your database schema matches the expected structure

The database is now ready for your StackIt Q&A platform!
