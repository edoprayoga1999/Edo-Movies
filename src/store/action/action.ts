import { getMovieList, getMovieDetail } from "./actionTypes";
import axios from "axios";

const apiKey: string = "c2d05d46e415ec45bf44ae16885229f3"

export const getPopularMovies = (page: number) => {
    return async (dispatch: any) => {
        try {
            dispatch({
                type: getMovieList.SET_LOADING_MOVIE_LIST,
                payload: true
            })
            const url: string = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`
            const result = await axios.get(url)
            dispatch({
                type: getMovieList.SET_LOADING_MOVIE_LIST,
                payload: false
            })
            dispatch({
                type: getMovieList.SET_MOVIE_LIST,
                payload: result?.data
            })

        } catch (error) {
            dispatch({
                type: getMovieList.SET_LOADING_MOVIE_LIST,
                payload: false
            })
            dispatch({
                type: getMovieList.SET_MOVIE_LIST,
                payload: {}
            })
        }
    }
}