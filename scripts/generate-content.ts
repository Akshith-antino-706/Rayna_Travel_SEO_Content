/**
 * Content Generation Pipeline
 *
 * Usage: npx tsx scripts/generate-content.ts --city "Dubai" --topic "complete-travel-guide"
 *   or:  npx tsx scripts/generate-content.ts --city "Dubai" --all
 *
 * This script generates Markdown blog articles using AI (plug in your preferred API).
 * Each article follows the topic templates and includes proper frontmatter.
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================
// TOPIC TEMPLATES — All 100 topics from the travel guide doc
// ============================================================

interface TopicTemplate {
  id: string;
  title: string;       // [City Name] is replaced dynamically
  category: string;
  readingTime: number;
  sections: string[];   // Prompt sections for AI generation
}

const TOPICS: TopicTemplate[] = [
  // Essentials
  { id: 'complete-travel-guide', title: 'Complete [City] Travel Guide for First-Time Visitors: Tips, Weather & What to Know', category: 'Essentials', readingTime: 10, sections: ['overview', 'best-time-to-visit', 'weather', 'getting-around', 'top-areas', 'cultural-tips', 'practical-tips', 'costs'] },
  { id: 'budget-vs-luxury-guide', title: 'Is [City] Expensive? Budget vs Luxury Travel Guide', category: 'Essentials', readingTime: 8, sections: ['cost-overview', 'budget-breakdown', 'save-vs-splurge', 'money-saving-tips'] },
  { id: 'safety-guide', title: 'Staying Safe & Respecting Local Rules in [City]: Laws, Etiquette & Tourist Safety Guide', category: 'Essentials', readingTime: 7, sections: ['safety-overview', 'key-laws', 'cultural-etiquette', 'practical-safety', 'emergency-contacts'] },
  { id: 'dress-code', title: '[City] Dress Code: What Tourists Should Wear', category: 'Essentials', readingTime: 5, sections: ['general-guidelines', 'by-location', 'seasonal', 'shopping-tips'] },
  { id: 'currency-guide', title: 'Currency, Currency Exchange, Payments & Money Tips for Tourists', category: 'Essentials', readingTime: 6, sections: ['currency-basics', 'exchange-options', 'card-payments', 'atm-tips', 'tipping'] },

  // Things to Do
  { id: 'top-things-to-do', title: 'Top Things to Do in [City] for Tourists', category: 'Things to Do', readingTime: 12, sections: ['iconic-experiences', 'waterfront', 'cultural', 'modern', 'free-activities'] },
  { id: 'free-things-to-do', title: 'Free Things to Do in [City] (Budget-Friendly Guide)', category: 'Things to Do', readingTime: 8, sections: ['free-attractions', 'free-beaches', 'free-events', 'free-walks'] },
  { id: 'luxury-experiences', title: 'Unique & Luxury Experiences to Try in [City]', category: 'Things to Do', readingTime: 8, sections: ['luxury-dining', 'exclusive-tours', 'premium-stays', 'vip-experiences'] },
  { id: 'adventure-activities', title: 'Best Adventure Activities in [City] for Thrill Seekers', category: 'Things to Do', readingTime: 8, sections: ['water-sports', 'aerial', 'land-based', 'booking-tips'] },
  { id: 'nightlife-guide', title: 'Things to Do in [City] at Night', category: 'Things to Do', readingTime: 7, sections: ['nightclubs', 'bars', 'night-tours', 'evening-attractions'] },
  { id: 'couples-guide', title: 'Romantic Things to Do in [City] for Couples', category: 'Things to Do', readingTime: 7, sections: ['romantic-dining', 'couples-activities', 'sunset-spots', 'honeymoon-tips'] },
  { id: 'family-activities', title: 'Best Things to Do in [City] with Family', category: 'Things to Do', readingTime: 8, sections: ['kids-attractions', 'family-dining', 'outdoor-fun', 'practical-tips'] },

  // ... Add all remaining 88 topics following the same pattern
  // (Experiences, Attractions, Itineraries, Food, Shopping, Transport, etc.)
];

// ============================================================
// CITY DATABASE
// ============================================================

const CITIES: Record<string, { name: string; country: string }> = {
  'dubai': { name: 'Dubai', country: 'United Arab Emirates' },
  'paris': { name: 'Paris', country: 'France' },
  'bangkok': { name: 'Bangkok', country: 'Thailand' },
  'london': { name: 'London', country: 'United Kingdom' },
  'singapore': { name: 'Singapore', country: 'Singapore' },
  'tokyo': { name: 'Tokyo', country: 'Japan' },
  'istanbul': { name: 'Istanbul', country: 'Turkey' },
  'rome': { name: 'Rome', country: 'Italy' },
  'bali': { name: 'Bali', country: 'Indonesia' },
  'new-york': { name: 'New York', country: 'United States' },
  // Add 190+ more cities...
};

// ============================================================
// CONTENT GENERATION (Plug in your AI API here)
// ============================================================

async function generateArticleContent(city: string, topic: TopicTemplate): Promise<string> {
  const cityInfo = CITIES[city];
  if (!cityInfo) throw new Error(`Unknown city: ${city}`);

  // Replace [City] placeholder in title
  const articleTitle = topic.title.replace(/\[City\]/g, cityInfo.name);

  // TODO: Replace this with actual AI API call
  // Example with Anthropic Claude:
  //
  // const response = await fetch('https://api.anthropic.com/v1/messages', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'x-api-key': process.env.ANTHROPIC_API_KEY!,
  //     'anthropic-version': '2023-06-01',
  //   },
  //   body: JSON.stringify({
  //     model: 'claude-sonnet-4-5-20250929',
  //     max_tokens: 4000,
  //     messages: [{
  //       role: 'user',
  //       content: `Write a comprehensive travel blog article titled "${articleTitle}".
  //         City: ${cityInfo.name}, ${cityInfo.country}
  //         Category: ${topic.category}
  //         Target reading time: ${topic.readingTime} minutes (~${topic.readingTime * 200} words)
  //         Sections to cover: ${topic.sections.join(', ')}
  //
  //         Write in an engaging, informative style. Include practical tips,
  //         specific recommendations, and insider knowledge. Use H2 and H3
  //         headings for structure. Include tables where useful.`
  //     }],
  //   }),
  // });

  // Placeholder content for demo
  const content = `## Welcome to ${cityInfo.name}

This is a placeholder article for "${articleTitle}".

Replace this with AI-generated content by configuring the \`generateArticleContent\` function in \`scripts/generate-content.ts\` with your preferred AI API (Anthropic Claude, OpenAI, etc.).

## What You'll Learn

${topic.sections.map(s => `- ${s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`).join('\n')}

## Getting Started

Configure your API key and run: \`npx tsx scripts/generate-content.ts --city "${city}" --topic "${topic.id}"\`
`;

  return content;
}

// ============================================================
// MARKDOWN FILE GENERATION
// ============================================================

function generateSlug(city: string, topicId: string): string {
  return `${city}/${topicId}`;
}

function generateFrontmatter(city: string, topic: TopicTemplate): string {
  const cityInfo = CITIES[city];
  const title = topic.title.replace(/\[City\]/g, cityInfo.name);
  const slug = `${city}-${topic.id}`;
  const today = new Date().toISOString().split('T')[0];

  return `---
title: "${title}"
description: "Your comprehensive guide to ${title.toLowerCase()}. Expert tips, recommendations, and insider knowledge for travelers."
city: "${cityInfo.name}"
country: "${cityInfo.country}"
category: "${topic.category}"
topic: "${topic.id}"
author: "Travel Team"
pubDate: ${today}
heroImage: "/images/${city}/${topic.id}.jpg"
heroImageAlt: "${cityInfo.name} - ${topic.id.replace(/-/g, ' ')}"
keywords: ["${cityInfo.name}", "${topic.id.replace(/-/g, ' ')}", "${topic.category}"]
tags: ["${cityInfo.name}", "${topic.category}"]
readingTime: ${topic.readingTime}
featured: false
draft: false
---`;
}

async function generateAndSaveArticle(city: string, topic: TopicTemplate): Promise<void> {
  const cityInfo = CITIES[city];
  if (!cityInfo) {
    console.error(`City not found: ${city}`);
    return;
  }

  const frontmatter = generateFrontmatter(city, topic);
  const content = await generateArticleContent(city, topic);
  const markdown = `${frontmatter}\n\n${content}`;

  const outputDir = path.join(process.cwd(), 'src', 'content', 'blog', city);
  fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `${topic.id}.md`);
  fs.writeFileSync(filePath, markdown, 'utf-8');

  console.log(`  Created: ${filePath}`);
}

// ============================================================
// CLI ENTRY POINT
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  const cityArg = args.find(a => a.startsWith('--city='))?.split('=')[1]
    || args[args.indexOf('--city') + 1];
  const topicArg = args.find(a => a.startsWith('--topic='))?.split('=')[1]
    || args[args.indexOf('--topic') + 1];
  const generateAll = args.includes('--all');

  if (!cityArg) {
    console.error('Usage: npx tsx scripts/generate-content.ts --city "dubai" [--topic "complete-travel-guide" | --all]');
    process.exit(1);
  }

  const city = cityArg.toLowerCase().replace(/\s+/g, '-');

  if (generateAll) {
    console.log(`\nGenerating all ${TOPICS.length} articles for ${city}...\n`);
    for (const topic of TOPICS) {
      await generateAndSaveArticle(city, topic);
      // Rate limiting: wait 2 seconds between API calls
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    console.log(`\nDone! Generated ${TOPICS.length} articles for ${city}.`);
  } else if (topicArg) {
    const topic = TOPICS.find(t => t.id === topicArg);
    if (!topic) {
      console.error(`Topic not found: ${topicArg}`);
      console.error(`Available topics: ${TOPICS.map(t => t.id).join(', ')}`);
      process.exit(1);
    }
    console.log(`\nGenerating article: ${topic.title.replace(/\[City\]/g, city)}...\n`);
    await generateAndSaveArticle(city, topic);
    console.log('\nDone!');
  } else {
    console.error('Specify --topic "topic-id" or --all');
    process.exit(1);
  }
}

main().catch(console.error);
