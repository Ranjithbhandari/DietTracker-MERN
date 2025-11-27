// Simple test component to check if React is working
export default function TestApp() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🎉 React is Working!
      </h1>
      <p style={{ color: '#666', fontSize: '18px' }}>
        If you can see this, React is rendering correctly.
      </p>
      <div style={{ 
        marginTop: '20px', 
        padding: '10px 20px', 
        backgroundColor: '#4CAF50', 
        color: 'white', 
        borderRadius: '5px' 
      }}>
        Test Component Loaded Successfully
      </div>
    </div>
  );
}