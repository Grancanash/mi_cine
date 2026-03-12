import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="px-6 py-8 bg-base-300 z-1">
            <div className="container mx-auto text-sm text-base-content/70 flex justify-between items-center">
                <div className="flex-2"><Link to={'/'}>© {new Date().getFullYear()} Mi Cine</Link></div>
                <div className="flex-1 text-center md:text-end hidden md:block">Hecho con <a href="https://www.djangoproject.com/" target="_blank" className="text-primary/70 hover:text-primary">Django</a> + <a href="https://es.react.dev/" target="_blank" className="text-primary/70 hover:text-primary">React</a> + <a href="https://www.typescriptlang.org/" target="_blank" className="text-primary/70 hover:text-primary">TypeScript</a></div>
                <div className="flex-1 md:text-end md:hidden">Hecho con:
                    <ul className="[&>li]:before:content-['-'] [&>li]:before:mr-2 ms-3">
                        <li><a href="https://www.djangoproject.com/" target="_blank" className="text-primary/70 hover:text-primary">Django</a></li>
                        <li><a href="https://es.react.dev/" target="_blank" className="text-primary/70 hover:text-primary">React</a></li>
                        <li><a href="https://www.typescriptlang.org/" target="_blank" className="text-primary/70 hover:text-primary">TypeScript</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer;