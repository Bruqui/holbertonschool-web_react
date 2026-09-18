import { getCurrentYear, getFooterCopy } from '../utils/utils'

function Footer() {
  return (
    // `mt-auto` colle le pied de page au bas de la colonne flex ouverte par
    // `#root`, quelle que soit la hauteur du contenu.
    <div className="App-footer mt-auto border-t-[3px] border-(--main-color) p-5 text-center">
      <p className="italic">
        Copyright {getCurrentYear()} - {getFooterCopy(true)}
      </p>
    </div>
  )
}

export default Footer
