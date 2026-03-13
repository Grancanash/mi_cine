import { Link } from "react-router-dom";
import logo from '@/assets/img/logo.png'

function Navbar({isLoggedIn, onLogout}: {isLoggedIn: boolean, onLogout: () => void}) {
    return(
      <nav className="navbar bg-base-100 shadow p-3">
        <div className="container max-w-250 flex mx-auto">
          <div className="md:pr-10 mt-2 mb-2 mr-3 flex-1 md:flex-auto md:w-auto flex justify-center">
            <Link to="/"><img src={logo} alt="Logo Mi cine" className="h-20 object-contain" /></Link>
          </div>
          <div className="flex flex-col md:justify-between md:flex-row md:items-end ml-0 pl-5 w-full pb-1 flex-1 md:flex-auto gap-1">
            <div className="flex flex-col md:flex-row gap-1">
                <Link className="btn btn-light font-normal h-8" to="/titles">Mi lista</Link>
                <Link className="btn btn-light font-normal h-8" to="/actors">Actores</Link>
            </div>
            {isLoggedIn && (
              <button className="btn bg-primary text-white font-normal b-0 h-8" onClick={onLogout}>
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </nav>
    );
}

export default Navbar;