import { useState } from "react"
import { FcGoogle } from "react-icons/fc"

const Login = () => {

  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSubmit = () => {

  }

  return (
    <div className="login">
        <main>
            <h1 className="heading">Login</h1>
            <form action="post" onSubmit={handleSubmit} className="form-filling">
                <div>
                    <label>Username</label>
                    <input type="text" placeholder="enter your username" onChange={(e)=>setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="text" placeholder="enter your password" onChange={(e)=>setPassword(e.target.value)} />
                </div>
                <div>
                    <input type="submit" value="Submit" className="blue"/>
                </div>
            </form>

            <div>
                <p>Already Signed in once</p>
                <button>
                    <FcGoogle/>
                    <span>Sign in with Google</span>
                </button>
            </div>
        </main>
    </div>
  )
}

export default Login