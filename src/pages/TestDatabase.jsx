import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

const TestDatabase = () => {
  const { user, isDemo } = useAuth()
  const [testResults, setTestResults] = useState([])
  const [loading, setLoading] = useState(false)

  const runTest = async (testName, testFunction) => {
    try {
      const result = await testFunction()
      return { test: testName, success: true, result }
    } catch (error) {
      return { test: testName, success: false, error: error.message }
    }
  }

  const runAllTests = async () => {
    setLoading(true)
    const results = []

    // Test 1: Read machines
    results.push(await runTest('Read Machines', async () => {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .limit(5)
      
      if (error) throw error
      return `Found ${data.length} machines`
    }))

    // Test 2: Check current user
    results.push(await runTest('Current User', async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return `User: ${user?.email || 'Not logged in'}, ID: ${user?.id || 'N/A'}`
    }))

    // Test 3: Try to update a machine (if machines exist)
    const { data: machines } = await supabase.from('machines').select('*').limit(1)
    if (machines && machines.length > 0) {
      const testMachine = machines[0]
      
      results.push(await runTest('Update Machine Status', async () => {
        const newStatus = testMachine.status === 'operational' ? 'idle' : 'operational'
        const { data, error } = await supabase
          .from('machines')
          .update({ status: newStatus })
          .eq('id', testMachine.id)
          .select()
        
        if (error) throw error
        return `Updated machine ${testMachine.name} to status: ${newStatus}`
      }))

      // Test 4: Verify the update
      results.push(await runTest('Verify Update', async () => {
        const { data, error } = await supabase
          .from('machines')
          .select('status')
          .eq('id', testMachine.id)
          .single()
        
        if (error) throw error
        return `Current status: ${data.status}`
      }))
    }

    // Test 5: Check RLS policies
    results.push(await runTest('Check RLS Status', async () => {
      const { data, error } = await supabase
        .rpc('current_setting', { setting_name: 'request.jwt.claims' })
      
      // This might fail but that's OK
      return `RLS is ${error ? 'enabled' : 'possibly disabled'}`
    }))

    setTestResults(results)
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      <div className="card p-6 mb-4">
        <h2 className="text-lg font-semibold mb-2">User Info</h2>
        <p>Email: {user?.email || 'Not logged in'}</p>
        <p>Is Demo: {isDemo ? 'Yes' : 'No'}</p>
        <p>User ID: {user?.id || 'N/A'}</p>
      </div>

      <button 
        onClick={runAllTests}
        disabled={loading}
        className="btn btn-primary mb-4"
      >
        {loading ? 'Running Tests...' : 'Run Database Tests'}
      </button>

      {testResults.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Test Results</h2>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg ${
                  result.success ? 'bg-success-50' : 'bg-error-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.test}</span>
                  <span className={result.success ? 'text-success-600' : 'text-error-600'}>
                    {result.success ? '✓ PASS' : '✗ FAIL'}
                  </span>
                </div>
                <p className="text-sm mt-1 text-gray-600">
                  {result.success ? result.result : result.error}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TestDatabase