import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jmhccdjhxhkwomiiefhp.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptaGNjZGpoeGhrd29taWllZmhwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc5Nzk1OSwiZXhwIjoyMDc3MzczOTU5fQ.6WdG1UlKuR9s37KdWGs8DRTFFHafYCt1_2q8b64RcDA'
const supabase = createClient(supabaseUrl, serviceRoleKey)

async function migrateUsers() {
  // read your manually inserted users
  const { data: users, error: fetchError } = await supabase
    .from('users')
    .select('email, password')

  if (fetchError) return console.error(fetchError)

  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    })
    if (error) console.error(`Error creating ${user.email}:`, error.message)
    else console.log(`✅ Migrated ${user.email}`)
  }
}

migrateUsers()
