import axios from "axios";
import { list } from "postcss";
const baseUrl = process.env.NEXT_PUBLIC_ORCHESTRA_URL

export const createTask = async (is_highlight: boolean, timestamp: number[][] = []) => {
    try{
        const payload_data = {
            is_highlight,
            timestamp
        }
        const body = {
            payload_data,
        const response = await axios.post(`${baseUrl}/main/create-task`) 
        return response.data
    } catch (error) {
        console.error(error)
    }
}