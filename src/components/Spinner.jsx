export default function Spinner() {
    return (
        <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #ccc',
            borderTopColor: '#333',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '40px auto',
        }} />
    )
}