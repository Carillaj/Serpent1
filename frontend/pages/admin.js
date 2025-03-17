import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function AdminDashboard() {
    const [records, setRecords] = useState([]);
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState('');
    const router = useRouter();
    const [token, setToken] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                router.push('/login');
            } else {
                setToken(storedToken);
                verifyAdmin(storedToken);
                fetchAttendanceRecords(storedToken);
                fetchUsers(storedToken);
            }
        }
    }, []);

    const verifyAdmin = async (token) => {
        try {
            const res = await axios.get('http://localhost:5000/auth/me', { headers: { Authorization: token } });
            setRole(res.data.role);
            if (res.data.role !== 'admin') {
                alert('Access Denied');
                router.push('/dashboard');
            }
        } catch (err) {
            alert('Session expired. Please log in again.');
            router.push('/login');
        }
    };

    const fetchAttendanceRecords = async (token) => {
        try {
            const res = await axios.get('http://localhost:5000/attendance/records', {
                headers: { Authorization: token }
            });
            setRecords(res.data);
        } catch (err) {
            alert('Error fetching attendance records.');
            console.error(err);
        }
    };

    const fetchUsers = async (token) => {
        try {
            const res = await axios.get('http://localhost:5000/admin/users', {
                headers: { Authorization: token }
            });
            setUsers(res.data);
        } catch (err) {
            alert('Error fetching users.');
            console.error(err);
        }
    };

    const downloadCSV = () => {
        window.open('http://localhost:5000/attendance/export/csv', '_blank');
    };

    const downloadPDF = () => {
        window.open('http://localhost:5000/attendance/export/pdf', '_blank');
    };

    const promoteUser = async (userId) => {
        try {
            const res = await axios.put(`http://localhost:5000/admin/promote/${userId}`, {}, {
                headers: { Authorization: token }
            });
            alert(res.data.message);
            fetchUsers(token); // Refresh user list
        } catch (err) {
            alert('Error promoting user.');
            console.error(err);
        }
    };

    return role === 'admin' ? (
        <div>
            <h2>Admin Dashboard</h2>

            <h3>Attendance Records</h3>
            <button onClick={downloadCSV}>Download CSV</button>
            <button onClick={downloadPDF}>Download PDF</button>
            <ul>
                {records.map((record, index) => (
                    <li key={index}>{record.username} - {new Date(record.timestamp).toLocaleString()}</li>
                ))}
            </ul>

            <h3>Registered Users</h3>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        {user.username} ({user.role})  
                        {user.role !== 'admin' && (
                            <button onClick={() => promoteUser(user._id)}>Promote to Admin</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    ) : null;
}
