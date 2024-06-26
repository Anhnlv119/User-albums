import { createBrowserRouter, redirect } from "react-router-dom"
import Home from "../page/ListUsers"
import PhotoAlbum from "../page/PhotoAlbum"
import UserInfo from "../page/UserInfo"
const router = createBrowserRouter([
    {
        path: '/',
        loader: () => {
            return redirect('/users')
        }
    },
    {
        path: '/users',
        element: <Home />
    },
    {
        path: '/photos',
        element: <PhotoAlbum />
    },
    {
        path: '/users/:id',
        element: <UserInfo />
    },

])

export default router