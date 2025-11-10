export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem' }}>404</h1>
      <p>Sorry, this page could not be found.</p>
    </div>
  );
}
