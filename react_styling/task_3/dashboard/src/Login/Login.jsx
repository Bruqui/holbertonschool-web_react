import WithLogging from '../HOC/WithLogging'

function Login() {
  return (
    <div className="App-login border-t-[3px] border-(--main-color) pt-5">
      <p className="text-[1.1rem] mb-6.25">
        Login to access the full dashboard
      </p>
      {/* Le formulaire est une rangée flex qui repasse à la ligne sur les
          petits écrans, plutôt qu'une suite d'éléments en ligne. */}
      <div className="flex flex-wrap items-center">
        <label htmlFor="email" className="mr-2">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="mr-5 border border-gray-400 rounded px-2 py-1"
        />
        <label htmlFor="password" className="mr-2">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="mr-5 border border-gray-400 rounded px-2 py-1"
        />
        <button
          type="submit"
          className="border border-gray-400 rounded px-4 py-1 cursor-pointer"
        >
          OK
        </button>
      </div>
    </div>
  )
}

// Exported wrapped, so every mount and unmount of the form is logged.
const LoginWithLogging = WithLogging(Login)

export default LoginWithLogging
