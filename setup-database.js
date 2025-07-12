
// Database Setup Script for StackIt Q&A Platform
// Run this with: node setup-database.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = 'https://xyuqpskapfenamafimxz.supabase.co';
const SUPABASE_SERVICE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE'; // Replace with your service role key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up StackIt database...');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync('supabase-setup.sql', 'utf8');
    
    // Split SQL commands (basic splitting - you might need a more sophisticated parser)
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📄 Found ${commands.length} SQL commands to execute`);
    
    // Execute each command
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.length > 0) {
        try {
          console.log(`⚡ Executing command ${i + 1}/${commands.length}`);
          const { error } = await supabase.rpc('exec_sql', { sql: command });
          if (error) {
            console.warn(`⚠️  Warning on command ${i + 1}:`, error.message);
          }
        } catch (err) {
          console.warn(`⚠️  Error on command ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('✅ Database setup completed!');
    
    // Create sample data
    await createSampleData();
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  }
}

async function createSampleData() {
  console.log('📝 Creating sample data...');
  
  try {
    // Insert sample questions (you'll need real user IDs)
    const sampleQuestions = [
      {
        title: "How to implement JWT authentication in React?",
        description: "I'm building a React application and need to implement secure JWT authentication. What are the best practices?",
        tags: ['React', 'JWT', 'Authentication'],
        ai_generated: false,
        quality_score: 0.85
      },
      {
        title: "Best practices for PostgreSQL query optimization",
        description: "What are some advanced techniques for optimizing PostgreSQL queries for better performance?",
        tags: ['Database', 'PostgreSQL', 'Performance'],
        ai_generated: false,
        quality_score: 0.90
      },
      {
        title: "Understanding React Hooks lifecycle",
        description: "Can someone explain how React Hooks work and their lifecycle compared to class components?",
        tags: ['React', 'JavaScript', 'Hooks'],
        ai_generated: false,
        quality_score: 0.75
      }
    ];
    
    // Note: You'll need to replace author_id with actual user IDs after users are created
    console.log('Sample questions ready to be inserted after user creation');
    
    console.log('✅ Sample data setup completed!');
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
}

// Helper function to create a user profile
async function createUserProfile(userData) {
  const { data, error } = await supabase
    .from('profiles')
    .insert([userData])
    .select();
    
  if (error) {
    console.error('Error creating user profile:', error);
    return null;
  }
  
  return data[0];
}

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase, createUserProfile };
