import axios from 'axios';
import { useEffect, useState } from 'react'
import Header from './Header';
import {useNavigate } from 'react-router-dom';

function ListUsers() {
    const [users, setUsers] = useState()
    const [isLoading, setIsLoading] = useState(true);

    const componentDidMount = async () => {
        axios.get("https://jsonplaceholder.typicode.com/users")
        .then(response => {
          const data = response.data;
          setUsers(data);
          setIsLoading(false); 
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          setIsLoading(false); 
        });
    }

    useEffect(() => {
        componentDidMount()
    }, [])

    const navigate = useNavigate();
    const handleUserClick = (userId) => {
        navigate(`/users/${userId}`); // Use navigate function
    };

    return (

        <div className="App">
            <Header/>
            <div className="py-2 container">
                <div className="row">
                    <div className="col-12"><h2 className="h2 fw-bold">Users</h2></div>
                    <div className="col-12">
                        <table className="table table-striped table-hover">
                            <thead className>
                                <tr>
                                    <th>id</th>
                                    <th>name</th>
                                    <th>username</th>
                                    <th>email</th>
                                    <th>phone</th>
                                    <th>website</th>
                                    <th>city</th>
                                    <th>Company Name</th>
                                </tr>
                            </thead>
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <tbody className>
                                    {users.map(user => (
                                        
                                        <tr className="cursor-pointer" key={user.id} onClick={() => handleUserClick(user.id)}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.website}</td>
                                            <td>{user.address.city}</td>
                                            <td>{user.company.name}</td>
                                        </tr>
                                       
                                    ))}
                                </tbody>)}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListUsers