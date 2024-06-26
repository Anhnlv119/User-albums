import axios from 'axios';
import { useEffect, useState } from 'react'
import Header from './Header'
function PhotoAlbum() {
  const [searchID, setSearchID] = useState(null); 
  const [searchValue, setSearchValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 12;
  const [visibleItems, setVisibleItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [listPhotoData, setListPhotoData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchData = async () => {
    try {
      if (searchID !== null) {
        console.log('id', searchID);
        const responsePhotos = await axios.get(`http://jsonplaceholder.typicode.com/albums/${searchID}/photos`);
        return responsePhotos.data;
      } else {
        const responseUsers = await axios.get('https://jsonplaceholder.typicode.com/users');
        const userIds = responseUsers.data.map(user => user.id);
  
        const albumPromises = userIds.map(uId =>
          axios.get(`http://jsonplaceholder.typicode.com/users/${uId}/albums`)
        );
        const albumResponses = await Promise.all(albumPromises);
        const albumData = albumResponses.flatMap(responseAlbum => responseAlbum.data);
        const albumIds = albumData.map(album => album.id);
  
        const photoPromises = albumIds.map(id =>
          axios.get(`http://jsonplaceholder.typicode.com/albums/${id}/photos`)
        );
        const photoResponses = await Promise.all(photoPromises);
        const photoData = photoResponses.flatMap(response => response.data);
  
        return photoData;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };
  

  const loadMoreItems = async () => {
    setIsLoadingMore(true); 

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * itemsPerPage;
    const newItems = await fetchData();

    setCurrentPage(nextPage);
    setVisibleItems([...visibleItems, ...newItems.slice(startIndex, startIndex + itemsPerPage)]);

    setIsLoadingMore(false); 
  };

  useEffect(() => {
    const initialLoad = async () => {
      const initialItems = await fetchData();
      setListPhotoData(initialItems);
      setVisibleItems(initialItems.slice(0, itemsPerPage));
      setIsLoading(false);
    };
    initialLoad();
  }, [searchID]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchID(searchValue)
    console.log(searchID)
    if (searchID !== null) {
      const filteredPhotos = listPhotoData.filter(photo => photo.albumId === searchID);
      setVisibleItems(filteredPhotos.slice(0, itemsPerPage));
    } else {
      setVisibleItems(listPhotoData.slice(0, itemsPerPage));
    }
  };

  return (
    <>
      <Header />
      <div className="py-2 container">
        <div className="row">
          <div className="col-12"><h2 className="h2 fw-bold">Photos</h2></div>
        </div>
        <div className="my-4 row">
          <div className="col-12">
            <form onSubmit={handleSearch} className="d-flex items-center gap-2">
              <div className>
                <select name="filter" className="form-select"
                ><option value="albumId">Album Id</option></select>
              </div>
              <div className>
                <input
                  name="search"
                  className="form-control"
                  placeholder="Search by album id"
                  onChange={e => setSearchValue(parseInt(e.target.value))}
                />
              </div>
              <button className="btn btn-primary" onClick={handleSearch} >Search</button>
              {console.log(searchID)}
            </form>
          </div>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="row">
              {visibleItems.map(photo => (
                searchID === null || photo.albumId === searchID ? (
                  <div className="mb-4 col-3" key={photo.id}>
                    <div className="w-100 card">
                      <img
                        className="card-img-top"
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                      />
                      <div className="card-body">
                        <div className="w-full text-truncate card-title h5">
                          {photo.title}
                        </div>
                        <p className="mb-1 card-text">Id: #{photo.id}</p>
                        <p className="card-text">Album Id: #{photo.albumId}</p>
                      </div>
                    </div>
                  </div>
                ) : null
              ))}
            </div>
            <div className="row">
              <div className="col-12">
                <div className="w-100 text-center">
                  {isLoadingMore ? (
                    <p>Loading more items...</p>
                  ) : (
                    <button type="button" onClick={loadMoreItems} className="btn btn-primary">
                      Load more
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>)}
      </div>
    </>

  );
}

export default PhotoAlbum
