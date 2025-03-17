import axios from 'axios';

export default function Dashboard() {
    const markAttendance = async () => {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/attendance/mark', {}, { headers: { Authorization: token } });
        alert('Attendance marked!');
    };

    return (
        <div>
            <h2>Member Dashboard</h2>
            <button onClick={markAttendance}>Mark Attendance</button>
        </div>
    );
}
