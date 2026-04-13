import { createClient } from '@supabase/supabase-js'

// This client uses the SERVICE ROLE key — it bypasses Row Level Security.
// ONLY use this in API routes (server-side). NEVER expose to the browser.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Synthetic Data Global Library ───────────────────────────────────────────
// Fallback pool used when the user hasn't configured their own names/cities.
// campaigns.settings JSON now supports:
//   synthetic_enabled:  boolean  — master on/off switch
//   synthetic_interval: number   — how often (seconds) to show a fake event
//   synthetic_data: {
//     names:    string[]  — custom name pool (falls back to GLOBAL_NAMES)
//     cities:   string[]  — custom city pool (falls back to GLOBAL_CITIES)
//     products: string[]  — custom product pool
//   }
//
// ⚠️  DB NOTE: Remove any NOT NULL / FK constraint on events.user_id so that
//     synthetic events (which have no real user) can be inserted without error.
//     Migration example:
//       ALTER TABLE events ALTER COLUMN user_id DROP NOT NULL;

export const GLOBAL_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Oliver', 'Amelia',
  'Benjamin', 'Harper', 'Lucas', 'Evelyn', 'Henry', 'Abigail', 'Alexander',
  'Emily', 'Michael', 'Elizabeth', 'Daniel', 'Sofia', 'Jacob', 'Avery',
  'Logan', 'Ella', 'Jackson', 'Scarlett', 'Sebastian', 'Grace', 'Aiden',
  'Chloe', 'Matthew', 'Victoria', 'Samuel', 'Riley', 'David', 'Aria',
  'Joseph', 'Lily', 'Carter', 'Aubrey', 'Owen', 'Zoey', 'Wyatt',
]

export const GLOBAL_CITIES = [
  // USA
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
  'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
  'Seattle', 'Denver', 'Boston', 'Nashville', 'Portland', 'Las Vegas',
  // International
  'London', 'Toronto', 'Sydney', 'Melbourne', 'Auckland', 'Dublin',
  'Amsterdam', 'Berlin', 'Paris', 'Madrid', 'Singapore', 'Tokyo',
]

// City → US state mapping — used for geographic mirroring in the event route.
export const CITY_STATE_MAP: Record<string, string> = {
  'Los Angeles': 'California', 'San Diego': 'California', 'San Jose': 'California',
  'San Francisco': 'California', 'Sacramento': 'California', 'Fresno': 'California',
  'New York': 'New York', 'Buffalo': 'New York', 'Albany': 'New York',
  'Houston': 'Texas', 'Dallas': 'Texas', 'San Antonio': 'Texas', 'Austin': 'Texas',
  'Chicago': 'Illinois', 'Springfield': 'Illinois',
  'Phoenix': 'Arizona', 'Tucson': 'Arizona', 'Scottsdale': 'Arizona',
  'Philadelphia': 'Pennsylvania', 'Pittsburgh': 'Pennsylvania',
  'Seattle': 'Washington', 'Spokane': 'Washington',
  'Denver': 'Colorado', 'Boulder': 'Colorado',
  'Miami': 'Florida', 'Orlando': 'Florida', 'Tampa': 'Florida', 'Jacksonville': 'Florida',
  'Boston': 'Massachusetts', 'Cambridge': 'Massachusetts',
  'Nashville': 'Tennessee', 'Memphis': 'Tennessee',
  'Portland': 'Oregon', 'Eugene': 'Oregon',
  'Las Vegas': 'Nevada', 'Reno': 'Nevada',
  }
