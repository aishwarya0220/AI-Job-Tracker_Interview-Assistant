import apiRequest from "../utils/api"

export default function RegisterPage(){
    return (
        <form>
            <input
                type="text"
                name="username"
            />

            <input
                type="text"
                name="email"
            />

            <input
                type="text"
                name="password"
            />

            <button
                type="submit"
            >

            </button>
        </form>

        // <form onSubmit={apiRequest}/>
    )
}