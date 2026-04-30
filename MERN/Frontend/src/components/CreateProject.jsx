import {useState,useEffect} from "react"
import API from "../api/axios.js"

const CreateProject =()=>{
    const [form,setForm] = useState({
        name:"",
        description:"",
        members:[]
    })

    const [users,setUsers] = useState([])

    useEffect(()=>{
        API.get("/users").then(res=> setUsers(res.data))
    },[])

    const handleSubmit = async (e)=>{
        e.preventDefault()
        await API.post("/projects",form)
        toast.succes("Project created")
    }

    return(
        <form onSubmit = {handleSubmit}>
            <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})} />
            <textarea placeholder="Description" onChange={(e)=>setForm({...form,description:e.target.value})} />
            <select multiple onChange={(e)=>setForm({...form,members:Array.from(e.target.selectedOptions,o=> o.value)})}>
                {users.map(u=>(
                    <option key = {u._id}>
                        {u.name} ({u.role})
                    </option>
                ))}
            </select>
            <button>Create Project</button>
        </form>
    )
}