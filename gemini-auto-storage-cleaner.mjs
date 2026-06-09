import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function cleanGeminiStorage() {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4
  ].filter(Boolean);

  if (keys.length === 0) {
    console.error("❌ No Gemini API keys found in .env.local");
    process.exit(1);
  }

  console.log(`🧹 Starting Gemini Auto Storage Cleaner for ${keys.length} API keys...`);

  for (const key of keys) {
    console.log(`\n🔍 Checking storage for API Key starting with ${key.substring(0, 8)}...`);
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      let deletedCount = 0;
      
      const filesPage = await ai.files.list(); 
      // Handle the different ways the SDK might return the files array
      let files = filesPage?.files || filesPage || [];
      if (filesPage && typeof filesPage[Symbol.asyncIterator] === 'function') {
        files = [];
        for await (const f of filesPage) {
          files.push(f);
        }
      }

      if (!files || files.length === 0) {
        console.log(`✨ Storage is already clean! No files found.`);
        continue;
      }

      console.log(`Found ${files.length} files. Commencing deletion...`);

      for (const file of files) {
        console.log(`🗑️ Deleting file: ${file.name} (Created: ${file.createTime})`);
        await ai.files.delete({ name: file.name });
        deletedCount++;
      }
      
      console.log(`✅ Successfully deleted ${deletedCount} files for this key.`);
    } catch (e) {
      console.error(`❌ Failed to clean storage for key ${key.substring(0, 8)}:`, e.message);
    }
  }
  
  console.log(`\n🎉 All Gemini API keys have been fully sanitized!`);
}

cleanGeminiStorage();
