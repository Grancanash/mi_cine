function Footer() {
    return (
        <footer className="px-6 bg-base-300">
            <div className="container mx-auto py-4 text-sm text-base-content/70 flex justify-between items-center">
                <span className="flex-1">© {new Date().getFullYear()} Mi Cine</span>
                <span className="flex-1 text-center md:text-end">Hecho con Django + React + TypeScript</span>
            </div>
        </footer>
    )
}

export default Footer;