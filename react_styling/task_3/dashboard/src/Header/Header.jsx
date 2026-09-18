import holbertonLogo from '../assets/holberton-logo.jpg'

function Header() {
  return (
    <div className="App-header flex items-center gap-5 px-5 py-2.5 border-b-[3px] border-(--main-color)">
      <img src={holbertonLogo} alt="holberton logo" className="w-50" />
      {/* Le preflight remet les titres à `font-size: inherit` et
          `font-weight: inherit` : taille et graisse sont donc explicites. */}
      <h1 className="text-[2rem] font-bold text-(--main-color)">
        School dashboard
      </h1>
    </div>
  )
}

export default Header
