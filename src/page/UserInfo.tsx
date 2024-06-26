import axios from 'axios';
import { useEffect, useState } from 'react'
import Header from './Header'
import { useParams } from 'react-router-dom';

function UserInfo() {
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [flag, setFlag] = useState(true);
    const [originalUserData, setOriginalUserData] = useState({});
    const [title, setTitle] = useState('');
    const [albumData, setAlbumData] = useState([]);
    const [newAl, setNewAl] = useState([]);

    const { id } = useParams();
    console.log(id)

    const handleChangeUserData = (e: ChangeEvent<HTMLInputElement>) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await updateUser();
        setFlag(true);
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleCreateAlbum = async (e) => {
        e.preventDefault();

        const albumData = {
            title: title,
        };

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
                method: 'POST',
                body: JSON.stringify(albumData),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            const newAlbum = await response.json();
            console.log('New album created:', newAlbum.id);
            newAlbum.id = newAl.length + 11;
            setNewAl([...newAl, newAlbum]);
            console.log(newAl);
            setTitle('');
        } catch (error) {
            console.error('Error creating album:', error);
        }
    };

    const fetchData = async () => {
        try {
            const albumPromise = axios.get(`https://jsonplaceholder.typicode.com/users/${id}/albums`);
            const userPromise = axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);

            const [albumResponse, userResponse] = await Promise.all([albumPromise, userPromise]);

            const albumData = albumResponse.data;
            const userData = userResponse.data;

            return { albumData, userData };
        } catch (error) {
            console.error('Error fetching data:', error);
            return { albumData: [], userData: [] };
        }
    };

    useEffect(() => {
        fetchData()
            .then(data => {
                setAlbumData(data.albumData);
                setUserData(data.userData);
                setOriginalUserData(data.userData);
            })
            .catch(error => {
                console.error('Error in useEffect:', error);
            }).finally(() => {
                setIsLoading(false);
            });
    }, [title, newAl]);

    const handleDelete = async (albumId) => {
        try {
            await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`, {
                method: 'DELETE',
            });
            console.log('Album deleted:', albumId);
            const updatedAlbumData = albumData.filter(album => album.id !== albumId);
            setAlbumData(updatedAlbumData);
        } catch (error) {
            console.error('Error deleting album:', error);
        }
    };

    const handleDeleteAl = (albumId) => {
        const updatedNewAl = newAl.filter(album => album.id !== albumId);
        setNewAl(updatedNewAl);
        console.log(newAl)
    };

    const updateUser = async () => {
        try {
            const userResponse = await axios.put(
                `https://jsonplaceholder.typicode.com/users/${id}`,
                {
                    id: 1,
                    email: userData.email,
                    phone: userData.phone,
                    website: userData.website,
                },
                {
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }
            );

            console.log('Updated user data:', userResponse.data);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleEdit = () => {
        setFlag(false);
    }

    const handleReset = () => {
        setUserData(originalUserData);
    };
    return (
        <>
            <Header />
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="py-2 container">
                    <div className="mb-4 row">
                        <div className="col-12">
                            <div className="mb-4 row">
                                <div className="col-6">
                                    <h2 className="h2 fw-bold">{userData.name}</h2>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="d-flex flex-column gap-4">
                                        <div className="row">
                                            <div className="col-12">
                                                <h4 className="h4 text-info">Personal:</h4>
                                            </div>
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-lg-3 col-4">
                                                        <p className="mb-0">Id:</p>
                                                    </div>
                                                    <div className="col-lg-9 col-8">
                                                        <p className="mb-0 fw-bold">{userData.id}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3 col-4">
                                                        <p className="mb-0">Username:</p>
                                                    </div>
                                                    <div className="col-lg-9 col-8">
                                                        <p className="mb-0 fw-bold">{userData.username}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <h4 className="h4 text-info">Address:</h4>
                                            </div>
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-lg-3 col-4">
                                                        <p className="mb-0">Street:</p>
                                                    </div>
                                                    {console.log(userData.address.street)}
                                                    <div className="col-lg-9 col-8">
                                                        <p className="mb-0 fw-bold">{userData.address.street}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3 col-4">
                                                        <p className="mb-0">Suite:</p>
                                                    </div>
                                                    <div className="col-lg-9 col-8">
                                                        <p className="mb-0 fw-bold">{userData.address.suite}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3 col-4">
                                                        <p className="mb-0">City:</p>
                                                    </div>
                                                    <div className="col-lg-9 col-8">
                                                        <p className="mb-0 fw-bold">{userData.address.city}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3 col-4">
                                                        <p className="mb-0">Zipcode:</p>
                                                    </div>
                                                    <div className="col-lg-9 col-8">
                                                        <p className="mb-0 fw-bold">{userData.address.zipcode}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <h4 className="h4 text-info">Company:</h4>
                                            </div>
                                            <div className="col-12">
                                                <div className="row">
                                                    <div className="col-lg-3 col-4">
                                                        <p className="mb-0">Name:</p>
                                                    </div>
                                                    <div className="col-lg-9 col-8">
                                                        <p className="mb-0 fw-bold">{userData.company.name}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3 col-4">
                                                        <p className="mb-0">CatchPhrase:</p>
                                                    </div>
                                                    <div className="col-lg-9 col-8">
                                                        <p className="mb-0 fw-bold">
                                                            {userData.company.catchPhrase}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-3 col-4">
                                                        <p className="mb-0">Bs:</p>
                                                    </div>
                                                    <div className="col-lg-9 col-8">
                                                        <p className="mb-0 fw-bold">{userData.company.bs}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    {flag ? <div className="row">
                                        <div className="col-6">
                                            <div className="d-flex items-center justify-content-between">
                                                <h4 className="h4 text-info">Contact:</h4>
                                            </div>
                                        </div>
                                        <div className="mb-2 col-12">
                                            <div className="row">
                                                <div className="col-lg-3 col-4">
                                                    <p className="mb-0">Email:</p>
                                                </div>
                                                <div className="col-lg-9 col-8">
                                                    <p className="mb-0 fw-bold">{userData.email}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-4">
                                                    <p className="mb-0">Website:</p>
                                                </div>
                                                <div className="col-lg-9 col-8">
                                                    <p className="mb-0 fw-bold">{userData.website}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-4">
                                                    <p className="mb-0">Phone:</p>
                                                </div>
                                                <div className="col-lg-9 col-8">
                                                    <p className="mb-0 fw-bold">{userData.phone}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button type="button" onClick={handleEdit} className="btn btn-success">Edit</button>
                                        </div>
                                    </div> :
                                        <div class="row">
                                            <div class="col-6">
                                                <div class="d-flex items-center justify-content-between">
                                                    <h4 class="h4 text-info">Contact:</h4>
                                                </div>
                                            </div>
                                            <div class="mb-2 col-12">
                                                <form onSubmit={handleFormSubmit}>
                                                    <div class="mb-3 row">
                                                        <div class="col-12">
                                                            <div class="">
                                                                <label for="email" class="form-label">Email:</label><input
                                                                    name="email"
                                                                    class="form-control"
                                                                    placeholder="Email..."
                                                                    onChange={handleChangeUserData}
                                                                    value={userData.email || ''}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="mb-3 row">
                                                        <div class="col-12">
                                                            <div class="">
                                                                <label for="phone" class="form-label">Phone:</label><input
                                                                    name="phone"
                                                                    class="form-control"
                                                                    placeholder="Phone..."
                                                                    value={userData.phone || ''}
                                                                    onChange={handleChangeUserData}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="mb-3 row">
                                                        <div class="col-12">
                                                            <div class="">
                                                                <label for="website" class="form-label">Website:</label><input
                                                                    name="website"
                                                                    class="form-control"
                                                                    placeholder="Website..."
                                                                    value={userData.website || ''}
                                                                    onChange={handleChangeUserData}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-12">
                                                            <div class="d-flex items-center gap-3">
                                                                <button type="submit" disabled="" class="btn btn-success">
                                                                    Submit</button>
                                                                <button type="button" onClick={handleReset} class="btn btn-danger">Reset</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="col-12"></div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="border-top pt-3 mb-3 row">
                                <div className="col-8"><h4 className="h4">Photo Albums:</h4></div>
                            </div>
                            <div className="mb-3 row">
                                <div className="col-6">
                                    <form onSubmit={handleCreateAlbum} className="d-flex items-center gap-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Title of new album"
                                            value={title} onChange={handleTitleChange}
                                        /><button
                                            type="submit"
                                            className="flex-shrink-0 w-25 btn btn-success btn-lg">
                                            New Album
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="row">
                                {albumData.map(album => (
                                    <div className="mb-3 col-md-6" key={album.id}>
                                        <div className="d-flex items-center justify-content-between border rounded text-decoration-none text-black ">
                                            <div className=" py-2 flex-shrink-0 border-end d-flex items-center justify-content-center w-10" style={{ width: "10%" }}>
                                                {album.id}
                                            </div>
                                            <div className="py-2 w-100 px-4 text-truncate fw-bold text-start">
                                                {album.title}
                                            </div>
                                            <div className="text-center flex-shrink-0 w-10 py-2" style={{ width: "10%" }}>
                                                <button type="button" onClick={() => handleDelete(album.id)} className="btn btn-danger btn-sm">X</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {Object.keys(newAl).length > 0 && newAl.map(album => (
                                    <div className="mb-3 col-md-6" key={album.id}>
                                        <div className="d-flex items-center justify-content-between border rounded text-decoration-none text-black ">
                                            <div className="py-2 flex-shrink-0 border-end d-flex items-center justify-content-center w-10" style={{ width: "10%" }}>
                                                {album.id}
                                            </div>
                                            <div className="py-2 w-100 px-4 text-truncate fw-bold text-start">
                                                {album.title}
                                            </div>
                                            <div className="text-center flex-shrink-0 w-10 py-2" style={{ width: "10%" }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteAl(album.id)}
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>
                </div>)}
        </>
    );
}

export default UserInfo