import { supabase } from '@/lib/supabase'

export const testDatabaseConnection = async () => {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test 1: Check if we can connect
    const { data: testData, error: connectionError } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError.message)
      return {
        success: false,
        error: connectionError.message,
        details: 'Could not connect to database'
      }
    }
    
    // Test 2: Count tables
    const tables = ['products', 'machines', 'employees', 'materials', 'productions']
    const counts = {}
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        counts[table] = `Error: ${error.message}`
      } else {
        counts[table] = count || 0
      }
    }
    
    console.log('✅ Database connection successful!')
    console.log('📊 Table counts:', counts)
    
    return {
      success: true,
      message: 'Database connection successful',
      tables: counts,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return {
      success: false,
      error: error.message,
      details: 'Unexpected error during connection test'
    }
  }
}

// Auto-run test in development
if (import.meta.env.DEV) {
  testDatabaseConnection().then(result => {
    if (result.success) {
      console.log('🎉 Müller MES: Database ready!', result)
    } else {
      console.error('⚠️ Müller MES: Database not configured', result)
      console.log('📖 Please follow the setup instructions in supabase/setup-database.md')
    }
  })
}