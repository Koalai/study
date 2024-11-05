import { useState} from "react"
import axios from "axios"

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  const getAll = async () => {
    try {
      const response = await axios.get(baseUrl)
      setResources(response.data)
    } catch (error) {
      console.error("Failed to fetch resources.")
    }
  }

  const create = async (newResource) => {
    try {
      const response = await axios.post(baseUrl, newResource)
      setResources((prevResources) => [...prevResources, response.data])
    } catch (error) {
      console.error("Failed to create resource.")
    }
  }

  const update = async (id, updatedResource) => {
    try {
      const response = await axios.put(`${baseUrl}/${id}`, updatedResource)
      setResources((prevResources) =>
        prevResources.map((resource) =>
          resource.id === id ? response.data : resource
        )
      )
    } catch (error) {
      console.error("Failed to update resource.")
    }
  }

  const remove = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`)
      setResources((prevResources) =>
        prevResources.filter((resource) => resource.id !== id)
      )
    } catch (error) {
      console.error("Failed to delete resource.")
    }
  }


  const service = {
    create,
    update,
    remove,
    getAll,
  }

  return [resources, service]
}

