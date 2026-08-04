import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary text-gray-300 py-12 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-black text-primary italic tracking-wider">AUTO</span>
            <span className="text-2xl font-black text-white italic tracking-wider">PARTS</span>
          </Link>
          <p className="text-sm">
            O seu parceiro de confiança para peças automóveis de qualidade superior a preços competitivos.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-bold mb-4 uppercase">Catálogo</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-primary transition-colors">Travões</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Filtros</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Motor</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Suspensão</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4 uppercase">Apoio ao Cliente</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-primary transition-colors">Contactos</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Devoluções</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Perguntas Frequentes</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Seguir Encomenda</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4 uppercase">Métodos de Pagamento</h3>
          <div className="flex gap-2">
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-black font-bold">MBWAY</div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-black font-bold">VISA</div>
            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-black font-bold">MB</div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
        &copy; {new Date().getFullYear()} AutoParts. Todos os direitos reservados.
      </div>
    </footer>
  );
}
